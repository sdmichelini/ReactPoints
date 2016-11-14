import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';

import  PointStore  from '../stores/PointStore';
import  PointActions  from '../actions/PointActions';

import PointListItem  from './PointListItem';

function getEventListItem(key, point) {
  point.id = key;
  return (
    <PointListItem
      key={key}
      point={point}
    />
  );
}

class IndexComponent extends Component {

  constructor() {
    super();
    this.state = {
      points:{}
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
    if (this.state.points && (Object.keys(this.state.points).length > 0)) {
      // Map over the contacts and get an element for each of them

      console.log(this.state.points);
      eventListItems = [];
      for(let key in this.state.points) {
        eventListItems.push(getEventListItem(key, this.state.points[key]));
      }
      eventListItems = (
        <ListGroup>
          {eventListItems}
        </ListGroup>
      );
    } else {
      eventListItems = 'No points yet.';
    }
    return (
      <div>
        <h2>Points</h2>
        {eventListItems}
      </div>
    );
  }
}

export default IndexComponent;
