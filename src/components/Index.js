import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';

import  PointStore  from '../stores/PointStore';
import  PointActions  from '../actions/PointActions';

import PointListItem  from './PointListItem';

function getEventListItem(point) {
  console.log(point);
  return (
    <PointListItem
      key={point.id}
      point={point}
    />
  );
}

class IndexComponent extends Component {

  constructor() {
    super();
    this.state = {
      points:[]
    }

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    PointStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    PointActions.recievePoints();
  }

  componentWillUnmount() {
    PointStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      points: PointStore.getPoints()
    });
  }

  render() {
    let eventListItems;
    if (this.state.points) {
      // Map over the contacts and get an element for each of them
      eventListItems = this.state.points.map(event => getEventListItem(event));
    }
    return (
      <div>
        <h2>Points</h2>
        <ListGroup>
          {eventListItems}
        </ListGroup>
      </div>
    );
  }
}

export default IndexComponent;
