import {LOAD_USERS, LOAD_USERS_FAIL, LOAD_ORDERS, LOAD_ORDERS_FAIL} from '../actions/types';

const initState = {
    orders: [],
    users : []
}

function admin(state=initState, action){
    const {type, payload} = action;
    switch(type){
        case LOAD_USERS:
            return {...state, users: payload};
        case LOAD_ORDERS:
            return {...state, orders: payload}
        case LOAD_ORDERS_FAIL:
        case LOAD_USERS_FAIL:
        default:
            return state;
    }
}

export default admin;