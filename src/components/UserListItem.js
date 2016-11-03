import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';
import ListItem from '../styles/List.css';

function getButton(status) {
  let cls = (status) ? 'btn btn-danger' : 'btn btn-success';
  let string = (status) ? 'Delete' : 'Add';
  return (
    <button className={cls}>{string}</button>
  )
}

class UserListItem extends Component {
  render() {
    const { user } = this.props;
    let is_user = false;
    if(user.app_metadata && user.app_metadata.roles) {
      for(let role of user.app_metadata.roles) {
        if(role == 'user') {
          is_user = true;
          break;
        }
      }
    }
    let button = getButton(is_user);
    return (
      <div className={ListItem.item+' list-group-item'}>
        {user.nickname}
        <div className='pull-right'>{button}</div>
      </div>
    );
  }
}

export default UserListItem;
