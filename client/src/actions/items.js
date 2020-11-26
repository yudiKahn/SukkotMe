import {LOAD_ITEMS, LOAD_ITEMS_FAIL} from './types';
import axios from 'axios';

export const loadItems = () => async dispatch => {
    try {
        let res = await axios.get('/api/items');
        dispatch({type: LOAD_ITEMS, payload: res.data});
    } catch {
        dispatch({type: LOAD_ITEMS_FAIL});
    }
}