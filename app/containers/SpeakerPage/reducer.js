/*
 *
 * SpeakerPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_SPEAKER,
  FETCH_SPEAKER, FETCH_SPEAKER_SUCCESS, FETCH_SPEAKER_ERROR,
  ADD_SPEAKER, ADD_SPEAKER_SUCCESS, ADD_SPEAKER_ERROR,
  UPDATE_SPEAKER, UPDATE_SPEAKER_SUCCESS, UPDATE_SPEAKER_ERROR,

} from './constants';

export const initialState = fromJS({
  speaker: {},
  originSpeaker: {},
  fetchSpeakerLoading: false,
  fetchSpeakerError: '',
  addSpeakerLoading: false,
  addSpeakerError: '',
  updateSpeakerLoading: false,
  updateSpeakerError: '',
});

function speakerPageReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPEAKER:
      return state
        .set('speaker', fromJS(action.speaker));

    case FETCH_SPEAKER:
      return state
        .set('speaker', fromJS({}))
        .set('originSpeaker', fromJS({}))
        .set('fetchSpeakerLoading', true)
        .set('fetchSpeakerError', '');
    case FETCH_SPEAKER_SUCCESS:
      return state
        .set('speaker', fromJS(action.speaker))
        .set('originSpeaker', fromJS(action.speaker))
        .set('fetchSpeakerLoading', false);
    case FETCH_SPEAKER_ERROR:
      return state
        .set('fetchSpeakerError', action.error)
        .set('fetchSpeakerLoading', false);

    case ADD_SPEAKER:
      return state
        .set('addSpeakerLoading', true)
        .set('addSpeakerError', '');
    case ADD_SPEAKER_SUCCESS:
      return state
        .set('speaker', fromJS(action.speaker))
        .set('originSpeaker', fromJS(action.speaker))
        .set('addSpeakerLoading', false);
    case ADD_SPEAKER_ERROR:
      return state
        .set('addSpeakerError', action.error)
        .set('addSpeakerLoading', false);

    case UPDATE_SPEAKER:
      return state
        .set('updateSpeakerLoading', true)
        .set('updateSpeakerError', '');
    case UPDATE_SPEAKER_SUCCESS:
      return state
        .set('speaker', fromJS(action.speaker))
        .set('originSpeaker', fromJS(action.speaker))
        .set('updateSpeakerLoading', false);
    case UPDATE_SPEAKER_ERROR:
      return state
        .set('updateSpeakerError', action.error)
        .set('updateSpeakerLoading', false);
    default:
      return state;
  }
}

export default speakerPageReducer;
