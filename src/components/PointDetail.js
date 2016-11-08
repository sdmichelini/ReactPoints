import React, { Component } from 'react';
import PointActions from '../actions/PointActions';
import PointStore from '../stores/PointStore';

import { ListGroup } from 'react-bootstrap';

import UserPointListItem from './UserPointListItem';

function getPointListItem(point) {
  return (
    <UserPointListItem
      key={point.id}
      point={point}
    />
  );
}

class PointDetailComponent extends Component {

  constructor() {
    super();
    this.state = {
      point_items: []
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    PointStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    PointActions.getPointsItemForUser(this.props.params.id);
  }

  componentWillUnmount() {
    PointStore.removeChangeListener(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      point_items: PointActions.getPointsItemForUser(nextProps.params.id)
    });
  }

  onChange() {
    this.setState({
      point_items: PointStore.getPointsItem()
    });
  }

  render() {
    let pointListItems;
    let user;
    if (this.state.point_items.items) {
      // Map over the contacts and get an element for each of them
      pointListItems = this.state.point_items.items.map(point_item => getPointListItem(point_item));
      user = this.state.point_items.user;
    } else {
      user = {name:'Unknown'};
      pointListItems = 'No Points for User.';
    }
    return (
      <div>
        <h3>Points for {user.name}</h3>
        <ListGroup>
          {pointListItems}
        </ListGroup>
      </div>
    );
  }
}

export default PointDetailComponent;
