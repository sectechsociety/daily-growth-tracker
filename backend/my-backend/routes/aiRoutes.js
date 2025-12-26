const express = require("express");
const axios = require("axios");

const router = express.Router();

// Simple in-memory rate limiter per IP
// e.g., max 10 AI requests per 60 seconds per client
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 10;
const rateBuckets = new Map(); // key: ip, value: { count, resetTime }

function aiRateLimiter(req, res, next) {
  const now = Date.now();
  const ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    "global";

  let bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetTime) {
    bucket = { count: 0, resetTime: now + RATE_WINDOW_MS };
  }

  bucket.count += 1;
  rateBuckets.set(ip, bucket);

  if (bucket.count > RATE_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.resetTime - now) / 1000)
    );
    res.set("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      error: "Too many AI requests. Please slow down.",
      resetIn: retryAfterSeconds,
    });
  }

  return next();
}

router.post("/aura", aiRateLimiter, async (req, res) => {
  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'prompt' in request body." });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error(
        "[AI ROUTE] Missing GEMINI_API_KEY (or GOOGLE_GEMINI_API_KEY/VITE_GEMINI_API_KEY). Set it in backend/my-backend/.env"
      );
      return res
        .status(500)
        .json({ error: "AI service is not configured on the server." });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    const response = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15_000,
    });

    const data = response.data || {};
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not generate a response.";

    return res.json({ reply });
  } catch (err) {
    console.error("[AI ROUTE] Error while calling Gemini:", err?.message || err);

    // If provider returned 429, propagate as 429
    const status = err.response?.status;
    if (status === 429) {
      const retryAfterHeader =
        err.response.headers?.["retry-after"] ||
        err.response.headers?.["Retry-After"];
      const retryAfterSeconds = retryAfterHeader
        ? Number.parseInt(retryAfterHeader, 10) || 30
        : 30;

      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        error: "AI provider is receiving too many requests. Please wait and try again.",
        resetIn: retryAfterSeconds,
      });
    }

    return res.status(500).json({
      error: "Failed to fetch AI response.",
      details: err.response?.data?.error?.message || err.message || "Unknown error",
    });
  }
});

module.exports = router;
