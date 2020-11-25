import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({ component: Component, auth: {isAuth, loading}, ...rest}) => (
    <Route {...rest} render={props=> !isAuth && !loading ? 
        <Redirect to="/login"/> : <Component {...props}/>}/>
);

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute);
