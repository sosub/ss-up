/*
 *
 * VideoPage saga
 *
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_VIDEO, ADD_VIDEO, UPDATE_VIDEO } from './constants';
import {
  fetchVideoError, fetchVideoSuccess,
  addVideoError, addVideoSuccess,
  updateVideoError, updateVideoSuccess,
} from './actions';
import { fetchVideo, addVideo, updateVideo } from './apis';
import { makeSelectToken } from 'containers/LoginPage/selectors';


export function* fetchVideoSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { video } = yield call(fetchVideo, token, action.videoId);
    yield put(fetchVideoSuccess(video));
  } catch (e) {
    yield put(fetchVideoError(e.message));
  }
}

export function* addVideoSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { video } = yield call(addVideo, token, action.video);
    yield put(addVideoSuccess(video));
  } catch (e) {
    yield put(addVideoError(e.message));
  }
}

export function* updateVideoSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { video } = yield call(updateVideo, token, action.video);
    yield put(updateVideoSuccess(video));
  } catch (e) {
    yield put(updateVideoError(e.message));
  }
}

export default function* videoPageSaga() {
  yield takeLatest(FETCH_VIDEO, fetchVideoSideEffect);
  yield takeLatest(ADD_VIDEO, addVideoSideEffect);
  yield takeLatest(UPDATE_VIDEO, updateVideoSideEffect);
}
