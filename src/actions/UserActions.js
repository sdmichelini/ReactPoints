import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import UsersAPI from '../utils/UsersAPI';

export default {

  recieveUsers: () => {
    UsersAPI
      .getUsers('https://tkezm.auth0.com/api/v2/users')
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
  }

}
