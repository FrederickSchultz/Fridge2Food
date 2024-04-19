import React, { useState } from 'react';
import {Link, Redirect, Navigate, useSearchParams} from 'react-router-dom';
import { connect } from "react-redux";
import axios from "axios";
import { reset_password } from "../actions/auth";
import NavPage from "../NavPage";

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
        <NavPage />
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
