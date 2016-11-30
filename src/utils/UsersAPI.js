import request from 'superagent/lib/client';

import AuthStore from '../stores/AuthStore';

export default {
  getToken: (url) => {
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
  getUsers: (url, token) => {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .set('Authorization', 'Bearer ' + token)
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  },
  updateUser: (url, user_id, roles, token, user_metadata) => {
    return new Promise((resolve, reject) => {
      request
        .patch(url+'/'+user_id)
        .type('json')
        .send({
          app_metadata: {
            roles: roles
          },
          user_metadata: user_metadata
        })
        .set('Authorization', 'Bearer ' + token)
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  }
}
