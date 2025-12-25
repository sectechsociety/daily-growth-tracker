const functions = require('firebase-functions');
const { genai } = require('@google-ai/generative-ai');

// Initialize Vertex AI client
const client = new genai.Client({
  vertexai: true,
  apiKey: functions.config().genai.key, // safer than hardcoding
});

// HTTP function to describe an image
exports.describeImage = functions.https.onRequest(async (req, res) => {
  try {
    const IMAGE_URI = "gs://generativeai-downloads/images/scones.jpg";
    const model = "gemini-2.5-flash-lite-preview-09-2025";

    const response = await client.models.generateContent({
      model: model,
      contents: [
        "What is shown in this image?",
        { fileUri: IMAGE_URI, mimeType: "image/png" },
      ],
    });

    res.send(response.text);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
