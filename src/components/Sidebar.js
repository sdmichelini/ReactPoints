import React, { Component } from 'react';
import { Link } from 'react-router';
import Events from './Events';

class SidebarComponent extends Component {
  render() {
    return (
      <div>
        <Events
          days={5}/>
        <Link to='/'>
          <h2>Users</h2>
        </ Link>
      </div>

    );
  }
}

export default SidebarComponent;
