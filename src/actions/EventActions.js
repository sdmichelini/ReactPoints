import AppDispatcher from '../dispatcher/AppDispatcher';
import EventConstants from '../constants/EventConstants';
import EventsAPI from '../utils/EventsAPI';

const URL = 'https://whispering-river-73731.herokuapp.com';

export default {

  recieveEvents: () => {
    EventsAPI
      .getEvents(URL+'/api/events')
      .then(events => {
        AppDispatcher.dispatch({
          actionType: EventConstants.RECIEVE_EVENTS,
          events: events
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: EventConstants.RECIEVE_EVENTS_ERROR,
          message: message
        });
      });
  },

  recieveEvents: (count) => {
    EventsAPI
      .getEvents((URL+'/api/events',count)
      .then(events => {
        AppDispatcher.dispatch({
          actionType: EventConstants.RECIEVE_EVENTS,
          events: events
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: EventConstants.RECIEVE_EVENTS_ERROR,
          message: message
        });
      });
  },

  getEvent: (id) => {
    EventsAPI
      .getEvent(URL+'/api/events/' + id)
      .then(event_ => {
        AppDispatcher.dispatch({
          actionType: EventConstants.RECIEVE_EVENT,
          event_: event_
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: EventConstants.RECIEVE_EVENT_ERROR,
          message: message
        });
      });
  },
  /*
    This function will call the events API and post a new event.

  */
  createEvent: (_event) => {
    if(!_event.name || !_event.date) {
      AppDispatcher.dispatch({
        actionType: EventConstants.CREATE_EVENT_ERROR,
        message: 'Invalid Parameters for Event Creation.'
      });
    } else {
      EventsAPI
        .createEvent(URL+'/api/events', _event)
        .then(response => {
          AppDispatcher.dispatch({
            actionType: EventConstants.CREATE_EVENT_SUCCESS,
            event_: response._event
          });
        })
        .catch(message => {
          AppDispatcher.dispatch({
            actionType: EventConstants.CREATE_EVENT_ERROR,
            message: message
          });
        });
    }

  }

}
