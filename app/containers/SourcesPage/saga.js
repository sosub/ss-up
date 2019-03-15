/*
 *
 * SourcesPage saga
 *
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_SOURCES, REMOVE_SOURCE } from './constants';
import {
  fetchSourcesError, fetchSourcesSuccess,
  removeSourceError, removeSourceSuccess,
} from './actions';
import { fetchSources, removeSource } from './apis';
import { makeSelectToken } from 'containers/LoginPage/selectors';

export function* fetchSourcesSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { sources } = yield call(fetchSources, token, action.filters);
    yield put(fetchSourcesSuccess(sources));
  } catch (e) {
    yield put(fetchSourcesError(e.message));
  }
}

export function* removeSourceSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { sourceId } = yield call(removeSource, token, action.sourceId);
    yield put(removeSourceSuccess(sourceId));
  } catch (e) {
    yield put(removeSourceError(e.message));
  }
}

export default function* sourcesPageSaga() {
  yield takeLatest(FETCH_SOURCES, fetchSourcesSideEffect);
  yield takeLatest(REMOVE_SOURCE, removeSourceSideEffect);
}
