import React from 'react';
import {Link} from 'react-router-dom'; // Import Link from react-router-dom
import './App.css';
import RecipeGrid from './RecipeGrid';
import axios from "axios";
import { checkAuthenticated, load_user } from './actions/auth';
import { connect } from 'react-redux';
import NavPage from './NavPage';



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
    this.props.checkAuthenticated();
    this.props.load_user();
    this.fetchData();
  }

  fetchData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes?random=True`);
    const listRecipes = response.data.map(recipe => ({
      ...recipe,
      favorited: false
    }));
    this.setState({
      carouselImages: response.data,
      recipes: listRecipes
    });
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
      axios.post(`${process.env.REACT_APP_API_URL}/Recipe`, savedRecipe).then(res => {
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
          <NavPage />
          
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
const mapDispatchToProps = dispatch => ({
  checkAuthenticated: () => dispatch(checkAuthenticated()),
  load_user: () => dispatch(load_user())
});

export default connect(null, mapDispatchToProps)(Homepage);
