import {SET_ERROR, CLEAR_ERROR} from '../actions/types';

const initState = []

function alerts(state=initState, action){
    const {type, payload} = action;
    switch(type){
        case SET_ERROR:
            return payload;
        case CLEAR_ERROR:
            return [];
        default:
            return state;
    }
}

export default alerts;