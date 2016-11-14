import React, { Component } from 'react';

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
        <a style={buttonStyle} className='btn btn-primary' href='/create/event'>Create Event</a>
        <a style={buttonStyle} className='btn btn-primary' href='/create/point'>Enter Points for Event</a>
      </div>
    );
  }
}

export default DashboardComponent;
