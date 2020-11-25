import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Alert from './components/Alert';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CreateForm from './components/Profile/CreateForm';
import EditProfile from './components/Profile/EditProfile';
import AddExperience from './components/Profile/AddExperience';
import AddEducation from './components/Profile/AddEducation';
import Profiles from './components/Profiles/Profiles';
import Profile from './components/Profile/Profile';
import Posts from './components/posts/Post';
import Post from './components/Post/Post';
//Redux
import {Provider} from 'react-redux';
import store from './store';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(()=>{
    store.dispatch(loadUser())
  }, []);

  return (<Provider store={store}>
    <Router>
      <Navbar/>
      <Route exact path="/" component={Landing}/>
      <section className="container">         
          <Alert/>
          <Switch>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/profiles" component={Profiles}/>
              <Route exact path="/profile/:id" component={Profile}/>
              <PrivateRoute exact path="/dashboard" component={Dashboard}/>
              <PrivateRoute exact path="/create-profile" component={CreateForm}/>
              <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
              <PrivateRoute exact path="/add-experience" component={AddExperience}/>
              <PrivateRoute exact path="/add-education" component={AddEducation}/>
              <PrivateRoute exact path="/posts" component={Posts}/>
              <PrivateRoute exact path="/posts/:id" component={Post}/>
          </Switch>
      </section>
    </Router>
  </Provider>);
}

export default App;