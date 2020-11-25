import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({profile: {bio, skills, user:{name}}}) => {
    return (<div className="profile-about bg-light p-2">
        {
            bio && (<Fragment>
                <h2 className="text-primary">
                    {name[0].toUpperCase()+name.trim().split(' ')[0].substring(1)}s Bio
                </h2>
                <p>{bio}</p>
                <div className="line"></div>
            </Fragment>)
        }
        <h2 className="text-primary">Skill Set</h2>
        <div className="skills">
        {
            skills.map((s,i)=> (<div className="p-1" key={i}>
                <i className="fas fa-check"></i> {s}
            </div>))
        }
        </div>
    </div>)
}

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileAbout
