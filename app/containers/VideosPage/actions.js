/*
 *
 * VideosPage actions
 *
 */

import {
  FETCH_VIDEOS, FETCH_VIDEOS_SUCCESS, FETCH_VIDEOS_ERROR,
  PUBLISH_VIDEO, PUBLISH_VIDEO_SUCCESS, PUBLISH_VIDEO_ERROR,
} from './constants';

export function fetchVideos(filters) {
  return {
    type: FETCH_VIDEOS,
    filters,
  };
}

export function fetchVideosSuccess(videos) {
  return {
    type: FETCH_VIDEOS_SUCCESS,
    videos,
  };
}

export function fetchVideosError(error) {
  return {
    type: FETCH_VIDEOS_ERROR,
    error,
  };
}

export function publishVideo(videoId) {
  return {
    type: PUBLISH_VIDEO,
    videoId,
  };
}

export function publishVideoSuccess() {
  return {
    type: PUBLISH_VIDEO_SUCCESS,
  };
}

export function publishVideoError(error) {
  return {
    type: PUBLISH_VIDEO_ERROR,
    error,
  };
}
