import React, { useState } from 'react';
import {Link, Redirect, Navigate, useSearchParams} from 'react-router-dom';
import { connect } from "react-redux";
import axios from "axios";
import { login, load_user } from "../actions/auth";
import NavPage from "../NavPage"
import store from "../store";

const Login = ({ login, isAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
      // Perform login logic, validate credentials, etc.
      // For simplicity, let's assume login is successful if username and password are non-empty
      login(email, password)
  };

  if (isAuthenticated) {
    return <Navigate to='/' />
  }

  return (
      <div>
        <NavPage />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="email"
              defaultValue={email}
              onChange={e => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Password"
              defaultValue={password}
              onChange={e => setPassword(e.target.value)}
              minLength='6'
              required
          />
          <button className="btn btn-primary" type="Login">Login</button>
        </form>
        <p className="mt-3"> Don't have an account? <Link to='/signup'>Sign Up!</Link></p>
        <p className="mt-3"> Forgot Password? <Link to='/reset-password'>Reset Password</Link></p>
      </div>
  );
};
const  mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
