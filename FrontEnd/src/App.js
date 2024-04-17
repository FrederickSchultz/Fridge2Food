import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './Loginpage';
import IngredientForm from './IngredientForm';

const App = () => {
  return (
    <Router> {/* Wrap your Routes in a Router */}
      <Routes>
        <Route path="/my-fridge" element={<IngredientForm />} /> 
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
