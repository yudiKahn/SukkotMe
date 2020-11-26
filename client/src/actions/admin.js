import {LOAD_USERS, LOAD_USERS_FAIL, LOAD_ORDERS, LOAD_ORDERS_FAIL} from './types';
import axios from 'axios';
import {loadUser} from './auth';

export const loadUsers = () => async dispatch => {
    try {
        loadUser()(dispatch);
        let res = await axios.get('/api/users');
        dispatch({type: LOAD_USERS, payload: res.data});
    } catch (err) {
        dispatch({type: LOAD_USERS_FAIL});
    }
}

export const loadOrders = () => async dispatch => {
    try {
        loadUsers()(dispatch);
        let res = await axios.get('/api/orders');
        dispatch({type: LOAD_ORDERS, payload: res.data});
    } catch (err) {
        dispatch({type: LOAD_ORDERS_FAIL});
    }
}