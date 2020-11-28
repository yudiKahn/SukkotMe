import './App.css';
import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

//Redux
import {Provider} from 'react-redux';
import store from './store'
import { loadUser } from './actions/auth';
import { loadItems } from './actions/items';
import Login from './components/user/Login';
import Home from './components/user/Home';
import Navbar from './components/layout/Navbar';
import Shop from './components/user/Shop';
import Cart from './components/user/Cart';
import Footer from './components/layout/Footer';
import Orders from './components/user/Orders';
import Gallery from './components/layout/Gallery';
import Profile from './components/user/Profile';
import Alerts from './components/layout/Alerts';
import Users from './components/admin/Users';
import Items from './components/admin/Items';
import AdminOrders from './components/admin/Orders';

const App = () => {
  useEffect(()=>{
    store.dispatch(loadUser());
    store.dispatch(loadItems());
  }, []);

  return (<Provider store={store}>
    <Router>
      <Navbar/>
      <Route path="/" exact component={Login}/>
      <Alerts/>
      <Switch>
        <Route path="/home" exact component={Home}/>
        <Route path="/shop" exact component={Shop}/>
        <Route path="/cart" exact component={Cart}/>
        <Route path="/orders" exact component={Orders}/>
        <Route path="/gallery" exact component={Gallery}/>
        <Route path="/profile" exact component={Profile}/>
        <Route path="/admin/users" exact component={Users}/>
        <Route path="/admin/items" exact component={Items}/>
        <Route path="/admin/orders" exact component={AdminOrders}/>
      </Switch>
      <Footer/>
    </Router>
  </Provider>);
}

export default App;
