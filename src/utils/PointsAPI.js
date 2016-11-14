import request from 'superagent/lib/client';

import AuthStore from '../stores/AuthStore';

export default {

  // We want to get a list of all the contacts
  // from the API. This list contains reduced info
  // and will be be used in the sidebar
  getPoints: (url) => {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },

  getPointsForUser: (url) => {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .set('Authorization', 'Bearer ' + AuthStore.getJwt())
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },

  deletePoint: (url) => {
    return new Promise((resolve, reject) => {
      request
        .delete(url)
        .set('Authorization', 'Bearer ' + AuthStore.getJwt())
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },

  updatePoint: (url, points) => {
    return new Promise((resolve, reject) => {
      request
        .put(url)
        .type('json')
        .send({points: points})
        .set('Authorization', 'Bearer ' + AuthStore.getJwt())
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },

  submitPoints: (url, data) => {
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('json')
        .send(data)
        .set('Authorization', 'Bearer ' + AuthStore.getJwt())
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  }
}
