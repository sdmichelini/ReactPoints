import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';

import UserActions from '../actions/UserActions';

const inputStyle = {
  marginRight: '5px',
  display: 'inline'
}

class UserOptionsListItem extends Component {
  constructor() {
    super();
    this.state = {
      value: 0
    }
    this.onChange = this.onChange.bind(this);
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
        case 4:
          return 'btn btn-success';
        default:
          return 'btn btn-primary';
      }
    }
  }

  onChange(event){
    const { user } = this.props;

    UserActions.updateUserPoints(user.id, Number(event.target.value));
  }
  updateSelection(selection) {
    const { user } = this.props;

    UserActions.updateUserSelection(user.id, selection);
  }
  render() {
    const { user } = this.props;
    let custom_point = (
      <div className='pull-right'>
        <input type='number' value={user.points} onChange={this.onChange} style={inputStyle} />
        <div className='btn-group' role='group' aria-label='...'>
          <button type='button' className={this.getClassName(4, user.selection)} onClick={this.updateSelection.bind(this,4)}>Award Points</button>
          <button type='button' className={this.getClassName(3, user.selection)} onClick={this.updateSelection.bind(this,3)}>N/A</button>
        </div>
      </div>);
    let late = (
      <div className='pull-right'>
        <input type='number' value={user.points} onChange={this.onChange} style={inputStyle} />
        <div className='btn-group' role='group' aria-label='...'>
          <button type='button' className={this.getClassName(0, user.selection)} onClick={this.updateSelection.bind(this,0)}>P</button>
          <button type='button' className={this.getClassName(1, user.selection)} onClick={this.updateSelection.bind(this,1)}>A</button>
          <button type='button' className={this.getClassName(2, user.selection)} onClick={this.updateSelection.bind(this,2)}>E</button>
          <button type='button' className={this.getClassName(5, user.selection)} onClick={this.updateSelection.bind(this,5)}>L</button>
          <button type='button' className={this.getClassName(3, user.selection)} onClick={this.updateSelection.bind(this,3)}>N/A</button>
        </div>
      </div>);
    let normal = (<div className='btn-group pull-right' role='group' aria-label='...'>
      <button type='button' className={this.getClassName(0, user.selection)} onClick={this.updateSelection.bind(this,0)}>P</button>
      <button type='button' className={this.getClassName(1, user.selection)} onClick={this.updateSelection.bind(this,1)}>A</button>
      <button type='button' className={this.getClassName(2, user.selection)} onClick={this.updateSelection.bind(this,2)}>E</button>
      <button type='button' className={this.getClassName(5, user.selection)} onClick={this.updateSelection.bind(this,5)}>L</button>
      <button type='button' className={this.getClassName(3, user.selection)} onClick={this.updateSelection.bind(this,3)}>N/A</button>
    </div>);
    return (
      <ListGroupItem>
        { (this.props.customPoint) ? custom_point : ((user.selection == 5) ? late : normal)}
        <h4>{user.name}</h4>
      </ListGroupItem>
    );
  }
}

export default UserOptionsListItem;
