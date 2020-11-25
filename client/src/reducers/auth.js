import {REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, 
    LOGIN_SUCCESS, LOGIN_FAIL, LOG_OUT, DELETE_ACCOUNT} from '../actions/types';

const initState = {
    token: localStorage.getItem('token'),
    isAuth: null,
    loading: true,
    user: null
}

export default function(state = initState, action) {
    const {type, payload} = action;
    switch(type){
        case USER_LOADED:
            return {...state, isAuth: true, loading: false, user: payload};
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return{...state, ...payload, isAuth: true, loading: false};
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOG_OUT:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token');
            return{...state, token: null, isAuth: false, loading: false};
        default:
            return state;
    }
}