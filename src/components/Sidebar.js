import React, { Component } from 'react';
import { Link } from 'react-router';
import Events from './Events';

class SidebarComponent extends Component {
  render() {
    return (
      <div>
        <Events count={5} />
      </div>

    );
  }
}

export default SidebarComponent;
