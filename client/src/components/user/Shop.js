import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import icon from '../../imgs/icon.png'

const Item = ({item: {type, price, option}, selItem, addItem, inCart}) => (<div className="card col col-2 m-1" style={{width:'18rem', minWidth:190}}>
    <img src={icon} className="card-img-top h-50" alt="..."/>
    <div className="card-body px-0">
        <p className="card-text"><b>{type}</b></p>
        <p className="card-text">
            ${typeof price === 'object' ? `${price[0][0]}.00-
            ${price[0][price[0].length-1]}` : price}.00
        </p>
        {
            inCart ? <Link to="/cart" className="badge badge-success p-1">See In Cart</Link> :
            (typeof price === 'object' && price.length > 1) || (typeof option === 'object' && option.length > 1) ?
            <button className="badge badge-success p-1" onClick={()=>selItem(type)}>Select Options</button> :
            <button className="badge badge-success p-1" onClick={()=>addItem(type)}>Add To Cart</button>
        }
    </div>
</div>);

const Shop = ({isAuth, items, loading}) => {
    if(!localStorage.getItem('cart')){
        localStorage.setItem('cart', JSON.stringify([]))
    }

    const [state, setState] = useState({
        showOptions: false, item: null, price:0, option:'', 
        cartItems: Array.from(JSON.parse(localStorage.getItem('cart'))).map(i=>i.type)
    });
    const {showOptions, item, price, option, cartItems} = state;

    const toggleOptions = () => setState({...state, showOptions: !showOptions});
    const selectItem = (type) => {
        let obj = items.find(obj=>obj['type'] === type);
        setState({...state,showOptions: !showOptions, item: obj, price: typeof obj.price === 'object' ? price:obj.price});
    };

    const addItem = (input) => {
        let i;
        if(typeof input === 'string'){
            i = items.find(obj=>obj['type'] === input);
        } else {
            let type = input.item.type;
            if(typeof input.item.option === 'object' && input.option.length<2){
                //the user didnt enter option. (piton or no pitom)
                console.log('bbb')
                return setState({...state, price:0});
            }
            if(typeof input.item.price === 'object' && Number(input.price)===0){
                //the user didnt enter price. (a,b or c)      
                console.log('bbb')
                return setState({...state, price:0});
            }
            i = {type, price:Number(input.price), option: input.option};
        }
        i.q=1;
        let _cart = JSON.parse(localStorage.getItem('cart'));
        _cart.push(i);
        localStorage.setItem('cart', JSON.stringify(_cart));
        
        setState({...state,price:0, cartItems: Array.from(JSON.parse(localStorage.getItem('cart'))).map(i=>i.type), showOptions: false})
    }

    if(!isAuth && !loading)
        return <Redirect to="/"/>
    return loading ? <Spinner/> : (<Fragment>
        {
           showOptions && item && (<div className="item-options">
                <p className="text-right p-2">
                    <i className="fa fa-close fa-2x" onClick={toggleOptions}></i>
                </p>
                <div className="w-100 px-4 py-3">
                    <p><b>{item.type}</b></p>
                    {
                        typeof item.price === 'object' && (<select className="form-control my-1" onChange={e=>setState({...state, price:e.target.value})}>
                        <option value="">SELECT PRICE:</option>
                        {
                            item.price[0].map((p,i)=><option key={i} value={p}>
                                {item.price[1][i]}: {p}
                            </option>)
                        }
                        </select>)
                    }
                    {
                        item.option && (<select className="form-control my-1" onChange={e=>setState({...state, option:e.target.value})}>
                        <option value="">SELECT OPTION:</option>
                        {
                            item.option.map((o,i)=><option key={i} value={o}>{o}</option>)
                        }
                        </select>)
                    }
                    <button className="badge badge-success p-1" onClick={()=>addItem({item, price, option})}>Add To Cart</button>
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
                items.map((v,i)=><Item key={i} item={v} selItem={selectItem} 
                    addItem={addItem} inCart={cartItems.indexOf(v.type) > -1}/>)
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

