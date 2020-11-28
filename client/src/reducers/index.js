import { combineReducers } from  'redux';
import auth from './auth';
import items from './items';
import orders from './orders';
import alerts from './alerts';
import admin from './admin';

export default combineReducers({
    auth, items, orders, alerts, admin
});