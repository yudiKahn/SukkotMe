import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { updateUserProfile } from '../../actions/auth';

const Profile = ({isAuth, updateUserProfile, loading, _user}) => {
    const getUser = (u) => u ? ({...u, street:u.address.street, city: u.address.city, state:u.address.state, zip:u.address.zip}) : u;

    const [user, setUser] = useState(getUser(_user));
    const [disabled, setDisabled] = useState(true);

    const onChange = (key, e) => setUser({...user, [key]: e.target.value});

    useEffect(()=>{
        setUser(getUser(_user));
    }, [loading, _user])

    const updateProfile = e => {
        e.preventDefault();
        updateUserProfile(user)
    }

    if(!isAuth && !loading)
        return <Redirect to="/"/>;
    return loading ? <Spinner/> : (<Fragment>
        <div className="parallax-sm prlx-3">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">PROFILE.</h1>
            </div>
        </div>
        <div className="container cart h-100 py-5">
            <form>
            <fieldset className="profile-form px-3 py-4">
            <legend className="mx-auto"><i className="fa fa-user-circle fa-2x"></i></legend>
            <div className="checkbox-div">
                <input type="checkbox" className="checkbox" onChange={()=>setDisabled(!disabled)}/>
            </div>
            {
                user && Object.keys(user).map((k,i)=> (k!=='_id'&&k!=='__v'&&k!=='password'&&k!=='address') && (
                <div key={i} className="form-group">
                        <label>{k.replace(/(_n|N)/, ' N').toUpperCase()}</label>
                        <input disabled={disabled} className="form-control" value={user[k]} onChange={e=>onChange(k, e)}/>
                </div>))
            }
            <button className="btn btn-success" type="submit" disabled={disabled} onClick={updateProfile}>UPDATE</button>
            </fieldset>
            </form>
        </div>
    </Fragment>)
    
}

Profile.propTypes = {
    isAuth: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    updateUserProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    loading: state.auth.loading,
    _user: state.auth.user
});

export default connect(mapStateToProps, {updateUserProfile})(Profile);

