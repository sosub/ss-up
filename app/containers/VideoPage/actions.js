/*
 *
 * VideoPage actions
 *
 */

import {
  SET_VIDEO,
  FETCH_VIDEO, FETCH_VIDEO_SUCCESS, FETCH_VIDEO_ERROR,
  ADD_VIDEO, ADD_VIDEO_SUCCESS, ADD_VIDEO_ERROR,
  UPDATE_VIDEO, UPDATE_VIDEO_SUCCESS, UPDATE_VIDEO_ERROR,
} from './constants';

export function setVideo(video) {
  return {
    type: SET_VIDEO,
    video,
  };
}

export function fetchVideo(videoId) {
  return {
    type: FETCH_VIDEO,
    videoId,
  };
}

export function fetchVideoSuccess(video) {
  return {
    type: FETCH_VIDEO_SUCCESS,
    video,
  };
}

export function fetchVideoError(error) {
  return {
    type: FETCH_VIDEO_ERROR,
    error,
  };
}

export function addVideo(video) {
  return {
    type: ADD_VIDEO,
    video,
  };
}

export function addVideoSuccess(video) {
  return {
    type: ADD_VIDEO_SUCCESS,
    video,
  };
}

export function addVideoError(error) {
  return {
    type: ADD_VIDEO_ERROR,
    error,
  };
}

export function updateVideo(video) {
  return {
    type: UPDATE_VIDEO,
    video,
  };
}

export function updateVideoSuccess(video) {
  return {
    type: UPDATE_VIDEO_SUCCESS,
    video,
  };
}

export function updateVideoError(error) {
  return {
    type: UPDATE_VIDEO_ERROR,
    error,
  };
}
