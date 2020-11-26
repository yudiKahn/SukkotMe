import { combineReducers } from  'redux';
import auth from './auth';
import items from './items';
import orders from './orders';
import errors from './errors';
import admin from './admin';

export default combineReducers({
    auth, items, orders, errors, admin
});