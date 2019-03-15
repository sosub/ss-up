/*
 *
 * VideosPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_VIDEOS, FETCH_VIDEOS_SUCCESS, FETCH_VIDEOS_ERROR,
  PUBLISH_VIDEO, PUBLISH_VIDEO_SUCCESS, PUBLISH_VIDEO_ERROR,
} from './constants';

export const initialState = fromJS({
  videos: [],
  loading: false,
  error: '',
  publishVideoLoading: false,
  publishVideoError: '',
  cloneVideoId: null,
  cloneVideoLoading: false,
  cloneVideoError: '',
});

function videosPageReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_VIDEOS:
      return state
        .set('loading', true)
        .set('error', '');
    case FETCH_VIDEOS_SUCCESS:
      return state
        .set('videos', fromJS(action.videos))
        .set('loading', false);
    case FETCH_VIDEOS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case PUBLISH_VIDEO:
      return state
        .set('publishVideoLoading', true)
        .set('publishVideoError', '');
    case PUBLISH_VIDEO_SUCCESS:
      return state
        .set('publishVideoLoading', false);
    case PUBLISH_VIDEO_ERROR:
      return state
        .set('publishVideoError', action.error)
        .set('publishVideoLoading', false);
    default:
      return state;
  }
}

export default videosPageReducer;
