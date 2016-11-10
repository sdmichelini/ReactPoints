import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';

class UserPointListItem extends Component {
  render() {
    const { point } = this.props;
    return (
      <ListGroupItem>
        <h4>
          <Link to={'/events/'+point.event.id}>
            {point.event.name}:
          </Link>
          <div className='pull-right'>{point.points}</div>
        </h4>
      </ListGroupItem>
    );
  }
}

export default UserPointListItem;
