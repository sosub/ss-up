/*
 *
 * SourcePage saga
 *
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_SOURCE, ADD_SOURCE, UPDATE_SOURCE } from './constants';
import {
  fetchSourceError, fetchSourceSuccess,
  addSourceError, addSourceSuccess,
  updateSourceError, updateSourceSuccess,
} from './actions';
import { fetchSource, addSource, updateSource } from './apis';
import { makeSelectToken } from 'containers/LoginPage/selectors';


export function* fetchSourceSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { source } = yield call(fetchSource, token, action.sourceId);
    yield put(fetchSourceSuccess(source));
  } catch (e) {
    yield put(fetchSourceError(e.message));
  }
}

export function* addSourceSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { source } = yield call(addSource, token, action.source);
    yield put(addSourceSuccess(source));
  } catch (e) {
    yield put(addSourceError(e.message));
  }
}

export function* updateSourceSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { source } = yield call(updateSource, token, action.source);
    yield put(updateSourceSuccess(source));
  } catch (e) {
    yield put(updateSourceError(e.message));
  }
}

export default function* sourcePageSaga() {
  yield takeLatest(FETCH_SOURCE, fetchSourceSideEffect);
  yield takeLatest(ADD_SOURCE, addSourceSideEffect);
  yield takeLatest(UPDATE_SOURCE, updateSourceSideEffect);
}
