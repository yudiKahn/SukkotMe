import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const ProfileItem = (props) => {
    const { profile:{
        user: {_id, name, avatar}, status, company, location, skills
    }} = props;
    return (<div className="profile bg-light">
        <img className="round-img" src={avatar} alt="avatar"/>
        <div>
            <h2>{name}</h2>
            <p>{status} {company && <span>at {company}</span>}</p>
            <p className="my-1">{location && <span>{location}</span>}</p>
            <Link to={`/profile/${_id}`} className="btn btn-primary">View Profile</Link>
        </div>
        <ul>
            {skills.slice(0,4).map((s,i)=>(<li key={i} className="text-primary">
                <i className="fas fa-check"></i> {s}
            </li>))}
        </ul>
    </div>)
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileItem
