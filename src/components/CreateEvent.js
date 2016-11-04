import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
// import { Link } from 'react-router';
import EventActions from '../actions/EventActions';
import EventStore from '../stores/EventStore';

class CreateEventComponent extends Component {

  render() {

    return (
      <div>
        <h1>Create New Event</h1>
        <form>
          <div className='form-group'>
            <label for='eventName'>Event Name</label>
            <input type='text' className='form-control' id='eventName' aria-describedby='eventHelp' placeholder='Enter event name'/>
            <small id='eventName' className='form-text text-muted'>Enter a name for the event.</small>
          </div>
          <div className='form-group'>
            <label for='pointsMade'>Points for Attendence</label>
            <input type='number' className='form-control' id='eventPoints' aria-describedby='eventPoints'/>
            <small id='eventPoints' className='form-text text-muted'>Enter points for attending the event.</small>
          </div>
          <div className='form-group'>
            <label for='pointsMissed'>Points Penalty for Missed</label>
            <input type='number' className='form-control' id='eventMissed' aria-describedby='eventMissed'/>
            <small id='eventMissed' className='form-text text-muted'>Enter point penalty for missing event.</small>
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
