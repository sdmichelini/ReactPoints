import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _users = [];

function setUsers(users) {
  _users = users;
}


class UserStoreClass extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  getUsers() {
    return _users;
  }

}

const UserStore = new UserStoreClass();

// Here we register a callback for the dispatcher
// and look for our various action types so we can
// respond appropriately
UserStore.dispatchToken = AppDispatcher.register(action => {

  switch(action.actionType) {
    case UserConstants.RECIEVE_USERS:
      setUsers(action.users);
      // We need to call emitChange so the event listener
      // knows that a change has been made
      UserStore.emitChange();
      break

    case UserConstants.RECIEVE_USERS_ERROR:
      alert(action.message);
      UserStore.emitChange();
      break

    default:
  }

});

export default UserStore;
