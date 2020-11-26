import React, {useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {loadUsers} from '../../actions/admin';

const Users = ({isAdmin, isAuth, loading, loadUsers, users}) => {  
    useEffect(()=>{
        loadUsers()
    }, [loadUsers]);

    if(!isAuth && !loading)
        return <Redirect to="/"/>
    return loading ? <Spinner/> : isAdmin && (<Fragment>
        <div className="parallax-sm prlx-3">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">USERS.</h1>
            </div>
        </div>
        <div className="container" style={{minHeight:'100vh', paddingTop: 90}}>
            {users.map((u,i)=><User key={i} user={u}/>)}
        </div>
    </Fragment>)
}

Users.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isAuth: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    loadUsers: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    isAdmin: state.auth.isAdmin,
    isAuth: state.auth.isAuth,
    loading: state.auth.loading,
    users: state.admin.users
})

export default connect(mapStateToProps, {loadUsers})(Users);

function User({user}) {
    const up = s => `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`;

    return (<div className="border-bottom border-left p-2 border-success">
        <p>{up(user.firstName)} {up(user.lastName)}</p>
        <p>{user.phone_number}</p>
        <p>{user.email}</p>
    </div>)
}