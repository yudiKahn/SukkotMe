import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {Link} from 'react-router-dom';
import { createOrder } from '../../actions/orders';
import OrderInfo from '../layout/OrderInfo';
import Spinner from '../layout/Spinner';

const Cart = ({isAuth, loading, createOrder, user}) => {
    const [state, setState] = useState({
        cartItems: Array.from(JSON.parse(localStorage.getItem('cart'))),
        comment: ''
    });
    const {cartItems, comment} = state;
    const modifyQ = (e, obj) => {
        let isOpMinus = e.target.innerHTML.toString() === '-';
        let q = Number(cartItems[cartItems.indexOf(obj)]['q']);
        q = isOpMinus ? (q > 1 ? q-1 : q) : (q+1);
        
        let c = cartItems;
        c[c.indexOf(obj)]['q'] = q;
        
        localStorage.setItem('cart', JSON.stringify(c));

        setState({...state, cartItems: Array.from(JSON.parse(localStorage.getItem('cart')))});
    }
    const delItem = (obj) => {
        let index = cartItems.indexOf(obj);
        let c = cartItems.filter((v,i,a) => a.indexOf(v) !== index);
        localStorage.setItem('cart', JSON.stringify(c));

        setState({...state, cartItems: Array.from(JSON.parse(localStorage.getItem('cart')))});
    }
    const checkout = () => {
        createOrder(cartItems,comment, user._id);
        setTimeout(() => setState({...state, cartItems: Array.from(JSON.parse(localStorage.getItem('cart')))}), 1000);
    }

    if(!isAuth && !loading)
        return <Redirect to="/"/>;
    
    return loading ? <Spinner/> : (<Fragment>
        <div className="parallax-sm prlx-3">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">CART.</h1>
            </div>
        </div>
        <div className="container cart h-100 py-5">
        {
            cartItems.length > 0 ? (<Fragment>
            <div style={{overflowX: 'auto'}}>
            <table className="table table-striped mb-0">
                <thead>
                    <tr>
                        <th style={{minWidth:50}}><i className="fa fa-trash"></i></th>
                        <th style={{minWidth:110}}>ITEM</th>
                        <th style={{minWidth:110}}>PRICE</th>
                        <th style={{minWidth:100}}>Q</th>
                        <th style={{minWidth:110}}>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cartItems.map((obj,i)=>(<tr key={i}>
                            <td onClick={()=>delItem(obj)}><i className="pointer badge badge-danger">&times;</i></td>
                            <td>{obj.type}</td>
                            <td>${obj.price}.00</td>
                            <td>
                                <i className="badge badge-success mr-2 pointer" onClick={e=>modifyQ(e, obj)}>-</i>
                                {obj.q}
                                <i className="badge badge-success ml-2 pointer" onClick={e=>modifyQ(e, obj)}>+</i>
                            </td>
                            <td>${Number(obj.q)*Number(obj.price)}.00</td>
                        </tr>))
                    }
                </tbody>
            </table>
            </div>
            <div className="row mx-0 justify-content-between mt-5">
                <textarea className="form-control col-6" rows={10} maxLength={100} value={comment}
                    onChange={e=>setState({...state, comment: e.target.value})}></textarea>
            </div>
            <div className="mt-4 row mx-0">
                <div className="col-6">
                    <Link className="text-success" to="/shop">KEEP SHOPPING</Link>
                </div>
                <div className="col-6 text-right">
                    <span className="badge badge-success pointer py-1" onClick={checkout}>CHECKOUT</span>
                </div>
            </div>
            </Fragment>) : (<Fragment>
                <h4>No Items Here.<br/>
                    <Link className="text-success" to="/shop">Go Shopping <i className="fa fa-arrow-circle-right"></i></Link>
                </h4>
            </Fragment>)
        }
        <OrderInfo/>
        </div>
    </Fragment>)
}

Cart.propTypes = {
    isAuth: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    createOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    loading: state.auth.loading,
    user: state.auth.user
});

export default connect(mapStateToProps, {createOrder})(Cart);