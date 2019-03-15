/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import {
  SIGN_IN, SIGN_IN_SUCCESS, SIGN_IN_ERROR,
  SIGN_OUT, FETCH_PROFILE_SUCCESS,
} from './constants';

export const initialState = fromJS({
  profile: {},
  token: '',
  loading: false,
  error: '',
});

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
      return state
        .set('loading', true)
        .set('error', '');
    case SIGN_IN_SUCCESS:
      return state
        .set('token', action.token)
        .set('loading', false);
    case SIGN_IN_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case FETCH_PROFILE_SUCCESS:
      return state
        .set('profile', fromJS(action.profile));
    case SIGN_OUT:
      return state
        .set('profile', fromJS({}))
        .set('token', '');
    case REHYDRATE:
      const savedState = action.payload && action.payload.loginPage ? action.payload.loginPage : state;

      return state
        .set('profile', savedState.get('profile'))
        .set('token', savedState.get('token'));
    default:
      return state;
  }
}

export default loginPageReducer;
