import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchRecipes.css";

const SearchRecipes = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!query) {
      setError("Please enter a search term.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=YOUR_API_KEY`
      );
      const data = await response.json();

      if (response.ok) {
        setRecipes(data.results);
      } else {
        setError("Failed to fetch recipes. Try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching recipes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Find Your Favorite Recipes</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          >
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <h3 className="recipe-title">{recipe.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRecipes;
