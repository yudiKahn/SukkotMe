import { USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, 
    REGISTER_SUCCESS, REGISTER_FAIL, PROFILE_UPDATED, PROFILE_UPDATED_ERROR } from '../actions/types';

const initState = {
    isAuth: false,
    loading: true,
    user: null,
    isAdmin: false
}

function auth(state = initState, action){
    const {type, payload} = action;
    switch(type){
        case USER_LOADED:
            return {isAuth: true, loading: false, user: payload.user, isAdmin: payload.isAdmin}
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {isAuth: true, loading: false, user: payload.user, isAdmin: payload.isAdmin};
        case AUTH_ERROR:
        case LOGOUT:
            localStorage.removeItem('token');
            return {...state, isAuth: false, loading: false, user: null};
        case PROFILE_UPDATED:
            return {...state, user: payload.user};
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case PROFILE_UPDATED_ERROR:
        default:
            return state;
    }
}

export default auth;