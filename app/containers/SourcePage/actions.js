/*
 *
 * SourcePage actions
 *
 */

import {
  SET_SOURCE,
  FETCH_SOURCE, FETCH_SOURCE_SUCCESS, FETCH_SOURCE_ERROR,
  ADD_SOURCE, ADD_SOURCE_SUCCESS, ADD_SOURCE_ERROR,
  UPDATE_SOURCE, UPDATE_SOURCE_SUCCESS, UPDATE_SOURCE_ERROR,
} from './constants';

export function setSource(source) {
  return {
    type: SET_SOURCE,
    source,
  };
}

export function fetchSource(sourceId) {
  return {
    type: FETCH_SOURCE,
    sourceId,
  };
}

export function fetchSourceSuccess(source) {
  return {
    type: FETCH_SOURCE_SUCCESS,
    source,
  };
}

export function fetchSourceError(error) {
  return {
    type: FETCH_SOURCE_ERROR,
    error,
  };
}

export function addSource(source) {
  return {
    type: ADD_SOURCE,
    source,
  };
}

export function addSourceSuccess(source) {
  return {
    type: ADD_SOURCE_SUCCESS,
    source,
  };
}

export function addSourceError(error) {
  return {
    type: ADD_SOURCE_ERROR,
    error,
  };
}

export function updateSource(source) {
  return {
    type: UPDATE_SOURCE,
    source,
  };
}

export function updateSourceSuccess(source) {
  return {
    type: UPDATE_SOURCE_SUCCESS,
    source,
  };
}

export function updateSourceError(error) {
  return {
    type: UPDATE_SOURCE_ERROR,
    error,
  };
}
