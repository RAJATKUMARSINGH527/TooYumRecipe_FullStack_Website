const express = require("express");
const {
  getAllRecipes,
  searchRecipe,
  getSavedRecipes,
  updateSavedRecipesOrder,
  deleteSavedRecipe,
  saveRecipe,
  getRecipeById,
} = require("../controllers/recipeController");
const verifyToken = require("../middleware/validation");

const recipeRouter = express.Router();

recipeRouter.get("/", getAllRecipes);
recipeRouter.get("/search", searchRecipe);
recipeRouter.get("/saved", verifyToken, getSavedRecipes);
recipeRouter.put("/saved/order", verifyToken, updateSavedRecipesOrder);
recipeRouter.delete("/saved/:recipeId", verifyToken, deleteSavedRecipe);

recipeRouter.post("/save", verifyToken, saveRecipe);
recipeRouter.get("/:id", getRecipeById);

module.exports = { recipeRouter };
