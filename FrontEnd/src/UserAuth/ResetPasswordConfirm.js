import React, { useState } from 'react';
import {Link, Redirect, Navigate, useSearchParams} from 'react-router-dom';
import { connect } from "react-redux";
import axios from "axios";
import { reset_password, reset_password_confirm } from "../actions/auth";

const ResetPasswordConfirm = ({ match, reset_password }) => {
    const [new_password, setNewPassword] = useState('');
    const [re_new_password, setReNewPassword] = useState('');
    const [requestSent, setRequestSet] = useState(false);
    

  const [params, setparams]  = useSearchParams()
  const userid = params.get("userid")

  const handleSubmit = (e) => {
      e.preventDefault();
      const uid = match.params.uid;
      const token = match.params.token;
      reset_password_confirm(uid, token, new_password, re_new_password);
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
              type="password"
              placeholder="Password"
              defaultValue={new_password}
              onChange={e => setNewPassword(e.target.value)}
              minLength='6'
              required
          />
          <input
              type="password"
              placeholder="Confrim New Password"
              defaultValue={re_new_password}
              onChange={e => setReNewPassword(e.target.value)}
              minLength='6'
              required
          />
          <button className="btn btn-primary" type="Login">Reset New Password</button>
        </form>
      </div>
  );
};


export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);