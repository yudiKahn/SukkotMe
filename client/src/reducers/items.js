import {LOAD_ITEMS, LOAD_ITEMS_FAIL} from '../actions/types';

let initState=[]; 

function items(state=initState, action){
    const {type, payload} = action;
    switch(type){
        case LOAD_ITEMS:
            return payload;
        case LOAD_ITEMS_FAIL:
        default:
            return state;
    }
}

export default items;