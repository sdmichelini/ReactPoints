import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';

class PointListItem extends Component {
  render() {
    const { point } = this.props;
    return (
      <ListGroupItem>
        <h4>
          <Link to={'#'}>
            {point.name}:
          </Link>
          <div className='pull-right'>{point.points}</div>
        </h4>
      </ListGroupItem>
    );
  }
}

export default PointListItem;
