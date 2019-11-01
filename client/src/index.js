import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import registerServiceWorker from './registerServiceWorker';
import LandingPage from "views/LandingPage/LandingPage.js";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "./assets/scss/material-kit-react.scss?v=1.8.0";

var hist = createBrowserHistory();

ReactDOM.render(

    <Router history={hist}>
    <Switch>
      <Route path="/" component={LandingPage} />
    </Switch>
  </Router>
  //<App />
  , document.getElementById('root'));
//ReactDOM.render(<Demo />, document.getElementById('sidebar-nav'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
registerServiceWorker();

//serviceWorker.unregister();
