import React, { useState, useEffect } from 'react';
import './IngredientsManager.css'; // This will be our CSS file for styling
import { Link, useParams } from 'react-router-dom';
import { Params } from 'react-router-dom';

//const params = useParams();
//const fridgeId = params.fridgeId;
function IngredientsManager() {
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const result = [{
       "id":0,
       "ingredient":"Apple",
       "amount": 2
}]

    // Fetch existing ingredients from the fridge
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch('http://localhost:3000/fridgeIngredient/');
                const data = await response.json();
                setIngredients(data);
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
            const ingredientResponse = await fetch('http://localhost:3000/ingredients/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredient: newIngredient })
            });

            if (ingredientResponse.ok) {
                const addedIngredient = await ingredientResponse.json();
                // Add to fridge
                const fridgeResponse = await fetch(`http://localhost:3000/fridgeIngredient/${addedIngredient.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: newAmount })
                });

                if (fridgeResponse.ok) {
                    const fridgeIngredient = await fridgeResponse.json();
                    setIngredients([...ingredients, { ...addedIngredient, amount: newAmount, fridgeId: fridgeIngredient.id }]);
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
            const response = await fetch(`http://localhost:3000/fridgeIngredient/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: newAmount })
            });

            if (response.ok) {
                setIngredients(ingredients.map(ing => ing.fridgeId === id ? { ...ing, amount: newAmount } : ing));
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
            const response = await fetch(`http://localhost:3000/fridgeIngredient/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setIngredients(ingredients.filter(ingredient => ingredient.fridgeId !== id));
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
        <div className="ingredients-manager">
            <h1>Your Ingredients</h1>
            <div className="ingredients-list">
                {result.map(({ id, ingredient, amount, fridgeId }) => (
                    <div key={fridgeId} className="ingredient-item">
                        <span>{ingredient} - {amount}</span>
                        <button onClick={() => updateIngredient(fridgeId, Math.max(amount - 1, 0))}>Decrease</button>
                        <button onClick={() => updateIngredient(fridgeId, amount + 1)}>Increase</button>
                        <button onClick={() => deleteIngredient(fridgeId)}>Delete</button>
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


