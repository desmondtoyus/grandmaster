import React from 'react';
import App from './app/App';
import ReactDOM from 'react-dom';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux'
import {BrowserRouter, Switch} from 'react-router-dom';
import rootReducer from './app/store';
import { composeWithDevTools } from 'redux-devtools-extension';
// import ScrollToTop from './app/ScrollToTop';

const middleware = [reduxThunk];
const store = createStore(rootReducer, {}, composeWithDevTools(applyMiddleware(...middleware)));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <Switch>
      {/* <ScrollToTop> */}
        <App/>
      {/* </ScrollToTop> */}
        </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('anthem')
);
