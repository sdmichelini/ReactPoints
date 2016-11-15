import React, { Component } from 'react';
import { Link } from 'react-router';

const text = `
  Welcome to the admin dashboard. Users will have to sign up through Auth0 then you add them with the
  users module below.
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
        <Link style={buttonStyle} className='btn btn-primary' to={'/users'}>Manage Users</Link>
      </div>
    );
  }
}

export default DashboardComponent;
