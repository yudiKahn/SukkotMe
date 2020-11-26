import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import axios from 'axios';
import {loadItems} from '../../actions/items';

const Items = ({isAdmin, isAuth, loading, items, loadItems}) => {
    const [stateItems, setItems] = useState(items);

    const updateItems = async() => {
        await axios.post('/api/items', stateItems);
        loadItems();
    }
    const restoreToDefault = async() => {
        await axios.post('/api/items/default');
        loadItems()
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
                if(e.target.value.split(',').length > 1){
                    updateObj.price = [];
                    updateObj.price[0] = e.target.value.split(',').map(p=> p.split(':')[1] ? p.split(':')[1] : '');
                    updateObj.price[1] = e.target.value.split(',').map(p=> p.split(':')[0] ? p.split(':')[0] : '');
                } else if(Number(e.target.value)){
                    updateObj.price =  Number(e.target.value);
                } else{
                    return
                }
                break;
            case 'option':
                updateObj.option = e.target.value.split(',');
                break;
            default:
                
        }
        strState[index] = updateObj;

        let updateState = strState.map(obj => typeof obj === 'object' ? obj : JSON.parse(obj));
        setItems(updateState);
    }


    const onDeleteItem = type => {
        let updateState = stateItems.filter(obj => obj.type !== type);
        setItems(updateState);
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
                    <th>PRICE</th>
                    <th>OPTIONS</th>
                </tr>
            </thead>
            <tbody>
                { stateItems.map((obj,i) => <Item key={i} item={obj} func={{onChange, onDeleteItem}}/>) }
                <tr>
                    <td><i className="badge badge-success pointer">+</i></td>
                </tr>
            </tbody>
        </table>
        <button className="btn btn-success my-1" onClick={updateItems}>UPDATE</button>
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
}

const mapStateToProps = state => ({
    isAdmin: state.auth.isAdmin,
    isAuth: state.auth.isAuth,
    loading: state.auth.loading,
    items: state.items
})

export default connect(mapStateToProps, {loadItems})(Items);

function Item({item: {type, price, option}, func}){
    const {onDeleteItem, onChange} = func;

    if(typeof type === 'undefined' || typeof price === 'undefined')
        return (<tr>
            <td><i className="badge badge-danger pointer">&times;</i></td>
            <td>
                aa
            </td>
        </tr>);
    return (<tr>
        <td>
            <i className="badge badge-danger pointer" onClick={()=>onDeleteItem(type)}>&times;</i>
        </td>
        <td>
            <input type="text" value={type} onChange={e=>onChange(e, type, 'type')} className="form-control"/>
        </td>
        <td>
        {
            typeof price === 'number' ?
            <input value={price} className="form-control" onChange={e=>onChange(e, type, 'price')}/> : 
            <input value={price[0].map((p,i)=>`${price[1][i]}:${p}`)}
                className="form-control" onChange={e=>onChange(e, type, 'price')}/>
        }
        </td>
        <td>
            <input className="form-control" value={typeof option === 'object' ? option.map(v=>v) : ''} onChange={e => onChange(e, type, 'option')}/>
        </td>
    </tr>)
}