import React, { Component } from 'react';

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
