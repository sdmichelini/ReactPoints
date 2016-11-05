import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
// import { Link } from 'react-router';
import EventActions from '../actions/EventActions';
import EventStore from '../stores/EventStore';

class CreateEventComponent extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      pFor: 0,
      pAgainst: 0,
      required: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePointForChange = this.handlePointForChange.bind(this);
    this.handlePointAgainstChange = this.handlePointAgainstChange.bind(this);
    this.handleRequiredChange = this.handleRequiredChange.bind(this);
  }
  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }
  handlePointForChange(event) {
    this.setState({
      pFor: Number(event.target.value)
    });
  }
  handlePointAgainstChange(event) {
    this.setState({
      pAgainst: Number(event.target.value)
    });
  }
  handleRequiredChange(event) {

  }
  render() {
    let name = this.state.name || '';
    let pFor = this.state.pFor || 0;
    let pAgainst = this.state.pAgainst || 0;
    return (
      <div>
        <h1>Create New Event</h1>
        <h3>{name}</h3>
        <form>
          <div className='form-group'>
            <label htmlFor='eventName'>Event Name</label>
            <input type='text' value={name} onChange = {this.handleNameChange} className='form-control' id='eventName' aria-describedby='eventHelp' placeholder='Enter event name'/>
            <small id='eventName' className='form-text text-muted'>Enter a name for the event.</small>
          </div>
          <div className='form-group'>
            <label htmlFor='pointsMade'>Points for Attendence</label>
            <input type='number' value={pFor} onChange = {this.handlePointForChange} className='form-control' id='eventPoints' min='0' aria-describedby='eventPoints'/>
            <small id='eventPoints' className='form-text text-muted'>Enter points for attending the event.</small>
          </div>
          <div className='form-group'>
            <label htmlFor='pointsMissed'>Points Penalty for Missed</label>
            <input type='number' value={pAgainst} onChange = {this.handlePointAgainstChange}className='form-control' id='eventMissed' min='0' aria-describedby='eventMissed'/>
            <small id='eventMissed' className='form-text text-muted'>Enter point penalty for missing event.</small>
          </div>
          <div className='form-group'>
            <label htmlFor='eventDate'>Date of Event</label>
            <input type='date' className='form-control' id='eventDate' aria-describedby='eventDate'/>
            <small id='eventDate' className='form-text text-muted'>Enter date of the event.</small>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input className="form-check-input" type="checkbox"/> Required?
            </label>
          </div>
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      </div>
    );
  }
}

export default CreateEventComponent;
