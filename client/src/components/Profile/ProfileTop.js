import React from 'react'
import PropTypes from 'prop-types'

const ProfileTop = props => {
    const {profile: {
        status, company, location, website, social, 
        user: {name, avatar}
    }} = props;
    return (<div className="profile-top bg-primary p-2">
        <img className="round-img my-1" src={avatar} alt="avatar"/>
        <h1 className="large">{name}</h1>
        <p className="lead">{status} {company && <span> at {company}</span>}</p>
        <p>{location && <span>{location.toUpperCase()}</span>}</p>
        <div className="icons my-1">
            {
                website && (<a href={website} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-globe fa-2x"></i>
                </a>)
            }
            {
                social ? Object.keys(social).map((s,i)=>(
                    <a key={i} href={social[s]} target="_blank" rel="noopener noreferrer">
                        <i className={`fab fa-${s} fa-2x`}></i>
                    </a>)) : ''
            }
        </div>
  </div>)
}

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileTop
