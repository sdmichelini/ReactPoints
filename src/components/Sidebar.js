import React, { Component } from 'react';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import Events from './Events';

const text = `
  Welcome to the new points system.
`;

class SidebarComponent extends Component {
  render() {
    return (
      <div>
        <p>
          {text}
        </p>
      </div>
    );
  }
}

export default SidebarComponent;
