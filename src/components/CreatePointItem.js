import React, { Component } from 'react';

import PointActions from '../actions/PointActions';

import EventActions from '../actions/EventActions';
import UserActions from '../actions/UserActions';
import EventStore from '../stores/EventStore';
import UserStore from '../stores/UserStore';

class CreatePointItemComponent extends Component {

  constructor() {
    super();
    this.state = {
      events: []
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    EventStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    EventActions.recieveEvents();
  }

  componentWillUnmount() {
    EventStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      events: EventStore.getEvents()
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }
  render() {
    return (
      <div>
        <h1>Create Point Item</h1>
        <form onSubmit={this.onSubmit}>

        </form>
      </div>
    );
  }
}

export default CreatePointItemComponent;
