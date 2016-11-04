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

  updateUserStatus: (user_id, status) => {
    UsersAPI
      .getToken('http://localhost:3001/api/auth')
      .then(response => {
        UsersAPI.updateUser('https://tkezm.auth0.com/api/v2/users',status,response.token)
        .then(users => {
          
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
  }

}
