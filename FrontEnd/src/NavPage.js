import React, { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from './actions/auth'; // Adjust the path as necessary
import logo from './Logo.png'

const NavPage = ({ logout, isAuthenticated }) => {
    const [redirect, setRedirect] = useState(false);
    const [params, setparams]  = useSearchParams()
    const userid = params.get("userid")
    const logout_user = () => {
        logout();
        setRedirect(true);
    };

    const guestLinks = () => (

        <React.Fragment>
            <ul>
                <li>
                    <Link className='nav-link' to='/login'>Login</Link>
                </li>
                <li>
                    <Link className='nav-link' to='/signup'>Sign Up</Link>
                </li>
            </ul>
        </React.Fragment>

    );

    const authLinks = () => (

        <React.Fragment>
            <ul>
                <li >
                    <Link className='nav-link' to='/my-fridge'>My Fridge</Link>
                </li>
                <li >
                    <a className='nav-link' href='#!' onClick={logout_user}>Logout</a>
                </li>
            </ul>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <div className='banner'>
                <Link className='logo' to='/'>
                    <img src = {logo} alt="Logo" style={{height: '50px'}}/>
                </Link>
                <h1 className="title"><Link to={"/?userid=" + userid} className={"title"}>Fridge2Food</Link></h1>
                <nav className="ribbon">
                    {isAuthenticated ? authLinks() : guestLinks()}
                </nav>


            </div>
            {redirect && <Navigate to='/'/>}
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {logout})(NavPage);
