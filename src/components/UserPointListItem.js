import React, { Component } from 'react';
import { Link } from 'react-router';
import AuthStore from '../stores/AuthStore';
import PointActions from '../actions/PointActions';

const btnStyle = {
  marginLeft: '4px',
  marginRight: '4px'
}

class UserPointListItem extends Component {
  constructor() {
    super();
    this.state = {
      admin: AuthStore.isAdmin(),
      editing: false,
      deleteAttempted: false,
      points: 0
    };
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onConfirmEdit = this.onConfirmEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    const { point } = this.props;
    this.setState({
      points: point.points
    });
  }

  componentWillMount() {
    AuthStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      admin: AuthStore.isAdmin()
    });
  }

  onEdit() {
    this.setState({
      editing: !this.state.editing
    });
  }

  onValueChange(event) {
    this.setState({
      points: Number(event.target.value)
    })
  }

  onConfirmEdit() {
    const { point } = this.props;
    PointActions.updatePoint(point.id, this.state.points);
  }

  onDelete() {
    this.setState({
      deleteAttempted: !this.state.deleteAttempted
    });
  }

  onConfirmDelete() {
    const { point } = this.props;
    PointActions.deletePoint(point.id);
  }

  render() {
    const { point } = this.props;
    let editPanel;
    if(this.state.admin) {
      let deleteText = (this.state.deleteAttempted) ? 'Don\'t Delete' : 'Delete';
      let editText = (this.state.editing) ? 'Undo Edit' : 'Edit';
      editPanel = (
        <span>
          <button style={btnStyle} className='btn btn-warning' onClick={this.onEdit}>{editText}</button>
          {this.state.editing ? (<span>
            <input type='number' value={this.state.points} onChange={this.onValueChange}/>
            <button style={btnStyle} className='btn btn-warning' onClick={this.onConfirmEdit}>Confirm Edit</button>
          </span>) : ''}
          <button style={btnStyle} className='btn btn-danger' onClick={this.onDelete}>{deleteText}</button>
          {this.state.deleteAttempted ? (<button className='btn btn-danger' hidden={!this.deleteAttempted} onClick={this.onConfirmDelete}>Confirm</button>) : ''}
        </span>
      );
    } else {
      editPanel = (<span></span>);
    }
    return (
      <div className='list-group-item'>
        <h4>
          <Link to={'/events/'+point.event.id}>
            {point.event.name}:
          </Link>
          <div className='pull-right'>
            {point.points}
            {editPanel}
          </div>
        </h4>
      </div>
    );
  }
}

export default UserPointListItem;
