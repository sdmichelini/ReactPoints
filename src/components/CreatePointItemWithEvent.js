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

class CreatePointItemComponentWithEvent extends Component {

  constructor() {
    super();
    this.state = {
      _event: {},
      users: [],
      customPoint: false
    }
    this.onChangeEvents = this.onChangeEvents.bind(this);
    this.onChangeUsers = this.onChangeUsers.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
    EventStore.addChangeListener(this.onChangeEvents);
    UserStore.addChangeListener(this.onChangeUsers);
    PointStore.addUpdateListener(this.onUpdate);
  }

  componentDidMount() {
    EventActions.getEvent(this.props.params.id);
    UserActions.recieveUsers();
  }

  componentWillUnmount() {
    EventStore.removeChangeListener(this.onChangeEvents);
    UserStore.removeChangeListener(this.onChangeUsers);
    PointStore.removeUpdateListener(this.onUpdate);
  }

  onChangeEvents() {
    let _event = EventStore.getEvent(this.props.params.id);
    this.setState({
      _event:_event
    });
  }

  onChangeUsers() {
    let new_users = UserStore.getUsersSelection();
    new_users.sort((a,b)=>{
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      if (a.name.toLowerCase()  < b.name.toLowerCase()) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    this.setState({
      users: new_users
    });
  }

  onChangeSelect(e) {
    this.setState({
      currentSelect: e.target.value
    });
  }

  onUpdate() {
    browserHistory.push('/');
  }

  onSubmit(e) {
    e.preventDefault();
    if(!this.state._event) {
      alert('Event not found.');
      return;
    }
    let event_id = this.props.params.id;
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
    let eventName = 'No Event Found.';
    if(this.state._event && this.state._event.name) {
      eventName = 'Event: '+this.state._event.name;
    }
    return (
      <div>
        <h1>Create Point Item</h1>
        <form onSubmit={this.onSubmit}>
          <h3>{eventName}</h3>
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

export default CreatePointItemComponentWithEvent;
