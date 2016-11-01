import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';

class EventListItem extends Component {
  render() {
    const { event } = this.props;
    return (
      <ListGroupItem>
        <Link to={`/events/${event.id}`}>
          <h4>{event.name}</h4>
        </Link>
      </ListGroupItem>
    );
  }
}

export default EventListItem;
