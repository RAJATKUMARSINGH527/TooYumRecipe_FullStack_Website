const RecipeModel = require("../models/recipeModel");
require("dotenv").config();


exports.searchRecipes = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=&apiKey=${process.env.SPOONACULAR_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
};

exports.saveRecipe = async (req, res) => {
  const { userId, title, image } = req.body;
  try {
    const count = await RecipeModel.countDocuments({ userId });
    const newRecipe = await RecipeModel.create({ userId, title, image, order: count + 1 });
    res.json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: "Error saving recipe" });
  }
};

exports.reorderRecipes = async (req, res) => {
  const { userId, reorderedList } = req.body;
  try {
    for (let i = 0; i < reorderedList.length; i++) {
      await RecipeModel.findByIdAndUpdate(reorderedList[i].id, { order: i + 1 });
    }
    res.json({ message: "Reordering successful" });
  } catch (error) {
    res.status(500).json({ error: "Error reordering recipes" });
  }
};

