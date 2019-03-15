/*
 *
 * SourcesPage actions
 *
 */

import {
  FETCH_SOURCES, FETCH_SOURCES_SUCCESS, FETCH_SOURCES_ERROR,
  REMOVE_SOURCE, REMOVE_SOURCE_SUCCESS, REMOVE_SOURCE_ERROR,
} from './constants';

export function fetchSources(filters) {
  return {
    type: FETCH_SOURCES,
    filters,
  };
}

export function fetchSourcesSuccess(sources) {
  return {
    type: FETCH_SOURCES_SUCCESS,
    sources,
  };
}

export function fetchSourcesError(error) {
  return {
    type: FETCH_SOURCES_ERROR,
    error,
  };
}

export function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    sourceId,
  };
}

export function removeSourceSuccess(sourceId) {
  return {
    type: REMOVE_SOURCE_SUCCESS,
    sourceId,
  };
}

export function removeSourceError(error) {
  return {
    type: REMOVE_SOURCE_ERROR,
    error,
  };
}
