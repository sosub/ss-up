/*
 *
 * LoginPage actions
 *
 */

import {
  SIGN_IN, SIGN_IN_SUCCESS, SIGN_IN_ERROR,
  SIGN_OUT, FETCH_PROFILE_SUCCESS,
} from './constants';

export function signIn(username, password) {
  return {
    type: SIGN_IN,
    username,
    password,
  };
}

export function signInSuccess(token, profile) {
  return {
    type: SIGN_IN_SUCCESS,
    token,
  };
}

export function signInError(error) {
  return {
    type: SIGN_IN_ERROR,
    error,
  };
}

export function signOut() {
  return {
    type: SIGN_OUT,
  };
}

export function fetchProfileSuccess(profile) {
  return {
    type: FETCH_PROFILE_SUCCESS,
    profile,
  };
}
