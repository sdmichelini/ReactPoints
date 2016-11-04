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

function removeTag(list, element) {
  let ret = list;
  for(let i = 0; i < list.length; i++) {
    if(list[i]===element) {
      ret.splice(i, 1);
      break;
    }
  }
  return ret;
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

    case UserConstants.SET_USER_STATUS:
      let user_id = action.user_id;
      let status = action.status;

      let users = _users;
      for(let i = 0; i < users.length; i++) {
        if(user_id === users[i].user_id) {
          if(!users[i].app_metadata) {
            users[i].app_metadata = {};
          }
          if(!users[i].app_metadata.roles) {
            users[i].app_metadata.roles = [];
          }
          console.log(users[i].app_metadata.roles);
          if (status) {
            users[i].app_metadata.roles.push('user');
          } else {
            users[i].app_metadata.roles = removeTag(users[i].app_metadata.roles,'user');
          }
          console.log(users[i].app_metadata.roles);
          break;
        }
      }
      setUsers(users);
      UserStore.emitChange();
      break

    default:
  }

});

export default UserStore;
