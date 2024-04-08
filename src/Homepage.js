import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './App.css';
import RecipeGrid from './RecipeGrid';
import example1 from './example1.jpg';
import example2 from './example2.jpg';
import example3 from './example3.jpg';
import example4 from './example4.jpg';

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carouselImages: [
        { src: example1, name: 'Dish 1', cookTime: '30 minutes', calories: '200', link: 'https://www.allrecipes.com/recipe/81108/classic-macaroni-salad/' },
        { src: example2, name: 'Dish 2', cookTime: '40 minutes', calories: '250', link: 'https://www.allrecipes.com/recipe/150637/better-baked-beans/' },
        { src: example3, name: 'Dish 3', cookTime: '25 minutes', calories: '180', link: 'https://www.allrecipes.com/recipe/142027/sweet-restaurant-slaw/' },
        { src: example4, name: 'Dish 4', cookTime: '35 minutes', calories: '220', link: 'https://www.allrecipes.com/recipe/92462/slow-cooker-texas-pulled-pork/' },
      ],
      hoveredImageIndex: null,
      recipes: [
        { name: 'Recipe 1', cookTime: '45 minutes', calories: '300', image: 'recipe1.jpg', canMake: false, favorited: false },
        { name: 'Recipe 2', cookTime: '35 minutes', calories: '250', image: 'recipe2.jpg', canMake: true, favorited: true },
        { name: 'Recipe 3', cookTime: '60 minutes', calories: '400', image: 'recipe3.jpg', canMake: true, favorited: false },
        { name: 'Recipe 4', cookTime: '20 minutes', calories: '180', image: 'recipe4.jpg', canMake: false, favorited: true },
      ],
      searchQuery: '',
      showCanMakeOnly: false,
      showFavoritedOnly: false
    };
  }

  handleHoverImage = (index) => {
    this.setState({ hoveredImageIndex: index });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleCanMakeChange = () => {
    this.setState(prevState => ({
      showCanMakeOnly: !prevState.showCanMakeOnly
    }));
  }

  handleFavoritedChange = () => {
    this.setState(prevState => ({
      showFavoritedOnly: !prevState.showFavoritedOnly
    }));
  }

  handleToggleFavorite = (index) => {
    this.setState(prevState => {
      const updatedRecipes = [...prevState.recipes];
      updatedRecipes[index].favorited = !updatedRecipes[index].favorited;
      return { recipes: updatedRecipes };
    });
  }

  render() {
    const { carouselImages, hoveredImageIndex, recipes, searchQuery, showCanMakeOnly, showFavoritedOnly } = this.state;

    // Filter recipes based on search query and checkboxes
    const filteredRecipes = recipes.filter(recipe =>
      (recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!showCanMakeOnly || recipe.canMake) &&
      (!showFavoritedOnly || recipe.favorited)
    );

    return (
      <div>
        <div className="banner">
          <div className="logo">
            <img src="logo.png" alt="Logo" />
          </div>
          <h1 className="title">Fridge2Food</h1>
          <nav className="ribbon">
            <ul>
              {/* Replace anchor tag with Link */}
              <li><Link to="/login">Login</Link></li>
              <li><a href="/my-fridge">My Fridge</a></li>
            </ul>
          </nav>
        </div>

        <div className="suggested-recipes">
          <h2>Suggested Recipes</h2>
          <div className="carousel">
            <div className="carousel-inner">
              {carouselImages.map((imageData, index) => (
                <a key={index} href={imageData.link} className="image-link">
                  <div
                    className="image-container"
                    onMouseEnter={() => this.handleHoverImage(index)}
                    onMouseLeave={() => this.handleHoverImage(null)}
                  >
                    <img
                      src={imageData.src}
                      alt={imageData.name}
                      className={index === hoveredImageIndex ? 'center grow' : ''}
                    />
                    {index === hoveredImageIndex && (
                      <div className="overlay">
                        <div className="text">
                          <p>{imageData.name}</p>
                          <p>Cook Time: {imageData.cookTime}</p>
                          <p>Calories: {imageData.calories}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="search-recipes">
          <h2>Search Recipes</h2>
          <div className="search-container">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={this.handleSearchChange} />
            <label>
              <input type="checkbox" checked={showCanMakeOnly} onChange={this.handleCanMakeChange} />
              Only show recipes I can make
            </label>
            <label>
              <input type="checkbox" checked={showFavoritedOnly} onChange={this.handleFavoritedChange} />
              Only show favorited recipes
            </label>
          </div>
        </div>

        <div className="recipe-container">
          <div className="recipe-scroll-container">
            <RecipeGrid recipes={filteredRecipes} onToggleFavorite={this.handleToggleFavorite} />
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
