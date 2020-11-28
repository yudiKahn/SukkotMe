import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import axios from 'axios';
import {loadItems} from '../../actions/items';
import {setAlert} from '../../actions/alerts';

const Items = ({isAdmin, isAuth, loading, items, loadItems, setAlert}) => {
    const [stateItems, setItems] = useState(items);

    const onUpdateItems = async() => {
        let res = await axios.post('/api/items', stateItems);
        setAlert([{msg: res.data.msg, type: 'success'}]);
        loadItems();
    }
    const restoreToDefault = async() => {
        let res = await axios.post('/api/items/default');
        setAlert([{msg: res.data.msg, type: 'success'}]);
        loadItems();
    }

    useEffect(() => {
        setItems(items);
    }, [items])

    const onChange = (e, type, mode) => {
        let strState = stateItems.map(obj=>JSON.stringify(obj));
        let obj = stateItems.find(obj => obj.type === type);
        if(!obj) return;
        obj = JSON.stringify(obj);
        let index = strState.indexOf(obj);
        
        let updateObj = stateItems[index];
        switch(mode.toLowerCase()){
            case 'type':
                updateObj.type = e.target.value;
                break;
            case 'price': 
                updateObj.prices = e.target.value.split(',');
                break;
            case 'pricetype':
                updateObj.pricesTypes = e.target.value.split(',');
                break;
            case 'option':
                updateObj.options = e.target.value.split(',');
                break;
            default:
                break;
        }
        strState[index] = updateObj;

        let updateState = strState.map(obj => typeof obj === 'object' ? obj : JSON.parse(obj));
        setItems(updateState);
    }

    const onDeleteItem = type => {
        let updateState = stateItems.filter(obj => obj.type !== type);
        setItems(updateState);
    }

    const onAdd = () => {
        setItems([...stateItems, {type:'',prices:[],pricesTypes:[],options:[]}]);
    }

    if(!isAuth && !loading)
        return <Redirect to="/"/>
    return loading ? <Spinner/> : isAdmin && (<Fragment>
        <div className="parallax-sm prlx-3">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">Items.</h1>
            </div>
        </div>
        <div className="container" style={{minHeight:'100vh', paddingTop: 90}}>
        <table className="table table-striped items-table">
            <thead>
                <tr>
                    <th><i className="fa fa-trash"></i></th>
                    <th>ITEM</th>
                    <th>PRICES</th>
                    <th>OPTIONS</th>
                </tr>
            </thead>
            <tbody>
                { stateItems.map((obj,i) => <Item key={i} item={obj} func={{onChange, onDeleteItem}}/>) }
                <tr>
                    <td onClick={onAdd} className="pointer"><i className="badge badge-success">+</i></td>
                </tr>
            </tbody>
        </table>
        <button className="btn btn-success my-1" onClick={onUpdateItems}>UPDATE</button>
        <br/>
        <button className="btn btn-success my-1" onClick={restoreToDefault}>RETURN TO DEFAULT</button>
        </div>
    </Fragment>)
}

Items.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isAuth: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    loadItems: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAdmin: state.auth.isAdmin,
    isAuth: state.auth.isAuth,
    loading: state.auth.loading,
    items: state.items
})

export default connect(mapStateToProps, {loadItems, setAlert})(Items);

function Item({item: {type, prices, pricesTypes, options}, func}){
    const {onDeleteItem, onChange} = func;

    return (<tr>
        <td>
            <i className="badge badge-danger pointer" onClick={()=>onDeleteItem(type)}>&times;</i>
        </td>
        <td>
            <input type="text" value={type} onChange={e=>onChange(e, type, 'type')} className="form-control"/>
        </td>
        <td>
            <input className="form-control" value={prices.map(v=>v)} onChange={e => onChange(e, type, 'price')}/>
            <input className="form-control" value={pricesTypes.map(v=>v)} onChange={e => onChange(e, type, 'priceType')}/>
        </td>
        <td>  
            <input className="form-control" value={options.map(v=>v)} onChange={e => onChange(e, type, 'option')}/>
        </td>
    </tr>)
}