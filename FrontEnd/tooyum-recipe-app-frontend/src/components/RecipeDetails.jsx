import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams(); // Get recipe ID from URL params
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=YOUR_API_KEY`
        );
        const data = await response.json();
        if (response.ok) {
          setRecipe(data);
        } else {
          setError("Failed to fetch recipe details.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!recipe) return <p className="error-message">Recipe not found.</p>;

  return (
    <div className="recipe-details-container">
      <h2 className="recipe-title">{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />

      <div className="recipe-section">
        <h3>Ingredients:</h3>
        <ul>
          {recipe.extendedIngredients.map((ingredient) => (
            <li key={ingredient.id}>{ingredient.original}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Instructions:</h3>
        <p dangerouslySetInnerHTML={{ __html: recipe.instructions }}></p>
      </div>

      <div className="recipe-section">
        <h3>Nutrition:</h3>
        <p>Calories: {recipe.nutrition?.nutrients[0]?.amount} kcal</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
