import React, { useState } from 'react';
import {Link, Navigate, useSearchParams} from 'react-router-dom';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [params, setparams]  = useSearchParams()
  const userid = params.get("userid")

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
