import {CREATE_ORDER, CREATE_ORDER_ERROR, ORDERS_LOADED, ORDERS_ERROR} from './types';
import axios from 'axios';
import { setAlert } from './alerts';

export const createOrder = (items, comment, userId) => async dispatch => {
    items = items.map(obj=>({name: `${obj.type} ${obj.option?obj.option:''}`, price: Number(obj.price), q: Number(obj.q)}));
    try {
        let res = await axios.post('/api/orders', {items, userId, comment});
        dispatch({type: CREATE_ORDER, payload: res.data})
    } catch (err) {
        setAlert(err.response.data.err)(dispatch);
        dispatch({type: CREATE_ORDER_ERROR})
    }
} 

export const getOrders = (userId) => async dispatch => {
    try {
        let res = await axios.get(`/api/orders/${userId}`)
        dispatch({type: ORDERS_LOADED, payload: res.data})
    } catch (err) {
        setAlert(err.response.data.err)(dispatch);
        dispatch({type: ORDERS_ERROR})
    }
}

export const deleteOrder = (orderId) => async dispatch => {
    try {
        let res = await axios.delete(`/api/orders/${orderId}`);
        dispatch({type: ORDERS_LOADED, payload: res.data})
    } catch (err) {
        setAlert(err.response.data.err)(dispatch);
        dispatch({type: ORDERS_ERROR})
    }
}