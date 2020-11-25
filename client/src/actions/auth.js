import axios from 'axios';
import {REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_FAIL,
     LOGIN_SUCCESS, LOG_OUT, CLEAR_PROFILE} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utils/setAuthToken';


export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({type: AUTH_ERROR});
    }
}


export const register = ({name, email, password}) => async dispatch => {
    const config = {
        header: {'Content-Type': 'application/json'}
    };
    try {
        const res = await axios.post('/api/users', {name, email, password}, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(e=> dispatch(setAlert(e.msg, 'danger')));
        }
        dispatch({ type: REGISTER_FAIL });
    }
}

export const login = (email, password) => async dispatch => {
    const config = {
        header: {'Content-Type': 'application/json'}
    };
    try {
        const res = await axios.post('/api/auth', {email, password}, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(e=> dispatch(setAlert(e.msg, 'danger')));
        }
        dispatch({ type: LOGIN_FAIL });
    }
}

export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE})
    dispatch({ type: LOG_OUT });
}