import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _users = [];
let _users_selection = [];

function setUsers(users) {
  _users = users;
  _users_selection = [];
  for(let user of users) {
      _users_selection.push({name: user.name,id: user.user_id,selection: 3, points: 0});
    }
}

function setUsersSelection(users_selection) {
  _users_selection = users_selection;
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

  getUsersSelection() {
    return _users_selection;
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
          if (status) {
            users[i].app_metadata.roles.push('user');
          } else {
            users[i].app_metadata.roles = removeTag(users[i].app_metadata.roles,'user');
          }
          if(!users[i].is_changed) {
            users[i].is_changed = true;
          } else {
            users[i].is_changed = false;
          }
          break;
        }
      }
      setUsers(users);
      UserStore.emitChange();
      break
    case UserConstants.SUBMIT_USERS_STATUS_ERROR:
      alert(action.message);
      UserStore.emitChange();
      break

    case UserConstants.SUBMIT_USERS_STATUS:
      alert('Auth0 Updated');
      UserStore.emitChange();
      break

    case UserConstants.UPDATE_USER_SELECTION:
      let u_id = action.user_id;
      let selection = action.selection;
      let users_selection = _users_selection;
      for(let user of users_selection) {
        if(user.id == u_id) {
          user.selection = selection;
          break;
        }
      }
      setUsersSelection(users_selection);
      UserStore.emitChange();
      break
    case UserConstants.UPDATE_USER_POINTS:
      let users_selection2 = _users_selection;
      for(let user of users_selection2) {
        if(user.id == action.user_id) {
          user.points = action.points;
          break;
        }
      }
      setUsersSelection(users_selection2);
      UserStore.emitChange();
      break

    default:
  }

});

export default UserStore;
