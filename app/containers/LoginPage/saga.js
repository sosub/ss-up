/*
 *
 * LoginPage saga
 *
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { SIGN_IN } from './constants';
import {
  signInError, signInSuccess, fetchProfileSuccess,
} from './actions';
import { signIn, fetchProfile } from './apis';

export function* signInSideEffect(action) {
  try {
    const { token } = yield call(signIn, action.username, action.password);
    const { profile } = yield call(fetchProfile, token);
    yield put(signInSuccess(token));
    yield put(fetchProfileSuccess(profile));
  } catch (e) {
    yield put(signInError(e.message));
  }
}

export default function* loginPageSaga() {
  yield takeLatest(SIGN_IN, signInSideEffect);
}
