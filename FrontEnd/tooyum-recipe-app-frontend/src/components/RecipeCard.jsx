import React from "react";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, onViewDetails, onSaveRecipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <button onClick={() => onViewDetails(recipe)}>View Details</button>
      <button className="save-btn" onClick={() => onSaveRecipe(recipe)}>Save Recipe</button>
    </div>
  );
};

export default RecipeCard;
