import React, { useState, useEffect } from "react";
import { Heart, Search } from "lucide-react";
import "./Home.css";

const images = [
  "https://www.vecteezy.com/photo/57236009-fresh-ingredients-and-vibrant-colors-create-a-lively-salsa-preparation-scene-in-a-rustic-kitchen",
  "https://static.vecteezy.com/system/resources/previews/048/905/111/non_2x/labor-day-barbecue-feast-with-grilled-meats-and-vegetables-photo.jpg",
  "https://png.pngtree.com/background/20210709/original/pngtree-food-spicy-and-seductive-lobster-shellfish-chinese-meal-background-picture-image_912702.jpg",
  "https://img.freepik.com/free-photo/barbecue-grilled-beef-steak-meat-with-asparagus-tomato-top-view_2829-16876.jpg?t=st=1741444966~exp=1741448566~hmac=484a090ccecf6606f5aa71e82d3aefd1c80f1496e25020cf8b77cab409cc3cb2&w=1380",
  "https://img.freepik.com/premium-photo/assorted-grilled-meat-fresh-salads-dipping-sauces-dark-rustic-background-perfect-ramadan-iftar-meals-eid-celebrations-festive-dinner-parties-restaurant-menus-food-blog-visuals_1313172-973.jpg?w=1380",
];

const RecipeCard = ({ recipe, onClick, isAuthenticated }) => {
  const [isLiked, setIsLiked] = useState(
    JSON.parse(localStorage.getItem("savedRecipes"))?.some(
      (r) => r.idMeal === recipe.idMeal
    ) || false
  );

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    const likedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    let updatedLikes = isLiked
      ? likedRecipes.filter((r) => r.idMeal !== recipe.idMeal)
      : [...likedRecipes, recipe];

    localStorage.setItem("savedRecipes", JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  return (
    <div
      className="recipe-card"
      onClick={() => isAuthenticated && onClick(recipe)}
    >
      <div className="recipe-image-container">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="recipe-image"
        />
        {isAuthenticated && (
          <button onClick={handleLike} className="like-button">
            <Heart className={`icon ${isLiked ? "liked" : ""}`} />
          </button>
        )}
      </div>
      <div className="recipe-details">
        <h3 className="recipe-title">{recipe.strMeal}</h3>
      </div>
    </div>
  );
};

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const fetchRecipes = async (query = "") => {
    try {
      setIsLoading(true);
      let url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";
      if (query) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      }
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (err) {
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="hero-title">Delicious Seafood Recipes</h1>
        <p className="hero-subtitle">
          Discover a variety of seafood dishes to try at home
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => fetchRecipes(searchQuery)}>Search</button>
        </div>
      </div>

      <div className="recipe-section">
        <h2 className="section-title">Featured Recipes</h2>
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  onClick={setSelectedRecipe}
                  isAuthenticated={isAuthenticated}
                />
              ))
            ) : (
              <div className="no-results">
                <Search className="icon" />
                <p>No recipes found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isAuthenticated && selectedRecipe && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="close-button"
            >
              ✖
            </button>
            <h2>{selectedRecipe.strMeal}</h2>
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
