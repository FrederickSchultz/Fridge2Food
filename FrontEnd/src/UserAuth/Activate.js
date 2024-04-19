import React, { useState } from 'react';
import {Link, Redirect, Navigate, useSearchParams} from 'react-router-dom';
import { connect } from "react-redux";
import axios from "axios";
import { verify } from "../actions/auth";
import NavPage from "../NavPage"
import store from "../store";

const Activate = ({ verify, match }) => {
    const [verified, setVerified] = useState(false)

  const handleSubmit = (e) => {
      const uid = match.params.uid;
      const token = match.params.toekn;
      verify(uid, token);
      setVerified(true);
  };

  if (verified) {
    return <Navigate to='/' />
  }

  return (
      <div>
        <NavPage />
        <div className='container'>
            <div 
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ marginTop: '200px' }}
            >
                <h1>Verify your Account:</h1>
                <button
                    onClick={handleSubmit}
                    style={{ marginTop: '50px' }}
                    type='button'
                    className='btn btn-primary'
                >
                    Verify
                </button>
            </div>
        </div>
      </div>
  );
};


export default connect(null, { verify })(Activate);
