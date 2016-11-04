// Root.js

import React, { Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import Index from './components/Index';
import EventDetail from './components/EventDetail';
import NotAuthorized from './components/NotAuthorized';
import PointDetail from './components/PointDetail';
import CreateEvent from './components/CreateEvent';
import User from './components/Users';

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
          <Route path='/users' component={User} onEnter={AuthUtils.requireAuth}/>
          <Route path='/create/event' component={CreateEvent} onEnter={AuthUtils.requireAdmin}/>
        </Route>
      </Router>
    );
  }
}

export default Root;
