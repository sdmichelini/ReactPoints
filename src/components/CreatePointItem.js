import React, { Component } from 'react';

import PointActions from '../actions/PointActions';

import UserOptionsListItem from './UserOptionsListItem';

import EventActions from '../actions/EventActions';
import UserActions from '../actions/UserActions';
import EventStore from '../stores/EventStore';
import UserStore from '../stores/UserStore';

import { ListGroup } from 'react-bootstrap';

function getUserOptions(user) {
  return (
    <UserOptionsListItem
      key={user.id}
      user={user}
    />
  )
}

class CreatePointItemComponent extends Component {

  constructor() {
    super();
    this.state = {
      events: [],
      users: []
    }
    this.onChangeEvents = this.onChangeEvents.bind(this);
    this.onChangeUsers = this.onChangeUsers.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    EventStore.addChangeListener(this.onChangeEvents);
    UserStore.addChangeListener(this.onChangeUsers);
  }

  componentDidMount() {
    EventActions.recieveEvents();
    UserActions.recieveUsers();
  }

  componentWillUnmount() {
    EventStore.removeChangeListener(this.onChangeEvents);
    UserStore.removeChangeListener(this.onChangeUsers);
  }

  onChangeEvents() {
    this.setState({
      events: EventStore.getEvents()
    });
  }

  onChangeUsers() {
    this.setState({
      users: UserStore.getUsersSelection()
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }
  render() {
    let userListItems;
    if(this.state.users) {
      userListItems = this.state.users.map(user => getUserOptions(user));
    } else {
      userListItems = 'No Users in System.';
    }
    return (
      <div>
        <h1>Create Point Item</h1>
        <form onSubmit={this.onSubmit}>
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
