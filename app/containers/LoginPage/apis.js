/*
 *
 * LoginPage apis
 *
 */

import request from 'utils/request';
import { BASE_URL } from 'config/app';

export function signIn(username, password) {
  return request(`${BASE_URL}/rest-auth/login/`, {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password
    })
  }).then(json => {
    console.log('signIn', json);

    if (json && json.key) {
      return {
        token: json.key
      }
    }

    throw new Error(json.non_field_errors[0]);
  });
}

export function fetchProfile(token) {
  return request(`${BASE_URL}/api/user/`, {
    method: 'GET',
    headers: {
      "Authorization": `Token ${token}`,
    },
  }).then(json => {
    console.log('fetchProfile', json);

    if (json) {
      return {
        profile: json
      }
    }

    throw new Error(json.detail);
  });
}
