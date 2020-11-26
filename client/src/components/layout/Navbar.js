import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../../actions/auth';

const Navbar = ({isAuth, user, logout, isAdmin}) => {

    if(!isAuth)
        return null
    return (<Fragment>
        <nav className="navbar navbar-light bg-white fixed-top" style={{height:70, boxShadow:'2px 2px 10px black', zIndex:2}}>
            <div type="button" data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </div>
            <Link className="navbar-brand navbar-header" to="/">SukkotMe</Link>
            <span>{user.firstName[0].toUpperCase()}.{user.lastName[0].toUpperCase()}</span>
        </nav>

        <div className="sidebar h-100 p-3 collapse navbar-collapse" id="sidebar">
            <h1 className="row mx-0 justify-content-between" style={{fontSize:30}}>
                <Link style={{textDecoration:'none'}} to="/">
                    <i className="col-7 text-left pb-2 hover">SukkotMe</i>
                </Link>
                <i className="col-3 text-right sidebar-close" data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <b className="hover">x</b>
                </i>
            </h1>
            <div className="w-100 sidebar-content py-3">
                <ul style={{listStyle: 'none', fontSize:22}}>
                    <li><Link className="hover" to="/cart">Cart</Link></li>
                    <li className="hover" onClick={logout}>Logout</li>
                    <li><Link className="hover" to="/orders">Orders</Link></li>
                    <li><Link className="hover" to="/gallery">Gallery</Link></li>
                    <li><Link className="hover" to="/profile">Profile</Link></li>
                    <li><Link className="hover" to="/shop">Shop</Link></li>
                </ul>
                {
                    isAdmin && (<fieldset style={{borderTop:'2px solid'}}>
                        <legend className="w-75 text-center">ADMIN</legend>
                        <ul style={{listStyle: 'none', fontSize:22}}>
                            <li><Link className="hover" to="/admin/users">Users</Link></li>
                            <li><Link className="hover" to="/admin/orders">All Orders</Link></li>
                            <li><Link className="hover" to="/admin/items">Items</Link></li>
                        </ul>
                    </fieldset>)
                }
            </div>
        </div>
    </Fragment>)
}

Navbar.propTypes = {
    isAuth: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    user: state.auth.user,
    isAdmin: state.auth.isAdmin
})

export default connect(mapStateToProps, {logout})(Navbar);

