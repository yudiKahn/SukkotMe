import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentProfile, deleteAccount} from '../actions/profile';
import Spinner from '../components/Spinner';
import {Link} from 'react-router-dom';
import DashboardActions from './Dashboard/Dashboard_Actions';
import Experience from './Dashboard/Experience';
import Education from './Dashboard/Education';

const Dashboard = ({getCurrentProfile, deleteAccount, auth: {user}, profile: {profile, loading}}) => {
    useEffect(()=>{
        getCurrentProfile();
    }, [getCurrentProfile]);
    return (loading && profile == null) ? <Spinner/> : <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome {user && user.name}
        </p>
        {
            profile !== null ? 
            <Fragment>
                <DashboardActions/>
                <Experience experience={profile.experience}/>
                <Education education={profile.education}/>
                <div className="my-2 btn btn-danger">
                    <i className="fas fa-user-minus" onClick={()=>deleteAccount()}></i> Delete Account
                </div>
            </Fragment>
            : 
            <Fragment>
                <p>You have not created a profile yet.</p>
                <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
            </Fragment>
        }
    </Fragment>

}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount})(Dashboard);
