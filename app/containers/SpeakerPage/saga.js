/*
 *
 * SpeakerPage saga
 *
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_SPEAKER, ADD_SPEAKER, UPDATE_SPEAKER } from './constants';
import {
  fetchSpeakerError, fetchSpeakerSuccess,
  addSpeakerError, addSpeakerSuccess,
  updateSpeakerError, updateSpeakerSuccess,
} from './actions';
import { fetchSpeaker, addSpeaker, updateSpeaker } from './apis';
import { makeSelectToken } from 'containers/LoginPage/selectors';


export function* fetchSpeakerSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { speaker } = yield call(fetchSpeaker, token, action.speakerId);
    yield put(fetchSpeakerSuccess(speaker));
  } catch (e) {
    yield put(fetchSpeakerError(e.message));
  }
}

export function* addSpeakerSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { speaker } = yield call(addSpeaker, token, action.speaker);
    yield put(addSpeakerSuccess(speaker));
  } catch (e) {
    yield put(addSpeakerError(e.message));
  }
}

export function* updateSpeakerSideEffect(action) {
  try {
    const token = yield select(makeSelectToken());
    const { speaker } = yield call(updateSpeaker, token, action.speaker);
    yield put(updateSpeakerSuccess(speaker));
  } catch (e) {
    yield put(updateSpeakerError(e.message));
  }
}

export default function* speakerPageSaga() {
  yield takeLatest(FETCH_SPEAKER, fetchSpeakerSideEffect);
  yield takeLatest(ADD_SPEAKER, addSpeakerSideEffect);
  yield takeLatest(UPDATE_SPEAKER, updateSpeakerSideEffect);
}
