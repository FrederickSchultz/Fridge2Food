import React from 'react';

const RecipeGrid = ({ recipes, onToggleFavorite }) => {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-row">
          <table className="recipe-table">
            <tbody>
              <tr>
                <td className="recipe-title" colSpan="2">{recipe.name}</td>
              </tr>
              <tr>
                <td className="recipe-info">
                </td>
                <td className="recipe-image">
                  <img src={recipe.image} alt={recipe.name} />
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="recipe-favorite">
                  <button className={`favorite-button ${recipe.favorited ? 'favorited' : ''}`} onClick={() => onToggleFavorite(index)}>
                    <i className={`fas fa-star${recipe.favorited ? '' : '-empty'}`}></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid;
