import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import rootReducer from './reducers';
import { fetchAllTasks } from './actions/index';
import { fetchAllSequences } from './actions/index';
const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(fetchAllTasks());
store.dispatch(fetchAllSequences());
console.log('INITIAL PAGE LOADING');
//console.log('APPLIICATION STATES sdf', store.getState()); 

// store.dispatch(fetchAllTaskss());
ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
