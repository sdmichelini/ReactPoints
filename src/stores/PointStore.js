import AppDispatcher from '../dispatcher/AppDispatcher';
import PointConstants from '../constants/PointConstants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';
const UPDATE_EVENT = 'update';

let _points = {};
let _sorted_points = [];
let _point_items = {};

function setPoints(points) {
  _points = points;
}

function setPointItems(point_items) {
  _point_items = point_items;
}

function setSortedPoints(sorted_points) {
  _sorted_points = sorted_points;
}


class PointStoreClass extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  emitUpdate() {
    this.emit(UPDATE_EVENT)
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  addUpdateListener(callback) {
    this.on(UPDATE_EVENT, callback);
  }

  removeUpdateListener(callback) {
    this.removeListener(UPDATE_EVENT, callback);
  }

  getPoints() {
    return _points;
  }

  getSortedPoints() {
    return _sorted_points;
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
      let points = action.points;
      let sortPoints = [];
      for (let key in points) {
        points[key].id = key;
        sortPoints.push(points[key]);
      }
      sortPoints.sort((a ,b ) => {
        if(a.points > b.points) {
          return -1;
        } else if (b.points > a.points) {
          return 1;
        } else {
          return 0;
        }
      });
      setSortedPoints(sortPoints);
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

    case PointConstants.SUBMIT_POINTS:
      PointStore.emitUpdate();
      break;
    case PointConstants.SUBMIT_POINTS_ERROR:
      alert(action.message);
      break;

    case PointConstants.DELETE_POINT_ITEM:
      let items = _point_items.items;
      let new_items = [];
      for(let item in items.items) {
        if(item.id == action.id) {
          continue;
        } else {
          new_items.push(item);
        }
      }
      _point_items.items = new_items;
      PointStore.emitChange();
      break;
  case PointConstants.DELETE_POINT_ITEM_ERROR:
    alert(action.message);
    break;

  case PointConstants.UPDATE_POINT_ITEM:
    let items2 = _point_items.items;
    let new_items2 = [];
    for(let item in items2.items) {
      if(item.id == action.id) {
        item.points = action.points;
      }
      new_items2.push(item);
    }
    _point_items.items = new_items2;
    PointStore.emitChange();
    break;
  case PointConstants.UPDATE_POINT_ITEM_ERROR:
    alert(action.message);
    break;

    default:
  }

});

export default PointStore;
