import React, {useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../Spinner';
import {getProfileById} from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({match, getProfileById, profile: {profile, loading}, auth}) => {
    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById, match.params.id])

    return (<Fragment>
        {loading || !profile ? <Spinner/> : <Fragment>
            <Link to="/profiles" className="btn btn-light">Back to Profiles</Link> 
            {auth.isAuth && !auth.loading && auth.user._id === profile.user._id && 
            (<Link className="btn btn-dark" to="/edit-profile">Edit Profile</Link>)}
            <div className="profile-grid my-1">
                <ProfileTop profile={profile}/>
                <ProfileAbout profile={profile}/>
                <div className="profile-exp bg-white p-2">
                    <h2 className="text-primary">Experiences</h2>
                    {
                        profile.experience.length>0 ? (<Fragment>
                            {profile.experience.map(e=> <ProfileExperience key={e._id} experience={e}/>)}
                        </Fragment>) : (<h4>No experiences found</h4>)
                    }
                </div>
                <div className="profile-edu bg-white p-2">
                    <h2 className="text-primary">Education</h2>
                    {
                        profile.education.length>0 ? (<Fragment>
                            {profile.education.map(e=> <ProfileEducation key={e._id} education={e}/>)}
                        </Fragment>) : (<h4>No education found</h4>)
                    }
                </div>

                {
                    profile.githubusername && (<ProfileGithub username={profile.githubusername}/>)
                }
            </div>
        </Fragment>}
    </Fragment>)
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, {getProfileById})(Profile);
