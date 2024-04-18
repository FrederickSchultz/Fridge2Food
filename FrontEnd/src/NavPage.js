import React, { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from './actions/auth'; // Adjust the path as necessary

const NavPage = ({ logout, isAuthenticated }) => {
    const [redirect, setRedirect] = useState(false);
    const [params, setparams]  = useSearchParams()
    const userid = params.get("userid")
    const logout_user = () => {
        logout();
        setRedirect(true);
    };

    const guestLinks = () => (
        <nav className="ribbon">
        <React.Fragment>
            <li className='nav-item'>
                <Link className='nav-link' to='/login'>Login</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signup'>Sign Up</Link>
            </li>
        </React.Fragment>
        </nav>
    );

    const authLinks = () => (
        <nav className="ribbon">
        <React.Fragment>
            <li className='nav-item'>
                <Link className='nav-link' to='/my-fridge'>My Fridge</Link>
            </li>
            <li className='nav-item'>
                <a className='nav-link' href='#!' onClick={logout_user}>Logout</a>
            </li>
        </React.Fragment>
        </nav>
    );

    return (
        <React.Fragment>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <Link className='navbar-brand' to='/'>
                    <img src="logo.png" alt="Logo" style={{ height: '50px' }} />
                </Link>
                <div className="navbar-header">
                    <h1 className="title"><Link to={"/?userid=" + userid} className={"title"}>Fridge2Food</Link></h1>
                </div>
                <button 
                    className='navbar-toggler' 
                    type='button' 
                    data-toggle='collapse' 
                    data-target='#navbarNav' 
                    aria-controls='navbarNav' 
                    aria-expanded='false' 
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav ml-auto'>
                        {isAuthenticated ? authLinks() : guestLinks()}
                    </ul>
                </div>
            </nav>
            {redirect && <Navigate to='/' />}
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(NavPage);
