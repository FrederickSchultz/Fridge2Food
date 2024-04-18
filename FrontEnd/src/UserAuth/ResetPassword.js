import React, { useState } from 'react';
import {Link, Redirect, Navigate, useSearchParams} from 'react-router-dom';
import { connect } from "react-redux";
import axios from "axios";
import { reset_password } from "../actions/auth";

const ResetPassword = ({ reset_password }) => {
    const [email, setEmail] = useState('')
    const [requestSent, setRequestSet] = useState(false);
    

  const [params, setparams]  = useSearchParams()
  const userid = params.get("userid")

  const handleSubmit = (e) => {
      e.preventDefault();
      // Perform login logic, validate credentials, etc.
      // For simplicity, let's assume login is successful if username and password are non-empty
      reset_password(email);
      setRequestSet(true);
  };

  if (requestSent) {
    return <Navigate to='/' />
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
        <h2>Request Password Rese</h2>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="email"
              defaultValue={email}
              onChange={e => setEmail(e.target.value)}
              required
          />
          <button className="btn btn-primary" type="Login">Reset Password</button>
        </form>
      </div>
  );
};


export default connect(null, { reset_password })(ResetPassword);
