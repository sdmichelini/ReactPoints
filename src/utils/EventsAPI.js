import request from 'superagent/lib/client';

import AuthStore from '../stores/AuthStore';

export default {

  // We want to get a list of all the contacts
  // from the API. This list contains reduced info
  // and will be be used in the sidebar
  getEvents: (url) => {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },

  getEvents: (url, count) => {
    return new Promise((resolve, reject) => {
      request
        .get(url+'?count='+String(count))
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },

  getEvent: (url) => {
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
  //HTTP post to the endpoint
  createEvent: (url, _event) => {
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('json')
        .send(_event)
        .set('Authorization', 'Bearer ' + AuthStore.getJwt())
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },

  deleteEvent: (url) => {
    return new Promise((resolve, reject) => {
      request
        .delete(url)
        .type('json')
        .set('Authorization', 'Bearer ' + AuthStore.getJwt())
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  }
}
