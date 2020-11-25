import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../Spinner';
import {getProfiles} from '../../actions/profile';
import ProfileItem from './Profile-item';

const Profiles = ({getProfiles, profile: {profiles, loading}}) => {
    useEffect(()=>{
        getProfiles();
    }, [getProfiles]);
    return (<Fragment>
        {loading ? <Spinner/> : <Fragment>
            <h1 className="large text-primary">Developers</h1>
            <p className="lead">
                <i className="fab fa-connectdevelop"></i> Browse and connect with developers 
            </p>
            <div>
                {profiles.length < 1 ? <h4>No profiles found...</h4> : profiles.map(p => (
                    <ProfileItem key={p._id} profile={p}/>
                ))}
            </div>
        </Fragment>}
    </Fragment>)
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, {getProfiles})(Profiles);