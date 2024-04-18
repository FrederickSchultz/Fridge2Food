import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGOUT,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    AUTHENTICATED_FAIL,

} from "./types"
import axios from "axios";

export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);

            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            console.log("LOGIN_FAIL")
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
        console.log("LOGIN_SUCCESS")
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};


export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });
    console.log(body)

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(load_user());
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
};