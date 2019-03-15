/*
 *
 * VideosPage saga
 *
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_VIDEOS, PUBLISH_VIDEO } from './constants';
import {
  fetchVideosError, fetchVideosSuccess,
  publishVideoError, publishVideoSuccess,
} from './actions';
import { fetchVideos, publishVideo } from './apis';
import { makeSelectToken } from 'containers/LoginPage/selectors';

export function* fetchVideosSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { videos } = yield call(fetchVideos, token, action.filters);
    yield put(fetchVideosSuccess(videos));
  } catch (e) {
    yield put(fetchVideosError(e.message));
  }
}

export function* publishVideoSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    yield call(publishVideo, token, action.videoId);
    yield put(publishVideoSuccess());
  } catch (e) {
    yield put(publishVideoError(e.message));
  }
}

export default function* videosPageSaga() {
  yield takeLatest(FETCH_VIDEOS, fetchVideosSideEffect);
  yield takeLatest(PUBLISH_VIDEO, publishVideoSideEffect);
}
