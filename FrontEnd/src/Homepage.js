import React from 'react';
import {Link} from 'react-router-dom'; // Import Link from react-router-dom
import './App.css';
import RecipeGrid from './RecipeGrid';
import axios from "axios";
import { checkAuthenticated, load_user } from './actions/auth';
import { connect } from 'react-redux';
import NavPage from './NavPage';
import {Carousel, Layout, Flex, Button, Space} from "antd"
import store from "./store";

const {Header, Content} = Layout



class Homepage extends React.Component {

  

  constructor(props) {
    super(props);
    // Code to load data from backend
    console.log(this.props)
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
      carouselImages: response.data.slice(0, 3),
      recipes: listRecipes
    });
  }

  handleHoverImage = (index) => {
    this.setState({ hoveredImageIndex: index });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleCanMakeChange = async () => {
    const showCanMakeOnly =  !this.state.showCanMakeOnly
    const state = store.getState()
    let userId = -1
    if(state.auth.user){
      userId = state.auth.user.id
    }else{
      alert("login to show Recipes you can make")
      return
    }
    if(showCanMakeOnly) {
      const user = (await axios.get(`${process.env.REACT_APP_API_URL}/Users?userid=${userId}`)).data
      const recipes = (await axios.get(`${process.env.REACT_APP_API_URL}/recipes?fridgeId=${user.fridgeId}`)).data
      const listRecipes = recipes.map(recipe => ({
        ...recipe,
        favorited: false
      }));
      console.log(listRecipes)
      this.setState(prevState => ({
        recipes: listRecipes,
      }));


    }else {
      await this.fetchData()
    }
    this.setState(prevState => ({
      showCanMakeOnly: !prevState.showCanMakeOnly
    }));
  }

  handleFavoritedChange = async () => {
    const showFavoritedOnly = !this.state.showFavoritedOnly
    const state = store.getState()
    let userId = -1
    if(state.auth.user){
      userId = state.auth.user.id
    }else {
      alert("login to show favorites")
      return
    }

    if(showFavoritedOnly) {
      const user = (await axios.get(`${process.env.REACT_APP_API_URL}/Users?userid=${userId}`)).data
      let currentRecipes = []
      for (let i = 0; i < user.saved_recipes.length; i++) {
        currentRecipes.push((await axios.get(`${process.env.REACT_APP_API_URL}/Recipe?recipeId=${user.saved_recipes[i]}`)).data)
      }

      const listRecipes = currentRecipes.map(recipe => ({
        ...recipe,
        favorited: true
      }));
      console.log(listRecipes)
      this.setState(prevState => ({
        recipes: listRecipes,
      }));
    } else {
      await this.fetchData()
    }





    this.setState(prevState => ({
      showFavoritedOnly: showFavoritedOnly,
    }));
  }

  handleSearch = async () => {
    const recipes = (await axios.get(`${process.env.REACT_APP_API_URL}/recipes?searchQuery=${this.state.searchQuery}`)).data
    const listRecipes = recipes.map(recipe => ({
      ...recipe,
      favorited: false
    }));
    console.log(listRecipes)
    this.setState(prevState => ({
      recipes: listRecipes,
    }));
  }

  handleToggleFavorite = async (index) => {
    const state = store.getState()
    let userId = -1
    if(state.auth.user){
      userId = state.auth.user.id
    }
    this.setState(prevState => {
      const updatedRecipes = [...prevState.recipes];
      if (userId < 0) {
        alert("Login to Favorite Recipes")
        return { recipes: updatedRecipes };
      }
      if(updatedRecipes[index].favorited === true){
        axios.delete(`${process.env.REACT_APP_API_URL}/Recipe?recipeId=${updatedRecipes[index].recipeID}&userId=${userId}`).then(res => {
          console.log(res)
        })
        updatedRecipes.splice(index, 1)
        return {recipes: updatedRecipes}
      }
      const savedRecipe = {
        "recipeID":updatedRecipes[index].recipeID,
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
      (!showFavoritedOnly || recipe.favorited)
    );

    return (
      <div>
        <NavPage />


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
            <input type="text" placeholder="Search..." value={searchQuery} onChange={this.handleSearchChange}/>
            <Space>
              <label>
                <input type="checkbox" checked={showCanMakeOnly} onChange={this.handleCanMakeChange}/>
                Only show recipes I can make
              </label>
              <label>
                <input type="checkbox" checked={showFavoritedOnly} onChange={this.handleFavoritedChange}/>
                Only show favorited recipes
              </label>
              <label>
                <Button onClick={this.handleSearch}>Search</Button>
              </label>
            </Space>
          </div>
        </div>

        <div className="recipe-container">
          <div className="recipe-scroll-container">
            <RecipeGrid recipes={filteredRecipes} onToggleFavorite={this.handleToggleFavorite}/>
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
