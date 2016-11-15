import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import UsersAPI from '../utils/UsersAPI';

export default {

  recieveUsers: () => {
    UsersAPI
      .getToken('http://localhost:3001/api/auth')
      .then(response => {
        UsersAPI.getUsers('https://tkezm.auth0.com/api/v2/users',response.token)
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

  updateUsersStatus: (users) => {
    UsersAPI
      .getToken('http://localhost:3001/api/auth')
      .then(response => {
        for(let user of users) {
          if(user.is_changed) {
            UsersAPI.updateUser('https://tkezm.auth0.com/api/v2/users', user.user_id, user.app_metadata.roles,response.token)
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

  updateUserStatus: (user_id, roles) => {
    UsersAPI
      .getToken('http://localhost:3001/api/auth')
      .then(response => {
        UsersAPI.updateUser('https://tkezm.auth0.com/api/v2/users', user_id, roles,response.token)
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
