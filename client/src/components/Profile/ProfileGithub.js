import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getGithubRepos} from '../../actions/profile';
import Spinner from '../Spinner';

const ProfileGithub = props => {
    const {username, getGithubRepos, repos} = props;

    useEffect(()=>{
        getGithubRepos(username);
    }, [getGithubRepos])
    return (<div className="profile-github">
        <h2 className="text-primary my-1">Github Repos</h2>
        {
            repos==null ? <Spinner/> : (
                repos.map((r,i)=>(<div key={i} className="repo bg-white p-1 my-1">
                    <div>
                        <h4><a href={r.html_url} target="_blank" rel="noopener noreferrer">
                            {r.name}
                        </a></h4>
                        <p>{r.description}</p>
                    </div>
                    <div>
                        <ul>
                            <li className="badge badge-primary">Stars: {r.stargazers_count}</li>
                            <li className="badge badge-primary">Watchers: {r.watchers_count}</li>
                            <li className="badge badge-primary">Forks: {r.forks_count}</li>
                        </ul>
                    </div>
                </div>))
            )
        }

    </div>)
}

ProfileGithub.porpTypes = {
    getGithubRepos: PropTypes.func.isRequired,
    repos: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    repos: state.profile.repos
})

export default connect(mapStateToProps, {getGithubRepos})(ProfileGithub);