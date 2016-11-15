import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import PointActions from '../actions/PointActions';

import UserOptionsListItem from './UserOptionsListItem';

import EventActions from '../actions/EventActions';
import UserActions from '../actions/UserActions';
import EventStore from '../stores/EventStore';
import UserStore from '../stores/UserStore';
import PointStore from '../stores/PointStore';

import { ListGroup } from 'react-bootstrap';

function getUserOptions(user, customPoint) {
  return (
    <UserOptionsListItem
      key={user.id}
      user={user}
      customPoint={customPoint}
    />
  )
}

class CreatePointItemComponent extends Component {

  constructor() {
    super();
    this.state = {
      events: [],
      users: [],
      currentSelect: '1',
      customPoint: false
    }
    this.onChangeEvents = this.onChangeEvents.bind(this);
    this.onChangeUsers = this.onChangeUsers.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
    EventStore.addChangeListener(this.onChangeEvents);
    UserStore.addChangeListener(this.onChangeUsers);
    PointStore.addUpdateListener(this.onUpdate);
  }

  componentDidMount() {
    EventActions.recieveEvents();
    UserActions.recieveUsers();
  }

  componentWillUnmount() {
    EventStore.removeChangeListener(this.onChangeEvents);
    UserStore.removeChangeListener(this.onChangeUsers);
    PointStore.removeUpdateListener(this.onUpdate);
  }

  onChangeEvents() {
    let events = EventStore.getEvents();
    let currentSelect = (events.length > 0) ? events[0].id : '1';
    this.setState({
      events: events,
      currentSelect: currentSelect
    });
  }

  onChangeUsers() {
    this.setState({
      users: UserStore.getUsersSelection()
    });
  }


  onChangeSelect(e) {
    console.log(e.target.value);
    this.setState({
      currentSelect: e.target.value
    });
  }

  onUpdate() {
    browserHistory.push('/');
  }

  onSubmit(e) {
    e.preventDefault();
    let event_id = this.state.currentSelect;
    let users = this.state.users;
    PointActions.submitPointsForEvent(event_id, users);
  }

  onToggle(e) {
    this.setState({
      customPoint: e.target.checked
    });
  }

  render() {
    let userListItems;
    if(this.state.users) {
      userListItems = this.state.users.map(user => getUserOptions(user, this.state.customPoint));
    } else {
      userListItems = 'No Users in System.';
    }
    let eventSelectItems;
    if(this.state.events) {
      eventSelectItems = this.state.events.map(_event => (<option key={_event.id} value={String(_event.id)}>{_event.name + ' ' + _event.when}</option>));
    }
    return (
      <div>
        <h1>Create Point Item</h1>
        <form onSubmit={this.onSubmit}>
          <h3>Event</h3>
          <div className="form-group">
            <label htmlFor="sel1">Event list:</label>
            <select className="form-control" id="sel1" value={this.state.currentSelect} onChange={this.onChangeSelect}>
              {eventSelectItems}
            </select>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input className="form-check-input" type="checkbox" checked={this.state.customPoint} onChange={this.onToggle}/> Custom?
            </label>
          </div>
          <h3>Users</h3>
          <ListGroup>
            {userListItems}
          </ListGroup>

          <button type='submit' className='btn btn-primary' >Submit</button>
        </form>
      </div>
    );
  }
}

export default CreatePointItemComponent;
