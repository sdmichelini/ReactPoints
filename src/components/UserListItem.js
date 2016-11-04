import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';
import ListItem from '../styles/List.css';
import  UserActions  from '../actions/UserActions';

function getButton(status, handler) {
  let cls = (status) ? 'btn btn-danger' : 'btn btn-success';
  let string = (status) ? 'Delete' : 'Add';
  return (
    <button className={cls} onClick={handler}>{string}</button>
  )
}

class UserListItem extends Component {
  constructor() {
    super()
  }

  toggle() {
    let is_user = !this.props.is;
    const { user } = this.props;
    UserActions.toggleUserStatus(user.user_id, is_user);
  }

  render() {
    const { user } = this.props;
    let is_user = this.props.is;
    let button = getButton(is_user, this.toggle.bind(this));
    return (
      <div className={ListItem.item+' list-group-item'}>
        {user.nickname}
        <div className='pull-right'>{button}</div>
      </div>
    );
  }
}

export default UserListItem;
