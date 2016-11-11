import AppDispatcher from '../dispatcher/AppDispatcher';
import EventConstants from '../constants/EventConstants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _events = [];
let _event = {};

let _create_id = '';

function setEvents(events) {
  _events = events;
}

function addEvent(event_) {
  _events.push(event_);
  _create_id = event_.id;
}

function setEvent(event_) {
  _event = event_;
}

class EventStoreClass extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  getEvents() {
    return _events;
  }

  getCreateId() {
    return _create_id;
  }

  getEvent() {
    return _event;
  }

}

const EventStore = new EventStoreClass();

// Here we register a callback for the dispatcher
// and look for our various action types so we can
// respond appropriately
EventStore.dispatchToken = AppDispatcher.register(action => {

  switch(action.actionType) {
    case EventConstants.RECIEVE_EVENTS:
      setEvents(action.events);
      // We need to call emitChange so the event listener
      // knows that a change has been made
      EventStore.emitChange();
      break

    case EventConstants.RECIEVE_EVENT:
      setEvent(action.event_);
      EventStore.emitChange();
      break

    case EventConstants.RECIEVE_EVENT_ERROR:
      alert(action.message);
      EventStore.emitChange();
      break

    case EventConstants.RECIEVE_EVENTS_ERROR:
      alert(action.message);
      EventStore.emitChange();
      break

    case EventConstants.CREATE_EVENT_SUCCESS:
      addEvent(action.event_);
      EventStore.emitChange();
      break

    case EventConstants.CREATE_EVENT_ERROR:
      alert(action.message);
      EventStore.emitChange();
      break

    default:
  }

});

export default EventStore;
