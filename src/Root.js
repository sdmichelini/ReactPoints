// Root.js

import React, { Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import Index from './components/Index';
import EventDetail from './components/EventDetail';
import NotAuthorized from './components/NotAuthorized';
import PointDetail from './components/PointDetail';

import AuthUtils from './utils/AuthUtils.js';

import App from './components/App';

class Root extends Component {

  // We need to provide a list of routes
  // for our app, and in this case we are
  // doing so from a Root component
  render() {
    return (
      <Router history={this.props.history}>
        <Route path='/' component={App}>
          <IndexRoute component={Index}/>
          <Route path='/notAuthorized' component={NotAuthorized}/>
          <Route path='/events/:id' component={EventDetail} onEnter={AuthUtils.requireAuth}/>
          <Route path='/users/:id/points' component={PointDetail} onEnter={AuthUtils.requireAuth}/>
        </Route>
      </Router>
    );
  }
}

export default Root;
