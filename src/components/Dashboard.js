import React, { Component } from 'react';
import { Link } from 'react-router';

const text = `
  Welcome to the admin dashboard.
`;

const buttonStyle = {
  display: 'block',
  width: '200px',
  margin: '8px'
}

class DashboardComponent extends Component {
  render() {
    return (
      <div>
        <p>
          {text}
        </p>
        <Link style={buttonStyle} className='btn btn-primary' to={'/create/event'}>Create Event</Link>
        <Link style={buttonStyle} className='btn btn-primary' to={'/create/point'}>Enter Points for Event</Link>
      </div>
    );
  }
}

export default DashboardComponent;
