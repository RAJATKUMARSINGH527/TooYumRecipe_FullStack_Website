const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipeId: { type: Number, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    vegan: { type: Boolean, required: true },
    readyInMinutes: { type: Number, required: true },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false, 
  }
);

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = RecipeModel;
