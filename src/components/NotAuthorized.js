import React, { Component } from 'react';

class NotAuthroizedComponent extends Component {

  constructor() {
    super();
  }
  render() {
    return (
      <h2>Not authorized to view the resource.</h2>
    );
  }
}

export default NotAuthroizedComponent;
