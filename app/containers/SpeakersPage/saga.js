/*
 *
 * SpeakersPage saga
 *
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_SPEAKERS, REMOVE_SPEAKER } from './constants';
import {
  fetchSpeakersError, fetchSpeakersSuccess,
  removeSpeakerError, removeSpeakerSuccess,
} from './actions';
import { fetchSpeakers, removeSpeaker } from './apis';
import { makeSelectToken } from 'containers/LoginPage/selectors';

export function* fetchSpeakersSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { speakers } = yield call(fetchSpeakers, token, action.filters);
    yield put(fetchSpeakersSuccess(speakers));
  } catch (e) {
    yield put(fetchSpeakersError(e.message));
  }
}

export function* removeSpeakerSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { speakerId } = yield call(removeSpeaker, token, action.speakerId);
    yield put(removeSpeakerSuccess(speakerId));
  } catch (e) {
    yield put(removeSpeakerError(e.message));
  }
}

export default function* speakersPageSaga() {
  yield takeLatest(FETCH_SPEAKERS, fetchSpeakersSideEffect);
  yield takeLatest(REMOVE_SPEAKER, removeSpeakerSideEffect);
}
