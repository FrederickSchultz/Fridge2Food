import React, {useEffect, useState} from 'react';
import './IngredientsManager.css'; // This will be our CSS file for styling
import {Link, useSearchParams} from 'react-router-dom';
import axios from "axios";
import store from "./store";

//const params = useParams();
//const fridgeId = params.fridgeId;
function IngredientsManager() {
    const [userData, setUserData] = useState({})
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [userid, setUserId] = useState(-1)
    const result = [{
       "id":0,
       "ingredient":"Apple",
       "amount": 2
}]

    // Fetch existing ingredients from the fridge
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const userId = store.getState().auth.user.id
                setUserId(userId)
                const usersR = await axios.get(`${process.env.REACT_APP_API_URL}/Users?userid=` + userId);
                const ingR = await axios.get(`${process.env.REACT_APP_API_URL}/fridgeIngredients/` + usersR.data.fridgeId)
                const ingredientData = ingR.data
                for (let i = 0; i < ingredientData.length; i++) {
                    ingredientData[i].ingredient = (await axios.get(`${process.env.REACT_APP_API_URL}/Ingredient?ingId=` + ingredientData[i].ingredient)).data.name
                }
                console.log(ingredientData)
                setUserData(usersR.data)
                setIngredients(ingredientData)



            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchIngredients();
    }, []);

    // Handle form submission for new ingredients
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create the ingredient
            const ingredientResponse = await axios.post('http://localhost:8000/Ingredient', { name: newIngredient });

            if (ingredientResponse.data.id > 0) {
                const addedIngredient = ingredientResponse.data;
                // Add to fridge
                const fridgeResponse = await fetch(`http://localhost:8000/fridgeIngredients/${userData.fridgeId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ingredient: addedIngredient.id, amount: newAmount })
                });

                if (fridgeResponse.ok) {
                    const fridgeIngredient = await fridgeResponse.json();
                    setIngredients([...ingredients, { ...addedIngredient, amount: newAmount, fridgeId: fridgeIngredient.id, ingredient: addedIngredient.name }]);
                }

                setNewIngredient('');
                setNewAmount('');
            } else {
                console.error('Failed to submit ingredient');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Update ingredient amount in the fridge
    const updateIngredient = async (id, newAmount) => {
        try {
            const response = await axios.put(`http://localhost:8000/fridgeIngredients/${userData.fridgeId}?fIngId=${id}`, { amount: newAmount })

            if (response.data) {
                setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, amount: newAmount } : ing));
            } else {
                console.error('Failed to update ingredient');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Delete ingredient from the fridge
    const deleteIngredient = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/fridgeIngredients/${userData.fridgeId}?fIngId=${id}`);

            if (response.data) {
                setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
            } else {
                console.error('Failed to delete ingredient');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="banner">
                <div className="logo">
                    <img src="logo.png" alt="Logo"></img>
                </div>
                <h1 className="title"><Link to={"/?userid=" + userid} className={"title"}>Fridge2Food</Link></h1>
                <nav className="ribbon">
                    <ul>
                        {/* Replace anchor tag with Link */}

                        {
                            userid < 0 ? <li><Link to="/login">Login</Link></li> : <li><Link to="/">logout</Link></li>
                        }
                    </ul>
                </nav>
            </div>

            <div className="ingredients-manager">
                <h1>Your Ingredients</h1>
                <div className="ingredients-list">
                    {ingredients.map(({id, ingredient, amount, fridgeId}) => (
                        <div key={fridgeId} className="ingredient-item">
                            <span>{ingredient} - {amount}</span>
                            <button onClick={() => updateIngredient(id, Math.max(amount - 1, 0))}>Decrease</button>
                            <button onClick={() => updateIngredient(id, amount + 1)}>Increase</button>
                        <button onClick={() => deleteIngredient(id)}>Delete</button>
                    </div>
                ))}
            </div>
            <h2>Add New Ingredient</h2>
            <form onSubmit={handleSubmit} className="ingredient-form">
                <input
                    type="text"
                    placeholder="Ingredient name"
                    value={newIngredient}
                    onChange={e => setNewIngredient(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Amount"
                    value={newAmount}
                                        onChange={e => setNewAmount(e.target.value)}
                />
                <button type="submit">Add Ingredient</button>
            </form>
        </div>
        </div>
    );
}

export default IngredientsManager;


