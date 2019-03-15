/*
 *
 * SpeakersPage actions
 *
 */

import {
  FETCH_SPEAKERS, FETCH_SPEAKERS_SUCCESS, FETCH_SPEAKERS_ERROR,
  REMOVE_SPEAKER, REMOVE_SPEAKER_SUCCESS, REMOVE_SPEAKER_ERROR,
} from './constants';

export function fetchSpeakers(filters) {
  return {
    type: FETCH_SPEAKERS,
    filters,
  };
}

export function fetchSpeakersSuccess(speakers) {
  return {
    type: FETCH_SPEAKERS_SUCCESS,
    speakers,
  };
}

export function fetchSpeakersError(error) {
  return {
    type: FETCH_SPEAKERS_ERROR,
    error,
  };
}

export function removeSpeaker(speakerId) {
  return {
    type: REMOVE_SPEAKER,
    speakerId,
  };
}

export function removeSpeakerSuccess(speakerId) {
  return {
    type: REMOVE_SPEAKER_SUCCESS,
    speakerId,
  };
}

export function removeSpeakerError(error) {
  return {
    type: REMOVE_SPEAKER_ERROR,
    error,
  };
}
