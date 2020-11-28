import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import icon from '../../imgs/icon.png';

const Shop = ({isAuth, items, loading}) => {
    if(!localStorage.getItem('cart')){
        localStorage.setItem('cart', JSON.stringify([]))
    }

    const [state, setState] = useState({
        showOptions: false, selectedPrice:0, selectedOption:'', selectedItemObj:null,
        cartItems: Array.from(JSON.parse(localStorage.getItem('cart'))).map(i=>i.type)
    });
    const {showOptions, cartItems, selectedOption, selectedPrice, selectedItemObj} = state;

    const toggleOptions = () => setState({...state, showOptions: !showOptions});

    const selectItem =(type)=> setState({...state,showOptions:!showOptions, selectedItemObj: items.find(obj=>obj['type']===type)});
    const refreshItem = () => setState({...state, selectedItemObj:null, selectedOption:'', selectedPrice:0});

    const addItem = (input) => {
        let i;
        if(typeof input === 'string'){
            let tmpi = items.find(obj=>obj['type'] === input);
            i = {type: tmpi.type, price: tmpi.prices[0]}
        } else {
            if(selectedItemObj.options.length>0 && selectedOption.toString().length===0){
                //the user didnt enter option. (piton or no pitom)
                console.log('bbb')
                return refreshItem();
            }
            if(Number(selectedPrice)===0){
                //the user didnt enter price. (a,b or c)      
                console.log('bbb')
                return refreshItem();
            }
            i = {type: selectedItemObj.type, price: selectedPrice, option: selectedOption};
        }
        i.q=1;
        let _cart = JSON.parse(localStorage.getItem('cart'));
        _cart.push(i);
        localStorage.setItem('cart', JSON.stringify(_cart));
        
        refreshItem()
        setState({...state, cartItems: Array.from(JSON.parse(localStorage.getItem('cart'))).map(i=>i.type), showOptions: false});
    }

    if(!isAuth && !loading)
        return <Redirect to="/"/>
    return loading ? <Spinner/> : (<Fragment>
        {/* ITEM POPUP MENU/OPTIONS */
           showOptions && selectedItemObj && (<div className="item-options">
                <p className="text-right p-2">
                    <i className="fa fa-close fa-2x" onClick={toggleOptions}></i>
                </p>
                <div className="w-100 px-4 py-3">
                    <p><b>{selectedItemObj.type}</b></p>
                    <select className="form-control my-1" onChange={e=>setState({...state, selectedPrice:e.target.value})}>
                        <option value="">SELECT PRICE:</option>
                        {
                            selectedItemObj.prices.map((p,i)=><option key={i} value={p}>
                                {selectedItemObj.pricesTypes[i]&&`${selectedItemObj.pricesTypes[i]} :`}
                                ${Number(p).toFixed(2)}
                            </option>)
                        }
                    </select>
                    { 
                        selectedItemObj.options.length>0 &&
                        (<select className="form-control my-1" onChange={e=>setState({...state, selectedOption:e.target.value})}>
                            <option value="">SELECT OPTION:</option>
                            {
                                selectedItemObj.options.map((o,i)=><option key={i} value={o}>{o}</option>)
                            }
                        </select>)
                    }
                    <button className="badge badge-success p-1" onClick={()=>addItem(state)}>Add To Cart</button>
                </div>
            </div>)
        }
        <div className="parallax-sm prlx-3">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">SHOPPING.</h1>
            </div>
        </div>
        <div className="container shop h-100 py-5">
            <div className="row mx-0 justify-content-center">
            {
                items.map((v,i)=><Item key={i} item={v} inCart={cartItems.indexOf(v.type) > -1} func={{selectItem, addItem}}/>)
            }
            </div>
        </div>
    </Fragment>)
}

Shop.propTypes = {
    isAuth: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    loading: state.auth.loading,
    items: state.items
});

export default connect(mapStateToProps)(Shop);


function Item({item, func, inCart}){
    const  {type, prices, options} = item;
    const {selectItem, addItem} = func;

    return (<div className="card col col-2 m-1" style={{width:'18rem', minWidth:190}}>
        <img src={icon} className="card-img-top h-50" alt="..."/>
        <div className="card-body px-0">
            <p className="card-text"><b>{type}</b></p>
            <p className="card-text">
                ${prices.length > 1 ? `${Number(prices[0]).toFixed(2)}-
                ${Number(prices[prices.length-1]).toFixed(2)}` : Number(prices[0]).toFixed(2)}
            </p>
            {
                inCart ? <Link to="/cart" className="badge badge-success p-1">See In Cart</Link> :
                (prices.length > 1) || (options.length > 1) ?
                <button className="badge badge-success p-1" onClick={()=>selectItem(type)}>Select Options</button> :
                <button className="badge badge-success p-1" onClick={()=>addItem(type)}>Add To Cart</button>
            }
        </div>
    </div>);
}