import {CREATE_ORDER_ERROR, CREATE_ORDER, ORDERS_LOADED, ORDERS_ERROR} from '../actions/types';

const initState = []

function orders(state=initState, action){
    const {type, payload} = action;
    switch(type){
        case CREATE_ORDER:
            localStorage.setItem('cart', JSON.stringify([]));
            return payload;
        case ORDERS_LOADED:
            return payload;
        case CREATE_ORDER_ERROR:
        case ORDERS_ERROR:
            return state;
        default:
            return state;
    }
}

export default orders;