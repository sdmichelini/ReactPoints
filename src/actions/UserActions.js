import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import UsersAPI from '../utils/UsersAPI';

export default {

  recieveUsers: () => {
    UsersAPI
      .getUsers('http://localhost:3001/api/auth')
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
