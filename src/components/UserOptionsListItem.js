import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';

import UserActions from '../actions/UserActions';

class UserOptionsListItem extends Component {
  constructor() {
    super();
  }
  getClassName(buttonType, selection) {
    if(buttonType != selection) {
      return 'btn btn-default';
    } else {
      switch (buttonType) {
        case 0:
          return 'btn btn-success';
        case 1:
          return 'btn btn-danger';
        default:
          return 'btn btn-primary';
      }
    }
  }
  updateSelection(selection) {
    const { user } = this.props;
    UserActions.updateUserSelection(user.id, selection);
  }
  render() {
    const { user } = this.props;
    return (
      <ListGroupItem>
        <div className='btn-group pull-right' role='group' aria-label='...'>
          <button type='button' className={this.getClassName(0, user.selection)} onClick={this.updateSelection.bind(this,0)}>P</button>
          <button type='button' className={this.getClassName(1, user.selection)} onClick={this.updateSelection.bind(this,1)}>A</button>
          <button type='button' className={this.getClassName(2, user.selection)} onClick={this.updateSelection.bind(this,2)}>E</button>
          <button type='button' className={this.getClassName(3, user.selection)} onClick={this.updateSelection.bind(this,3)}>N/A</button>
        </div>
        <h4>{user.name}</h4>
      </ListGroupItem>
    );
  }
}

export default UserOptionsListItem;
