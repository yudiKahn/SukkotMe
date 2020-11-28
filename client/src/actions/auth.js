import axios from 'axios';
import { setAlert } from './alerts';
import {LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGOUT,
    PROFILE_UPDATED, PROFILE_UPDATED_ERROR} from './types';

export const loadUser = () => async dispatch => {
    if(localStorage.token){
        axios.defaults.headers.common['x-auth-token'] = localStorage.token;   
    } else {
        delete  axios.defaults.headers.common['x-auth-token'];
    }
    try {
        const res = await axios.get('/api/users/user');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch {
        dispatch({type: AUTH_ERROR});
    }
}

export const register = (email, password, phone_number, street, city, state, zip, firstName, lastName) => async dispatch => {
    const config = {
        header: {'Content-Type': 'application/json'}
    };
    try {
        const res = await axios.post('/api/users', {email, password, phone_number, street, city, state, zip, firstName, lastName}, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        setAlert(err.response.data.err)(dispatch);
        dispatch({ type: REGISTER_FAIL });
    }
}

export const login = (email, password) => async dispatch => {
    const config = {
        header: {'Content-Type': 'application/json'}
    };
    try {
        const res = await axios.post('/api/users/login', {email, password}, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        setAlert(err.response.data.err)(dispatch);
        dispatch({ type: LOGIN_FAIL });
    }
}

export const logout = () => async dispatch => {
    dispatch({type: LOGOUT})
}

export const updateUserProfile = (user) => async dispatch => {
    try {
        const body = user;
        body.userId = user._id;
        let res = await axios.put('/api/users', body);
        dispatch({type: PROFILE_UPDATED, payload: res.data})
    } catch (err) {
        setAlert(err.response.data.err)(dispatch);
        dispatch({type: PROFILE_UPDATED_ERROR});
    }
}