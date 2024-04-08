import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './Loginpage';

const App = () => {
  return (
    <Router> {/* Wrap your Routes in a Router */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
