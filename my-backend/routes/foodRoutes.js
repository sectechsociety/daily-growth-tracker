const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const CalorieEntry = require("../models/CalorieEntry");
const User = require("../models/User");

// Middleware to get user from token (assuming you have auth middleware)
const authenticateUser = (req, res, next) => {
  // For now, we'll assume userId is passed in the request
  // In a real app, you'd validate JWT token here
  const userId = req.headers.userid || req.body.userId;
  if (!userId) {
    return res.status(401).json({ error: "User ID required" });
  }
  req.userId = userId;
  next();
};

// Get all foods for a user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { category, isFavorite, search } = req.query;
    let query = { userId: req.userId };

    if (category) {
      query.category = category;
    }

    if (isFavorite === 'true') {
      query.isFavorite = true;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foods = await Food.find(query).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific food item
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const food = await Food.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json(food);
  } catch (error) {
    console.error("Error fetching food:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new food/meal
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { name, calories, category, servingSize, brand, notes, nutrition } = req.body;

    if (!name || !calories) {
      return res.status(400).json({ error: "Name and calories are required" });
    }

    const food = new Food({
      userId: req.userId,
      name,
      calories: parseInt(calories),
      category: category || "snack",
      servingSize,
      brand,
      notes,
      nutrition,
    });

    await food.save();

    // Update user's total meals logged
    await User.findByIdAndUpdate(req.userId, {
      $inc: { totalMealsLogged: 1 }
    });

    res.status(201).json(food);
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a food item
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { name, calories, category, servingSize, brand, notes, nutrition, isFavorite } = req.body;

    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        name,
        calories: parseInt(calories),
        category,
        servingSize,
        brand,
        notes,
        nutrition,
        isFavorite,
      },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json(food);
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a food item
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Toggle favorite status
router.patch("/:id/favorite", authenticateUser, async (req, res) => {
  try {
    const food = await Food.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    food.isFavorite = !food.isFavorite;
    await food.save();

    res.json(food);
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get common foods (predefined database)
router.get("/common/list", async (req, res) => {
  try {
    const commonFoods = [
      // Breakfast items
      { name: "Scrambled Eggs (2 eggs)", calories: 140, category: "breakfast" },
      { name: "Oatmeal (1 cup cooked)", calories: 150, category: "breakfast" },
      { name: "Whole Wheat Toast (1 slice)", calories: 80, category: "breakfast" },
      { name: "Banana (1 medium)", calories: 105, category: "breakfast" },
      { name: "Greek Yogurt (6oz)", calories: 100, category: "breakfast" },

      // Lunch items
      { name: "Grilled Chicken Breast (4oz)", calories: 180, category: "lunch" },
      { name: "Brown Rice (1 cup cooked)", calories: 220, category: "lunch" },
      { name: "Mixed Green Salad", calories: 50, category: "lunch" },
      { name: "Quinoa (1 cup cooked)", calories: 220, category: "lunch" },
      { name: "Turkey Sandwich", calories: 320, category: "lunch" },

      // Dinner items
      { name: "Salmon (4oz)", calories: 200, category: "dinner" },
      { name: "Sweet Potato (medium)", calories: 100, category: "dinner" },
      { name: "Broccoli (1 cup)", calories: 55, category: "dinner" },
      { name: "Lean Beef (4oz)", calories: 250, category: "dinner" },
      { name: "Pasta (1 cup cooked)", calories: 200, category: "dinner" },

      // Snacks
      { name: "Apple (1 medium)", calories: 80, category: "snack" },
      { name: "Almonds (1 oz, 23 nuts)", calories: 160, category: "snack" },
      { name: "Protein Bar", calories: 190, category: "snack" },
      { name: "Carrot Sticks (1 cup)", calories: 50, category: "snack" },
      { name: "Hummus (2 tbsp)", calories: 80, category: "snack" },

      // Beverages
      { name: "Black Coffee (8oz)", calories: 2, category: "beverage" },
      { name: "Green Tea (8oz)", calories: 0, category: "beverage" },
      { name: "Orange Juice (8oz)", calories: 110, category: "beverage" },
      { name: "Protein Shake", calories: 120, category: "beverage" },
      { name: "Water (8oz)", calories: 0, category: "beverage" },
    ];

    res.json(commonFoods);
  } catch (error) {
    console.error("Error fetching common foods:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
