const express = require("express");
const { searchRecipes, saveRecipe, reorderRecipes } = require("../controllers/recipeController");
const verifyToken = require("../middleware/validation");

const recipeRouter = express.Router();

recipeRouter.get("/search",searchRecipes);
recipeRouter.post("/save",verifyToken, saveRecipe);
recipeRouter.post("/reorder",verifyToken, reorderRecipes);

module.exports = recipeRouter;
