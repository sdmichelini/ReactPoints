import AppDispatcher from '../dispatcher/AppDispatcher';
import PointConstants from '../constants/PointConstants';
import PointsAPI from '../utils/PointsAPI';

export default {

  recievePoints: () => {
    PointsAPI
      .getPoints('http://localhost:3001/api/points')
      .then(points => {
        AppDispatcher.dispatch({
          actionType: PointConstants.RECIEVE_POINTS,
          points: points.points.sort((a ,b) => {
            return a.points < b.points
          })
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: PointConstants.RECIEVE_POINTS_ERROR,
          message: message
        });
      });
  },
  getPointsItemForUser: (user_id) => {
    PointsAPI
      .getPointsForUser('http://localhost:3001/api/users/'+user_id+'/points')
      .then(user_points => {
        AppDispatcher.dispatch({
          actionType: PointConstants.RECIEVE_POINTS_ITEM,
          point_items: user_points
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: PointConstants.RECIEVE_POINTS_ITEM_ERROR,
          message: message
        });
      })
  },
  submitPointsForEvent: (event_id, users) => {
    if(!Array.isArray(users)) {
      AppDispatcher.dispatch({
        actionType: PointConstants.SUBMIT_POINTS_ERROR,
        message: 'Invalid Users Array.'
      });
    } else {
      let data = {event_id: event_id, users: users};
      PointsAPI
        .submitPoints('http://localhost:3001/api/points', data)
        .then(response => {
          AppDispatcher.dispatch({
            actionType: PointConstants.SUBMIT_POINTS,
            response: response
          });
        })
        .catch(message => {
          AppDispatcher.dispatch({
            actionType: PointConstants.SUBMIT_POINTS_ERROR,
            message: message
          });
        });
    }
  }

}
