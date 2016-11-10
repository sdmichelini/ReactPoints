import AppDispatcher from '../dispatcher/AppDispatcher';
import PointConstants from '../constants/PointConstants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _points = [];
let _point_items = {};
let _point_user = {};

function setPoints(points) {
  _points = points;
}

function setPointItems(point_items) {
  _point_items = point_items;
}


class PointStoreClass extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  getPoints() {
    return _points;
  }

  getPointsItem() {
    return _point_items;
  }
}

const PointStore = new PointStoreClass();

// Here we register a callback for the dispatcher
// and look for our various action types so we can
// respond appropriately
PointStore.dispatchToken = AppDispatcher.register(action => {

  switch(action.actionType) {
    case PointConstants.RECIEVE_POINTS:
      setPoints(action.points);
      // We need to call emitChange so the event listener
      // knows that a change has been made
      PointStore.emitChange();
      break

    case PointConstants.RECIEVE_POINTS_ERROR:
      alert(action.message);
      PointStore.emitChange();
      break

    case PointConstants.RECIEVE_POINTS_ITEM:

      setPointItems(action.point_items);
      PointStore.emitChange();
      break;
    case PointConstants.RECIEVE_POINTS_ITEM_ERROR:
      alert(action.message);
      PointStore.emitChange();
      break;

    default:
  }

});

export default PointStore;
