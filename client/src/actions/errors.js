import {SET_ERROR, CLEAR_ERROR} from './types';

export const setError = (err) => dispatch => {
    if(err){
        dispatch({type: SET_ERROR, payload: err});
        setTimeout(()=>dispatch({type: CLEAR_ERROR}), 4000);
    }
}