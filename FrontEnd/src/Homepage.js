import React from 'react';
import {Link} from 'react-router-dom'; // Import Link from react-router-dom
import './App.css';
import RecipeGrid from './RecipeGrid';
import axios from "axios";


class Homepage extends React.Component {



  constructor(props) {
    super(props);
    // Code to load data from backend

    //Get random images for carousel
        this.state = {
          carouselImages: [],
          hoveredImageIndex: null,
          recipes: [],
          searchQuery: '',
          showCanMakeOnly: false,
          showFavoritedOnly: false
        }

  }
  componentDidMount(){
    this.fetchData();
  }

  fetchData = async() => {
    const response = await axios.get("http://localhost:8000/recipes?random=True")
    const listRecipes = response.data
    for (let i = 0; i < listRecipes.length; i++) {
      listRecipes[i].favorited = false
    }
    this.setState({ carouselImages: response.data,
                          recipes: listRecipes})
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
    const queryParameters = new URLSearchParams(window.location.search)
    const userId = queryParameters.get("userid")
    console.log(userId)
    this.setState(prevState => {
      const updatedRecipes = [...prevState.recipes];
      if (userId < 0) {
        alert("Login to Favorite Recipes")
        return { recipes: updatedRecipes };
      }
      const savedRecipe = {
        "recipeID":updatedRecipes[index].recipe_Id,
        "url":updatedRecipes[index].url,
        "users":userId,
        "name":updatedRecipes[index].name,
        "image":updatedRecipes[index].image,
        "total_time":0
      }
      axios.post("http://localhost:8000/Recipe", savedRecipe).then(res => {
        console.log(res)
      })

      updatedRecipes[index].favorited = !updatedRecipes[index].favorited;
      return { recipes: updatedRecipes };
    });
  }

  render() {
    const { carouselImages, hoveredImageIndex, recipes, searchQuery, showCanMakeOnly, showFavoritedOnly } = this.state;
    const queryParameters = new URLSearchParams(window.location.search)
    const userId = queryParameters.get("userid")
    const link = '/my-fridge?userid=' + userId;
    // Filter recipes based on search query and checkboxes
    const filteredRecipes = recipes.filter(recipe =>
      (recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
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

              {
                (userId == null || userId < 0)?<li><Link to={"/Login?userid=" + userId}>Login</Link></li>:<li><Link to="/">logout</Link></li>
              }
              {
                (userId != null || userId > 0)?<li><Link to={link}>My Fridge</Link></li>:<></>
              }
            </ul>
          </nav>
        </div>

        <div className="suggested-recipes">
          <h2>Suggested Recipes</h2>
          <div className="carousel">
            <div className="carousel-inner">
              {carouselImages.map((imageData, index) => (
                <a key={index} href={imageData.url} className="image-link">
                  <div
                    className="image-container"
                    onMouseEnter={() => this.handleHoverImage(index)}
                    onMouseLeave={() => this.handleHoverImage(null)}
                  >
                    <img
                      src={imageData.image}
                      alt={imageData.name}
                      className={index === hoveredImageIndex ? 'center grow' : ''}
                    />
                    {index === hoveredImageIndex && (
                      <div className="overlay">
                        <div className="text">
                          <p>{imageData.name}</p>
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
