import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {deleteOrder, getOrders} from '../../actions/orders';
import {Redirect, Link} from 'react-router-dom';
import OrderInfo from '../layout/OrderInfo';
import Spinner from '../layout/Spinner';

const Order = ({obj, toggle, deleteOrder}) => (<tr>
        <td>
            <button disabled={obj.ready || obj.paid} className="badge badge-danger" onClick={()=>deleteOrder(obj._id)}>&times;</button>
        </td>
        <td>${obj.total}.00</td>
        <td>{obj.ready?'ready':'unReady'}, {obj.paid?'paid':'unPaid'}</td>
        <td><i className="badge badge-success pointer" onClick={()=>toggle(obj.items)}>Click Here...</i></td>
    </tr>);

const Orders = ({getOrders, deleteOrder, user, isAuth ,loading, orders}) => {
    const [state, setState] = useState({toggle: false, items: null});
    const {toggle, items} = state;

    useEffect(()=>{
        !loading && getOrders(user ? user._id : '');
        
    }, [getOrders,loading, user]);

    const togglePop = (_items=null) => {
        setState({...state, toggle: !toggle, items: _items})
    }

    if(!isAuth && !loading)
        return <Redirect to="/"/>
    return loading ? <Spinner/> : (<Fragment>     
        <div className="parallax-sm prlx-3">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">ORDERS.</h1>
            </div>
        </div>
        {
            toggle && (<div className="items-popup" style={{overflowY:'auto'}}>
                <p className="text-right p-2">
                    <i className="fa fa-close fa-2x pointer" onClick={()=>togglePop()}></i>
                </p>
                {items && (<table className="table-striped table">
                    <thead><tr>
                        <th>Item</th><th>Q</th><th>Price</th>
                    </tr></thead>
                    <tbody>
                        {items.map((v,i)=><tr key={i}>
                            <td>{v.name}</td><td>{v.q}</td><td>${v.price}.00</td>
                        </tr>)}
                    </tbody>
                </table>)}
            </div>)
        }
        <div className="container" style={{minHeight:'100vh', paddingTop: 90}}>
        {
            orders.length > 0 ? (<table className="table table-striped">
                <thead>
                    <tr>
                    <th><i className="fa fa-trash"></i></th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((obj,i)=><Order key={i} obj={obj} toggle={togglePop} deleteOrder={deleteOrder}/>)}
                </tbody>
            </table>) : (<h4>No Orders Here.<br/>
                <Link className="text-success" to="/shop">Go Shopping <i className="fa fa-shopping-cart"></i></Link>
            </h4>)
        }
        <OrderInfo/>
        </div>  
    </Fragment>)
}

Orders.propTypes = {
    getOrders: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
    isAuth: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    orders: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    user: state.auth.user,
    loading: state.auth.loading,
    orders: state.orders,
})

export default connect(mapStateToProps, {getOrders, deleteOrder})(Orders);

