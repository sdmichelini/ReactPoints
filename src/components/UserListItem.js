import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';

class UserListItem extends Component {
  render() {
    const { user } = this.props;
    return (
      <ListGroupItem>
        {user.nickname}
      </ListGroupItem>
    );
  }
}

export default UserListItem;
