import React, { Component } from 'react';
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
    this.state = {
      editing: false,
      name: ''
    };
  }

  changeName() {

    const { user } = this.props;
    UserActions.editUserName(user.user_id, this.state.name);
    this.setState({
      editing: false,
      name: ''
    });
  }

  onInputChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing
    });
  }

  toggle() {
    let is_user = !this.props.is;
    const { user } = this.props;
    UserActions.toggleUserStatus(user.user_id, is_user);
  }

  render() {
    const { user } = this.props;
    let name;
    if(user.user_metadata && user.user_metadata.name) {
      name = user.user_metadata.name;
    } else {
      name = user.nickname;
    }
    let is_user = this.props.is;
    let button = getButton(is_user, this.toggle.bind(this));
    let display_edit;
    if(this.state.editing) {
      display_edit = (<span>
        <button className='btn btn-success' onClick={this.changeName.bind(this)}>Change Name</button>
        <input type='text' onChange={this.onInputChange.bind(this)} value={this.state.name} />
        <button className='btn btn-danger' onClick={this.toggleEdit.bind(this)}>Cancel Edit</button>

      </span>);
    } else {
      display_edit = (<button className='btn btn-primary' onClick={this.toggleEdit.bind(this)}>Edit Display Name</button>);
    }
    return (
      <div className={ListItem.item+' list-group-item'}>
        {name}
        <div className='pull-right'>
          {display_edit}
          {button}
        </div>
      </div>
    );
  }
}

export default UserListItem;
