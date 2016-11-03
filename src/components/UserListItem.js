import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';
import ListItem from '../styles/List.css';

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
      is_user: false
    }
  }

  toggle() {
    this.setState({
      is_user: !this.state.is_user
    });
  }

  componentDidMount() {
    console.log(this.props.is);
    this.setState({
      is_user: this.props.is
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      is_user: newProps.is_user
    });
  }
  render() {
    const { user } = this.props;
    let is_user = this.state.is_user;
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
