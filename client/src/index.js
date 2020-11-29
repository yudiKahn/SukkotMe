import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import img from './imgs/icon.png';
document.querySelector('#head-icon').href = img;

ReactDOM.render( <App />, document.getElementById('root'));
