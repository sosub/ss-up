/*
 *
 * SpeakerPage actions
 *
 */

import {
  SET_SPEAKER,
  FETCH_SPEAKER, FETCH_SPEAKER_SUCCESS, FETCH_SPEAKER_ERROR,
  ADD_SPEAKER, ADD_SPEAKER_SUCCESS, ADD_SPEAKER_ERROR,
  UPDATE_SPEAKER, UPDATE_SPEAKER_SUCCESS, UPDATE_SPEAKER_ERROR,
} from './constants';

export function setSpeaker(speaker) {
  return {
    type: SET_SPEAKER,
    speaker,
  };
}

export function fetchSpeaker(speakerId) {
  return {
    type: FETCH_SPEAKER,
    speakerId,
  };
}

export function fetchSpeakerSuccess(speaker) {
  return {
    type: FETCH_SPEAKER_SUCCESS,
    speaker,
  };
}

export function fetchSpeakerError(error) {
  return {
    type: FETCH_SPEAKER_ERROR,
    error,
  };
}

export function addSpeaker(speaker) {
  return {
    type: ADD_SPEAKER,
    speaker,
  };
}

export function addSpeakerSuccess(speaker) {
  return {
    type: ADD_SPEAKER_SUCCESS,
    speaker,
  };
}

export function addSpeakerError(error) {
  return {
    type: ADD_SPEAKER_ERROR,
    error,
  };
}

export function updateSpeaker(speaker) {
  return {
    type: UPDATE_SPEAKER,
    speaker,
  };
}

export function updateSpeakerSuccess(speaker) {
  return {
    type: UPDATE_SPEAKER_SUCCESS,
    speaker,
  };
}

export function updateSpeakerError(error) {
  return {
    type: UPDATE_SPEAKER_ERROR,
    error,
  };
}
