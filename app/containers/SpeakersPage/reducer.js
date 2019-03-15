/*
 *
 * SpeakersPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_SPEAKERS, FETCH_SPEAKERS_SUCCESS, FETCH_SPEAKERS_ERROR,
  REMOVE_SPEAKER, REMOVE_SPEAKER_SUCCESS, REMOVE_SPEAKER_ERROR,
} from './constants';

export const initialState = fromJS({
  speakers: [],
  loading: false,
  error: '',
  removeSpeakerLoading: false,
  removeSpeakerError: '',
  cloneSpeakerId: null,
  cloneSpeakerLoading: false,
  cloneSpeakerError: '',
});

function speakersPageReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SPEAKERS:
      return state
        .set('loading', true)
        .set('error', '');
    case FETCH_SPEAKERS_SUCCESS:
      return state
        .set('speakers', fromJS(action.speakers))
        .set('loading', false);
    case FETCH_SPEAKERS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case REMOVE_SPEAKER:
      return state
        .set('removeSpeakerLoading', true)
        .set('removeSpeakerError', '');
    case REMOVE_SPEAKER_SUCCESS:
      return state
        .set(
          'speakers',
          state.get('speakers').filter(speaker => speaker.get('id') !== action.speakerId),
        )
        .set('removeSpeakerLoading', false);
    case REMOVE_SPEAKER_ERROR:
      return state
        .set('removeSpeakerError', action.error)
        .set('removeSpeakerLoading', false);
    default:
      return state;
  }
}

export default speakersPageReducer;
