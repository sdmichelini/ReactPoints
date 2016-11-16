import AppDispatcher from '../dispatcher/AppDispatcher';
import PointConstants from '../constants/PointConstants';
import PointsAPI from '../utils/PointsAPI';

import {URL} from '../constants/UrlConstants';

const URL_USERS = URL+'/api/users/';
const URL_POINTS = URL+'/api/points';

export default {

  recievePoints: () => {
    PointsAPI
      .getPoints(URL_POINTS)
      .then(points => {
        AppDispatcher.dispatch({
          actionType: PointConstants.RECIEVE_POINTS,
          points: points.points
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
      .getPointsForUser(URL_USERS+user_id+'/points')
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
  deletePoint: (point_id) => {
    if(!point_id) {
      return;
    } else {
      PointsAPI.deletePoint(URL_POINTS+point_id)
      .then(response => {
        AppDispatcher.dispatch({
          actionType: PointConstants.DELETE_POINT_ITEM,
          id: point_id,
          response: response
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: PointConstants.DELETE_POINT_ITEM_ERROR,
          message: message
        });
      });
    }
  },
  updatePoint: (point_id, points) => {
    if(!point_id) {
      return;
    } else {
      PointsAPI.updatePoint(URL_POINTS+point_id, points)
      .then(response => {
        AppDispatcher.dispatch({
          actionType: PointConstants.UPDATE_POINT_ITEM,
          id: point_id,
          points: points,
          response: response
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: PointConstants.UPDATE_POINT_ITEM_ERROR,
          message: message
        });
      });
    }
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
        .submitPoints(URL_POINTS, data)
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
