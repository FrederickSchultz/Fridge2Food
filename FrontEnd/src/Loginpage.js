import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic, validate credentials, etc.
    // For simplicity, let's assume login is successful if username and password are non-empty
    if (username && password) {
      setIsLoggedIn(true); // Set isLoggedIn to true upon successful login
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/homepage" />; // Redirect to homepage if logged in
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
