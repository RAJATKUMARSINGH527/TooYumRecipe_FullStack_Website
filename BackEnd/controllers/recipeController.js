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
    if (!API_KEYS.length) return res.status(500).json({ error: "No API keys configured" });

    const data = await fetchFromSpoonacular(`${SPOONACULAR_API_BASE}/random?number=100`);
    console.log("Fetched Recipes Data:", data);

    if (!data || !data.recipes) return res.status(500).json({ error: "No recipes found" });
    res.status(200).json(data.recipes || []);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

exports.searchRecipe = async (req, res) => {
  console.log("Searching for recipe...", req.query);
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const data = await fetchFromSpoonacular(
      `${SPOONACULAR_API_BASE}/complexSearch?query=${encodeURIComponent(query)}`
    );
    console.log("Search Results:", data);

    res.status(200).json(data.results);
  } catch (error) {
    console.error("Error searching recipes:", error.message);
    res.status(400).json({ error: error.message || "Failed to search recipes" });
  }
};

exports.getSavedRecipes = async (req, res) => {
  console.log("Fetching saved recipes for user:", req.user.id);
  try {
    const user = await UserModel.findById(req.user.id).populate("savedRecipes");
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("User Saved Recipes:", user.savedRecipes);
    res.status(200).json(user.savedRecipes || []);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
};

exports.updateSavedRecipesOrder = async (req, res) => {
  console.log("Updating saved recipe order:", req.body);
  try {
    const { recipeIds } = req.body;
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res.status(400).json({ error: "Invalid recipe IDs" });
    }

    const userId = req.user.id || req.user._id;
    console.log("User ID:", userId);

    const user = await UserModel.findById(userId).populate("savedRecipes");
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("Current Saved Recipes:", user.savedRecipes);
    
    user.savedRecipes = recipeIds.map((id) => new mongoose.Types.ObjectId(id));
    await user.save();

    console.log("Updated Saved Recipes Order:", user.savedRecipes);

    const updatedUser = await UserModel.findById(userId).populate("savedRecipes");
    res.status(200).json(updatedUser.savedRecipes);
  } catch (error) {
    console.error("Error updating recipe order:", error.stack);
    res.status(500).json({ error: "Failed to update recipe order", details: error.message });
  }
};

exports.deleteSavedRecipe = async (req, res) => {
  console.log("Deleting saved recipe:", req.params.recipeId);
  try {
    const { recipeId } = req.params;

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("User found, checking recipe...");
    
    const recipe = await RecipeModel.findOne({ _id: recipeId, userId: req.user.id });
    if (!recipe) return res.status(404).json({ error: "Recipe not found or unauthorized" });

    console.log("Recipe found, deleting...");

    user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId);
    await user.save();

    const deletedRecipe = await RecipeModel.findByIdAndDelete(recipeId);
    console.log("Deleted Recipe:", deletedRecipe);

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};

exports.saveRecipe = async (req, res) => {
  console.log("Saving new recipe:", req.body);
  try {
    const { recipeId, title, image, vegan, readyInMinutes, nutrition } = req.body;
    
    const existingRecipe = await fetchFromSpoonacular(`${SPOONACULAR_API_BASE}/${recipeId}/information`);
    console.log("Recipe exists in Spoonacular:", existingRecipe);

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newRecipe = new RecipeModel({
      recipeId,
      userId: req.user.id,
      title,
      image,
      vegan,
      readyInMinutes,
      nutrition: {
        calories: nutrition?.calories || 0,
        protein: nutrition?.protein || 0,
        fat: nutrition?.fat || 0,
        carbs: nutrition?.carbs || 0,
      },
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
