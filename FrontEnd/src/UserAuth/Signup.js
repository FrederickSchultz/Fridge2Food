import React, { useState } from 'react';
import {Link, Redirect, Navigate, useSearchParams} from 'react-router-dom';
import { connect } from "react-redux";
import axios from "axios";
import { signup, load_user } from "../actions/auth";
import NavPage from "../NavPage"
import store from "../store";

const Signup = ({ signup, isAuthenticated }) => {
    const [accountCreated, setAccountCreated] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
      // Perform login logic, validate credentials, etc.
      // For simplicity, let's assume login is successful if username and password are non-empty
      if (password === re_password){
        signup(name, email, password, re_password);
        setAccountCreated(true);
      }
  };

  if (isAuthenticated) {
    return <Navigate to='/' />
  }
  if (accountCreated) {
    return <Navigate to='/login' />
  }

  return (
      <div>
        <NavPage />
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="name*"
              defaultValue={name}
              onChange={e => setName(e.target.value)}
              required
          />
          <input
              type="text"
              placeholder="email*"
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
          <input
              type="password"
              placeholder="Confirm Password*"
              defaultValue={re_password}
              onChange={e => setRePassword(e.target.value)}
              minLength='6'
              required
          />
          <button className="btn btn-primary" type="Signup">Sign up</button>
        </form>
        <p className="mt-3"> Already have an account? <Link to='/login'>Log in!</Link></p>
      </div>
  );
};
const  mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { signup })(Signup);