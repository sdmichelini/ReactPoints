import React, { Component } from 'react';
// import { Link } from 'react-router';
import EventActions from '../actions/EventActions';

class CreateEventComponent extends Component {
  constructor() {
    super();
    //This populates the form w/ the current date
    let d = new Date();
    let month = d.getMonth() + 1;
    if(month < 10) {
      month = '0' + String(month);
    } else {
      month = String(month);
    }
    let day = d.getDate();
    if(day < 10) {
      day = '0' + String(day);
    } else {
      day = String(day);
    }
    let dateString = String(d.getFullYear()) + '-' + month + '-' + day;
    this.state = {
      name: '',
      pFor: 0,
      pAgainst: 0,
      required: false,
      date: (dateString)
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePointForChange = this.handlePointForChange.bind(this);
    this.handlePointAgainstChange = this.handlePointAgainstChange.bind(this);
    this.handleRequiredChange = this.handleRequiredChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  handleDateChange(event) {
    this.setState({
      date: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    let _event = {
      name: this.state.name,
      required: this.state.required,
      present: this.state.pFor,
      missed: this.state.pAgainst,
      date: this.state.date
    };
    EventActions.createEvent(_event);
  }
  render() {
    let name = this.state.name || '';
    let pFor = this.state.pFor || 0;
    let pAgainst = this.state.pAgainst || 0;
    let date = this.state.date;
    return (
      <div>
        <h1>Create New Event</h1>
        <h3>{name}</h3>
        <form onSubmit={this.handleSubmit}>
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
            <input type='date' value={date} onChange={this.handleDateChange}className='form-control' id='eventDate' aria-describedby='eventDate'/>
            <small id='eventDate' className='form-text text-muted'>Enter date of the event.</small>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input className="form-check-input" type="checkbox"/> Required?
            </label>
          </div>
          <button type='submit' className='btn btn-primary' >Submit</button>
        </form>
      </div>
    );
  }
}

export default CreateEventComponent;
