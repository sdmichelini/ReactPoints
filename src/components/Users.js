import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';

import  UserStore  from '../stores/UserStore';
import  UserActions  from '../actions/UserActions';

import UserListItem  from './UserListItem';

function getUserListItem(user) {
  console.log(user);
  return (
    <UserListItem
      key={user.user_id}
      user={user}
    />
  );
}

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

  render() {
    let userListItems;
    if (this.state.users) {
      // Map over the contacts and get an element for each of them
      console.log(this.state.users);
      userListItems = this.state.users.map(user => getUserListItem(user));
    }
    return (
      <div>
        <h2>Points</h2>
        <ListGroup>
          {userListItems}
        </ListGroup>
      </div>
    );
  }
}

export default UserComponent;
