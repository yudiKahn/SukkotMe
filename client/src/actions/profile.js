import axios from 'axios';
import {GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, DELETE_ACCOUNT, CLEAR_PROFILE,
    GET_PROFILES, GET_REPOS} from './types';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({ type: GET_PROFILE, payload: res.data});
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.data.msg, status: err.response.status}
        });
    }
}

export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {
        const config = { header: {'Content-Type': 'application/json'}};
        const res = await axios.post('/api/profile', formData, config);
        dispatch({ type: GET_PROFILE, payload: res.data});
        dispatch(setAlert(`Profile ${edit?'Updated':'Created'}`, 'success'));
        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(e=> dispatch(setAlert(e.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = { header: {'Content-Type': 'application/json'}};
        const res = await axios.put('/api/profile/experience', formData, config);
        dispatch({ type: UPDATE_PROFILE, payload: res.data});
        dispatch(setAlert('Experience Added', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(e=> dispatch(setAlert(e.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = { header: {'Content-Type': 'application/json'}};
        const res = await axios.put('/api/profile/education', formData, config);
        dispatch({ type: UPDATE_PROFILE, payload: res.data});
        dispatch(setAlert('Education Added', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(e=> dispatch(setAlert(e.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Removed', 'success'));
    } catch(er) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: er.response.statusText, status: er.response.status}
        })
    }
}

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Removed', 'success'));
    } catch(er) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: er.response.statusText, status: er.response.status}
        })
    }
}

export const deleteAccount = () => async dispatch => {
    if(window.confirm('To Delete')){
        try {
            await axios.delete(`/api/profile`);
            dispatch({type: CLEAR_PROFILE});
            dispatch({type: DELETE_ACCOUNT});
            dispatch(setAlert('Your account has Deleted.'));
        } catch(er) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: er.response.statusText, status: er.response.status}
            })
        }
    }
}

export const getProfiles = () => async dispatch => {
    dispatch({type: CLEAR_PROFILE});
    try {
        const res = await axios.get('/api/profile');
        dispatch({
            type: GET_PROFILES,
            payload:res.data
        })
    } catch (err) {       
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const getProfileById = (userId) => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {       
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const getGithubRepos = (gitHubUsername) => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/github/${gitHubUsername}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch (err) {       
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}