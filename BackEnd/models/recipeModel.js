const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipeId: { type: Number, required: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    image: { type: String, required: true },
    vegan: { type: Boolean, required: true },
    healthScore: { type: Number, required: true },
    servings: { type: Number, required: true },
    readyInMinutes: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = RecipeModel;
