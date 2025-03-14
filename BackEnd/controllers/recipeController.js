require("dotenv").config();
const RecipeModel = require("../models/recipeModel");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

const SPOONACULAR_API_BASE = "https://api.spoonacular.com/recipes";
const API_KEYS = [
  process.env.SPOONACULAR_API_KEY_1,
  process.env.SPOONACULAR_API_KEY_2,
  process.env.SPOONACULAR_API_KEY_3,
  process.env.SPOONACULAR_API_KEY_4,
].filter(Boolean);

console.log("Loaded API Keys:", API_KEYS);

const fetchFromSpoonacular = async (url) => {
  console.log("Fetching from Spoonacular:", url);
  if (!API_KEYS.length) throw new Error("No API keys configured");

  for (const apiKey of API_KEYS) {
    try {
      const separator = url.includes("?") ? "&" : "?";
      const fullUrl = `${url}${separator}apiKey=${apiKey}`;
      console.log(`Using API Key: ${apiKey}`);

      const response = await fetch(fullUrl);
      console.log(`Response Status: ${response.status}`);

      if (!response.ok) {
        if ([402, 429].includes(response.status)) {
          console.warn(`API key ${apiKey} is rate-limited. Trying next key.`);
          continue;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error with API key ${apiKey}:`, error.message);
    }
  }

  throw new Error("All API keys exhausted or failed");
};

exports.getAllRecipes = async (req, res) => {
  console.log("Fetching all recipes...");

  try {
    if (!Array.isArray(API_KEYS) || API_KEYS.length === 0) {
      return res.status(500).json({ error: "No API keys configured" });
    }

    const apiUrl = `${SPOONACULAR_API_BASE}/random?number=100`;
    console.log("Fetching from Spoonacular API:", apiUrl);

    const data = await fetchFromSpoonacular(apiUrl);

    if (!data || !data.recipes || !Array.isArray(data.recipes)) {
      return res.status(404).json({ error: "No recipes found" });
    }

    console.log(`Fetched ${data.recipes.length} recipes.`);
    res.status(200).json({ recipes: data.recipes });

  } catch (error) {
    console.error("Error fetching recipes:", error.stack || error.message);

    // Handling API rate limits or specific error messages
    const errorMessage =
      error.response?.status === 429
        ? "API rate limit exceeded. Please try again later."
        : "Failed to fetch recipes";

    res.status(500).json({ error: errorMessage, details: error.message });
  }
};


exports.searchRecipe = async (req, res) => {
  console.log("Searching for recipe...", req.query);

  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters long" });
    }

    const apiUrl = `${SPOONACULAR_API_BASE}/complexSearch?query=${encodeURIComponent(query.trim())}`;
    console.log("Fetching from Spoonacular:", apiUrl);

    const data = await fetchFromSpoonacular(apiUrl);

    if (!data || !data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No recipes found for the given query" });
    }

    console.log("Search Results:", data.results.length, "recipes found.");
    res.status(200).json({ recipes: data.results });

  } catch (error) {
    console.error("Error searching recipes:", error.stack);
    res.status(500).json({ error: "Failed to search recipes", details: error.message });
  }
};


exports.getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    console.log("Fetching saved recipes for user:", userId);

    const user = await UserModel.findById(userId).populate({
      path: "savedRecipes",
      select: "recipeId title image vegan readyInMinutes healthScore servings" // Select only necessary fields
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User Saved Recipes:", user.savedRecipes);
    res.status(200).json({ savedRecipes: user.savedRecipes });

  } catch (error) {
    console.error("Error fetching saved recipes:", error.stack);
    res.status(500).json({ error: "Failed to fetch saved recipes", details: error.message });
  }
};


exports.updateSavedRecipesOrder = async (req, res) => {
  console.log("Updating saved recipe order:", req.body);

  try {
    const { recipeIds } = req.body;
    
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res.status(400).json({ error: "Invalid or empty recipe IDs array" });
    }

    // Validate each recipe ID
    if (!recipeIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const userId = req.user.id || req.user._id;
    console.log("User ID:", userId);

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Current Saved Recipes:", user.savedRecipes);

    user.savedRecipes = recipeIds.map(id => new mongoose.Types.ObjectId(id));
    await user.save();

    console.log("Updated Saved Recipes Order:", user.savedRecipes);

    res.status(200).json({ message: "Recipe order updated successfully", savedRecipes: user.savedRecipes });

  } catch (error) {
    console.error("Error updating recipe order:", error.stack);
    res.status(500).json({ error: "Failed to update recipe order", details: error.message });
  }
};


exports.deleteSavedRecipe = async (req, res) => {
  console.log("Deleting saved recipe:", req.params.recipeId);

  try {
    const { recipeId } = req.params;

    if (!recipeId) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found, checking recipe...");

    const deletedRecipe = await RecipeModel.findOneAndDelete({ _id: recipeId, userId: req.user.id });
    
    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found or unauthorized" });
    }

    // Remove from user's saved recipes array
    user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId);
    await user.save();

    console.log("Recipe deleted successfully:", deletedRecipe);
    res.status(200).json({ message: "Recipe deleted successfully" });

  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};


exports.saveRecipe = async (req, res) => {
  console.log("Saving new recipe:", req.body);
  try {
    const { recipeId, title, image, vegan, readyInMinutes, healthScore, servings } = req.body;

    if (!recipeId || !title || !image) {
      return res.status(400).json({ error: "Missing required fields: recipeId, title, or image" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingRecipe = await RecipeModel.findOne({ recipeId, userId: req.user.id });
    if (existingRecipe) {
      return res.status(409).json({ error: "Recipe already saved" });
    }

    const newRecipe = new RecipeModel({
      recipeId,
      userId: req.user.id,
      title,
      image,
      vegan,
      readyInMinutes,
      healthScore,
      servings
    });

    await newRecipe.save();
    user.savedRecipes.push(newRecipe._id);
    await user.save();

    console.log("Recipe saved successfully:", newRecipe);
    res.status(201).json({ message: "Recipe saved!", recipe: newRecipe });

  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ error: "Failed to save recipe" });
  }
};


exports.getRecipeById = async (req, res) => {
  console.log("Fetching recipe by ID:", req.params.id);
  try {
    const { id } = req.params;
    const data = await fetchFromSpoonacular(`${SPOONACULAR_API_BASE}/${id}/information`);
    
    console.log("Fetched Recipe Data:", data);
    if (!data) return res.status(404).json({ error: "Recipe not found" });

    res.status(200).json(data || {});
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};
