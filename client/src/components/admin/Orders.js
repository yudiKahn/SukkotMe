import React, {Fragment, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import {loadOrders} from '../../actions/admin';
import axios from 'axios';

const Orders = ({loading, isAdmin, isAuth, loadOrders, orders, users}) => {
    const [state, setState] = useState({selected:'ALL.'});
    const {selected} = state;
    const setSel = (e) => {
        let v = e.target.innerText;      
        setState({ selected:v});
    };

    let _orders =  orders.filter(o => selected==='ALL.'? o : selected==='PAID.'? o.paid : selected==='DONE.'? o.ready : o.ready && o.paid);

    useEffect(()=>{
        loadOrders();
    }, [loadOrders]);

   const onPaidReadyChange = async (e, ready, paid, orderId) => {
        try {
            const isR = e.target.innerText.toLowerCase().includes('ready');
            await axios.post(`/api/orders/admin/${orderId}/${isR ? !ready : ready}/${isR ? paid : !paid}`);
            loadOrders()
        } catch (err) {
            throw err;
        }
   }

    if(!isAuth && !loading)
        return <Redirect to="/"/>
    return loading ? <Spinner/> : isAdmin && (<Fragment>
         <div className="parallax-sm prlx-3">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">ORDERS.</h1>
            </div>
        </div>
        <div className="container" style={{minHeight:'100vh', paddingTop: 90}}>
            <div className="row admin-orders-links justify-content-center mr-1">
                <div className={`col-2 ${selected==='ALL.'&&'selected'}`} onClick={setSel}>ALL.</div>
                <div className={`col-2 ${selected==='PAID.'&&'selected'}`} onClick={setSel}>PAID.</div>
                <div className={`col-2 ${selected==='DONE.'&&'selected'}`} onClick={setSel}>DONE.</div>
                <div className={`col-2 ${selected==='PAID & DONE.'&&'selected'}`} onClick={setSel}>PAID {'&'} DONE.</div>
            </div>
            <hr/>
            <div className="pt-2">
            {
                _orders.length>0? _orders.map((o,i)=><Order key={i} order={o} users={users} 
                    func={onPaidReadyChange}/>) : <p>NO ORDERS HERE.</p>
            }
            </div>
        </div>
    </Fragment>)
}

Orders.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    isAuth: PropTypes.bool.isRequired,
    loadOrders: PropTypes.func.isRequired,
    orders: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    isAdmin: state.auth.isAdmin,
    loading: state.auth.loading,
    isAuth: state.auth.isAuth,
    orders: state.admin.orders,
    users: state.admin.users
})

export default connect(mapStateToProps, {loadOrders})(Orders);

function Order({order: {ready,paid,items,userId,comment,total,_id}, users, func}){
    let user = users.find(u=>u._id.toString()===userId.toString());

    return(<div className="border-bottom border-left border-success p-2">
        User: {user&&user.firstName} {user&&user.lastName}. <br/>   
        Items: <ol>
            {items.map(i=><li key={i._id}><small>{i.name}(${i.price}) &times; {i.q}</small></li>)}
        </ol>
        Total: ${total.toFixed(2)} <br/>
        Comment: "{comment}" <br/>
        Status: <ul>
            <li className={`text-${ready?'success':'danger'} pointer`} onClick={e=>func(e,ready,paid,_id)}>
                {ready?'ready':'unReady'}
            </li>
            <li className={`text-${paid?'success':'danger'} pointer`} onClick={e=>func(e,ready,paid,_id)}>
                {paid?'paid':'unPaid'}
            </li>
        </ul>
    </div>)
}