import AppDispatcher from '../dispatcher/AppDispatcher';
import EventConstants from '../constants/EventConstants';
import EventsAPI from '../utils/EventsAPI';

export default {

  recieveEvents: () => {
    EventsAPI
      .getEvents('http://localhost:3001/api/events')
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
      .getEvent('http://localhost:3001/api/events/' + id)
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
  }

}
