const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: [String],
  instructions: String,
  nutrition: Object,
  order: { type: Number }
}, { versionKey: false }, { timestamps: true });

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = RecipeModel;
