import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';

import  UserStore  from '../stores/UserStore';
import  UserActions  from '../actions/UserActions';

import UserListItem  from './UserListItem';

function getUserListItem(user) {
  let is_user = false;
  if(user.app_metadata && user.app_metadata.roles) {
    for(let role of user.app_metadata.roles) {
      if(role == 'user') {
        is_user = true;
        break;
      }
    }
  }
  return (
    <UserListItem
      key={user.user_id}
      user={user}
      is={is_user}
    />
  );
}

const helpMessage = `Add and remove users of the application to the points system. They must be a user in order
to add them to the site.`;

class UserComponent extends Component {

  constructor() {
    super();
    this.state = {
      users:[]
    }

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    UserStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    UserActions.recieveUsers();
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      users: UserStore.getUsers()
    });
  }

  onSubmit() {
    if(this.state.users) {
      const users = this.state.users;
      UserActions.updateUsersStatus(users);
    }
  }

  render() {
    let userListItems;
    if (this.state.users) {
      // Map over the contacts and get an element for each of them
      console.log(this.state.users);
      userListItems = this.state.users.map(user => getUserListItem(user));
    }
    return (
      <div>
        <h2>Points System Users</h2>
        <p className='text-muted'>
          {helpMessage}
        </p>
        <ListGroup>
          {userListItems}
        </ListGroup>
        <button className='btn btn-primary' onClick={this.onSubmit.bind(this)}>Submit Users</button>
      </div>
    );
  }
}

export default UserComponent;
