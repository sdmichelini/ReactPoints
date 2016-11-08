import React, { Component } from 'react';
import EventActions from '../actions/EventActions';
import EventStore from '../stores/EventStore';

class EventDetailComponent extends Component {

  constructor() {
    super();
    this.state = {
      event: {}
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    EventStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    EventActions.getEvent(this.props.params.id);
  }

  componentWillUnmount() {
    EventStore.removeChangeListener(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      event: EventActions.getEvent(nextProps.params.id)
    });
  }

  onChange() {
    this.setState({
      event: EventStore.getEvent(this.props.params.id)
    });
  }

  render() {
    let event;
    if (this.state.event) {
      event = this.state.event;
    }
    return (
      <div>
        { event &&
          <div>
            <h1>Name: {event.name}</h1>
            <h3>Date: {event.when}</h3>
          </div>
        }
      </div>
    );
  }
}

export default EventDetailComponent;
