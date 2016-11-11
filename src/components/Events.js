import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
// import { Link } from 'react-router';
import EventActions from '../actions/EventActions';
import EventStore from '../stores/EventStore';
import EventListItem from './EventListItem';

// We'll use this function to get a contact
// list item for each of the contacts in our list
function getEventListItem(event) {
  if(!event){
    return (<div>No Event</div>);
  }
  return (
    <EventListItem
      key={event.id}
      event={event}
    />
  );
}
class EventsComponent extends Component {

  constructor() {
    super();
    // For our initial state, we just want
    // an empty array of contacts
    this.state = {
      contacts: []
    }
    // We need to bind this to onChange so we can have
    // the proper this reference inside the method
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    EventStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    EventActions.recieveEvents();
  }

  componentWillUnmount() {
    EventStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      events: EventStore.getEvents()
    });
  }

  render() {
    let eventListItems;
    if (this.state.events) {
      // Map over the contacts and get an element for each of them
      eventListItems = this.state.events.map(event => getEventListItem(event));
    }
    return (
      <div>
        <h3>Recent Events</h3>
        <ListGroup>
          {eventListItems}
        </ListGroup>
      </div>
    );
  }
}

export default EventsComponent;
