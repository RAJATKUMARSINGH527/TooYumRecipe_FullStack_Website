import React, { useState, useEffect } from "react";
import { Heart, XCircle } from "lucide-react";
import "./Favourite.css";

const FavoriteRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("likedRecipes")) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (idMeal) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.idMeal !== idMeal);
    setFavorites(updatedFavorites);
    localStorage.setItem("likedRecipes", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorites-container">
      <h1 className="title">Your Favorite Recipes ❤️</h1>
      <p className="subtitle">Discover and manage your saved recipes</p>
      {favorites.length === 0 ? (
        <p className="no-favorites">No favorite recipes yet! Start liking some.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((recipe) => (
            <div key={recipe.idMeal} className="favorite-card">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="favorite-image"
                onClick={() => setSelectedRecipe(recipe)}
              />
              <h3 className="recipe-title">{recipe.strMeal}</h3>
              <button className="unlike-button" onClick={() => removeFavorite(recipe.idMeal)}>
                <Heart className="icon liked" /> Unlike
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setSelectedRecipe(null)} className="close-button">
              <XCircle className="close-icon" />
            </button>
            <h2>{selectedRecipe.strMeal}</h2>
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              className="modal-image"
            />
            <p className="modal-description">Enjoy this delicious recipe! Click on ❌ to close.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteRecipes;
