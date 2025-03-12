import React, { useState, useEffect } from "react";
import { Heart, XCircle } from "lucide-react";
import "./Favourite.css";

const FavoriteRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (idMeal) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.idMeal !== idMeal);
    setFavorites(updatedFavorites);
    localStorage.setItem("savedRecipes", JSON.stringify(updatedFavorites));
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


// import React, { useState, useEffect } from "react";
// import { Heart, XCircle } from "lucide-react";
// import "./Favourite.css";

// const FavoriteRecipes = () => {
//   const [favorites, setFavorites] = useState([]);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     // Fetch the current user from localStorage (or use authentication)
//     const user = JSON.parse(localStorage.getItem("currentUser"));
//     if (!user) {
//       console.error("No user found. Please log in.");
//       return;
//     }
//     setCurrentUser(user);

//     // Fetch saved recipes from backend
//     fetch
//       .get(`http://localhost:5000/users/${user.id}/savedRecipes`)
//       .then((response) => {
//         console.log("Fetched Favorites:", response.data);
//         setFavorites(response.data); // Load favorites from backend
//       })
//       .catch((error) => {
//         console.error("Error fetching saved recipes:", error);
//       });
//   }, []);

//   const addFavorite = async (recipe) => {
//     if (!currentUser) return;

//     try {
//       const updatedFavorites = [...favorites, recipe];
//       setFavorites(updatedFavorites);

//       // Save to backend
//       await fetch.post(`http://localhost:5000/api/users/${currentUser.id}/saveRecipe`, {
//         recipe,
//       });

//       console.log("Recipe added:", recipe);
//     } catch (error) {
//       console.error("Error saving recipe:", error);
//     }
//   };

//   const removeFavorite = async (idMeal) => {
//     if (!currentUser) return;

//     try {
//       const updatedFavorites = favorites.filter((recipe) => recipe.idMeal !== idMeal);
//       setFavorites(updatedFavorites);

//       // Remove from backend
//       await fetch.delete(`http://localhost:5000/api/users/${currentUser.id}/removeRecipe`, {
//         data: { idMeal },
//       });

//       console.log("Recipe removed:", idMeal);
//     } catch (error) {
//       console.error("Error removing recipe:", error);
//     }
//   };

//   return (
//     <div className="favorites-container">
//       <h1 className="title">Your Favorite Recipes ❤️</h1>
//       <p className="subtitle">Discover and manage your saved recipes</p>

//       {favorites.length === 0 ? (
//         <p className="no-favorites">No favorite recipes yet! Start liking some.</p>
//       ) : (
//         <div className="favorites-grid">
//           {favorites.map((recipe) => (
//             <div key={recipe.idMeal} className="favorite-card">
//               <img
//                 src={recipe.strMealThumb}
//                 alt={recipe.strMeal}
//                 className="favorite-image"
//                 onClick={() => setSelectedRecipe(recipe)}
//               />
//               <h3 className="recipe-title">{recipe.strMeal}</h3>
//               <button className="unlike-button" onClick={() => removeFavorite(recipe.idMeal)}>
//                 <Heart className="icon liked" /> Unlike
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedRecipe && (
//         <div className="modal">
//           <div className="modal-content">
//             <button onClick={() => setSelectedRecipe(null)} className="close-button">
//               <XCircle className="close-icon" />
//             </button>
//             <h2>{selectedRecipe.strMeal}</h2>
//             <img
//               src={selectedRecipe.strMealThumb}
//               alt={selectedRecipe.strMeal}
//               className="modal-image"
//             />
//             <p className="modal-description">Enjoy this delicious recipe! Click on ❌ to close.</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FavoriteRecipes;
