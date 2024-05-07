import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import { verify } from "../actions/auth";
import NavPage from "../NavPage";

const Activate = ({ verify }) => {
    const [verified, setVerified] = useState(false);
    const { uid, token } = useParams();  // Use useParams hook to access the parameters

    const handleSubmit = (e) => {
        verify(uid, token);
        setVerified(true);
    };

    if (verified) {
        return <Navigate to='/' />;
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
