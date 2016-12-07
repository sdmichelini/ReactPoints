import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import UsersAPI from '../utils/UsersAPI';

import {URL} from '../constants/UrlConstants';

const AUTH_URL = URL+'/api/auth';

export default {

  recieveUsers: () => {
    UsersAPI
      .getToken(AUTH_URL)
      .then(response => {
        UsersAPI.getUsers('https://tkezm.auth0.com/api/v2/users?per_page=100',response.token)
        .then(users => {
          AppDispatcher.dispatch({
            actionType: UserConstants.RECIEVE_USERS,
            users: users
          });
        })
        .catch(message => {
          AppDispatcher.dispatch({
            actionType: UserConstants.RECIEVE_USERS_ERROR,
            message: message
          });
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: UserConstants.RECIEVE_USERS_ERROR,
          message: message
        });
      });
  },

  toggleUserStatus: (user_id, status) => {
    AppDispatcher.dispatch({
      actionType: UserConstants.SET_USER_STATUS,
      user_id: user_id,
      status: status
    });
  },

  editUserName: (user_id, name) => {
    AppDispatcher.dispatch({
      actionType: UserConstants.UPDATE_USER_NAME,
      user_id: user_id,
      name: name
    });
  },

  updateUsersStatus: (users) => {
    UsersAPI
      .getToken(AUTH_URL)
      .then(response => {
        for(let user of users) {
          if(user.is_changed) {
            UsersAPI.updateUser('https://tkezm.auth0.com/api/v2/users', user.user_id, user.app_metadata.roles,response.token, user.user_metadata||{})
            .then(response => {
              AppDispatcher.dispatch({
                actionType: UserConstants.SUBMIT_USERS_STATUS,
                response: response
              });
            })
            .catch(message => {
              AppDispatcher.dispatch({
                actionType: UserConstants.SUBMIT_USERS_STATUS_ERROR,
                message: message
              });
            });
          }
        }
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: UserConstants.SUBMIT_USERS_STATUS_ERROR,
          message: message
        });
      });
  },

  updateUserStatus: (user_id, roles, user_metadata) => {
    UsersAPI
      .getToken(AUTH_URL)
      .then(response => {
        UsersAPI.updateUser('https://tkezm.auth0.com/api/v2/users', user_id, roles,response.token, user_metadata)
        .then(users => {
          AppDispatcher.dispatch({
            actionType: UserConstants.SUBMIT_USERS_STATUS,
            users: users
          });
        })
        .catch(message => {
          AppDispatcher.dispatch({
            actionType: UserConstants.RECIEVE_USERS_ERROR,
            message: message
          });
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: UserConstants.RECIEVE_USERS_ERROR,
          message: message
        });
      });
  },
  updateUserSelection: (user_id, selection) => {
    AppDispatcher.dispatch({
      actionType: UserConstants.UPDATE_USER_SELECTION,
      user_id: user_id,
      selection: selection
    });
  },
  updateUserPoints: (user_id, points) => {
    AppDispatcher.dispatch({
      actionType: UserConstants.UPDATE_USER_POINTS,
      user_id: user_id,
      points: points
    });
  }

}
