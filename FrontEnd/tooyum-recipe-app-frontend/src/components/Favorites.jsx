import React from "react";
import "./Favorites.css";

const Favorites = ({ favorites, onRemoveFavorite }) => {
  return (
    <div className="favorites-container">
      <h2>Your Favorite Recipes ❤️</h2>
      {favorites.length === 0 ? (
        <p className="no-favorites">You haven't saved any recipes yet!</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="favorite-card">
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              <button className="remove-btn" onClick={() => onRemoveFavorite(recipe.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
