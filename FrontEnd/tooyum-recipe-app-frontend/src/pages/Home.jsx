import React, { useState, useEffect } from "react";
import { Heart, Search } from "lucide-react";
import "./Home.css";

const images = [
  "https://img.freepik.com/free-photo/mexican-food-composition_23-2147740702.jpg?t=st=1741445423~exp=1741449023~hmac=69ee694c065141bb4068291d869a803943fc13d490e5399e7d543354b6664dbd&w=1380",
  "https://img.freepik.com/free-photo/tasty-pizza-near-ingredients_23-2147772080.jpg?t=st=1741445377~exp=1741448977~hmac=dac1c0e6583de4af1532e5f2449fa75d7c01b147c7bf14cec68e46d57a7ed693&w=1800",
  "https://img.freepik.com/free-photo/barbecue-grilled-beef-steak-meat-with-asparagus-tomato-top-view_2829-16876.jpg?t=st=1741444966~exp=1741448566~hmac=484a090ccecf6606f5aa71e82d3aefd1c80f1496e25020cf8b77cab409cc3cb2&w=1380",
  "https://img.freepik.com/premium-photo/assorted-grilled-meat-fresh-salads-dipping-sauces-dark-rustic-background-perfect-ramadan-iftar-meals-eid-celebrations-festive-dinner-parties-restaurant-menus-food-blog-visuals_1313172-973.jpg?w=1380",
];

const RecipeCard = ({ recipe, onClick }) => {
  const [isLiked, setIsLiked] = useState(
    JSON.parse(localStorage.getItem("likedRecipes"))?.some(
      (r) => r.idMeal === recipe.idMeal
    ) || false
  );

  const handleLike = (e) => {
    e.stopPropagation();
    const likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || [];
    let updatedLikes = isLiked
      ? likedRecipes.filter((r) => r.idMeal !== recipe.idMeal)
      : [...likedRecipes, recipe];

    localStorage.setItem("likedRecipes", JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-image-container">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="recipe-image"
        />
        <button onClick={handleLike} className="like-button">
          <Heart className={`icon ${isLiked ? "liked" : ""}`} />
        </button>
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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood"
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setRecipes(data.meals);
      } catch (err) {
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
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
        style={{ backgroundImage: `url(${images[currentImage]})` }}
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
          <button>Search</button>
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

      {selectedRecipe && (
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
