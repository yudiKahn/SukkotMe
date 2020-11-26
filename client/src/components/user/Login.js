import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {login, register} from '../../actions/auth';
import { connect } from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import Spinner from '../layout/Spinner';
import welcome from '../../imgs/welcome.svg';

const Login = ({login, register, isAuth, loading, errors}) => {
    const [state, setState] = useState({
        email: '', password: '', phone_number: '', street:'', city: '', _state: '', zip: '', isSpinner: false,
        isLogin: true, firstName: '', lastName: ''
    });
    const {email, password, phone_number, street,city, _state, zip, /*isSpinner, */ isLogin, firstName, lastName} = state;
    const onChange = e => setState({...state, [e.target.id]: e.target.value});
    const onSubmit = e => {
        setState({...state, isSpinner: true});
        e.preventDefault();
        isLogin ? login(email, password) : register(email, password, phone_number, street, city, _state, zip, firstName, lastName);
    }

    if(isAuth && !loading){
        return <Redirect to="/home"/>
    }

    return loading ? <Spinner/> : (<div className="register-form">
        <form className="bg-white h-100 mx-auto" onSubmit={e => onSubmit(e)}>
            <div className="p-4 pt-5  h-100 w-100 position-relative" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                {/*isSpinner && loading && <Spinner/> */}
                <div className="form-group my-3 text-center">
                    <h3 style={{fontFamily: 'sans-serif'}} className="mb-5">WELCOME</h3>
                    <img style={{width:100}} src={welcome} alt="avatar"/>
                </div>
                {/*errors.length > 0 && errors.map((e,i)=> <Alert key={i} msg={e.msg}/>) */}
                {
                    !isLogin && (<Fragment>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" className="form-control" 
                                value={firstName} onChange={e => onChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" className="form-control"
                                value={lastName} onChange={e => onChange(e)}/>
                        </div>
                    </Fragment>)
                }
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" className="form-control" value={email} onChange={e => onChange(e)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className="form-control" value={password} onChange={e => onChange(e)}/>
                </div>
                {
                    isLogin ? (<p className="text-right small">
                        <Link style={{color: '#428146'}} to="">Forgot Password ?</Link>
                    </p>) : (<Fragment>
                        <div className="form-group">
                            <label htmlFor="phone_number">Phone Number</label>
                            <input type="" id="phone_number" className="form-control" value={phone_number} onChange={e => onChange(e)}/>
                        </div>
                        <div className="form-group row mx-0 justify-content-between">
                            <label className="col-12 px-0" htmlFor="street">Address</label>
                            {
                                ['street', 'city', '_state', 'zip'].map((v,i)=>
                                    <input key={i} className="form-control col-5 my-1" value={state[v]} id={v}
                                        onChange={e => onChange(e)} placeholder={v.replace('_','')} name={v.replace('_','')}/>)
                            }
                        </div>
                    </Fragment>)
                }
                
                <div className="form-group row mx-0 justify-content-between">
                    <button type="submit" className="btn btn-green col-5">{isLogin?'LOGIN':'REGISTER'}</button>
                    <GoogleLogin className="col-5 justify-content-center"
                        clientId="747905794365-t8t8sg09csig16pq3pv4t4r2401d85ju.apps.googleusercontent.com"
                        buttonText="LOGIN"
                        onSuccess={res=>res}
                        onFailure={res=>res}
                        cookiePolicy={'single_host_origin'}
                    />
                    {/*<button type="button" className="btn btn-light col-5"><i className="fa fa-google"></i> GOOGLE</button> */}
                    <p style={{color: '#428146'}} className="text-right mt-5 col-12 btn" onClick={()=>setState({...state, isLogin: (!isLogin)})}>
                        {isLogin ? 'SIGN UP':'LOGIN'} <i className="fa fa-arrow-circle-o-right"></i>
                    </p>
                </div>
            </div>
        </form>
    </div>)
}

Login.propTypes = {
    isAuth: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    isAuth: state.auth.isAuth,
    //errors: state.alert,
})

export default connect(mapStateToProps, {login, register})(Login);

