/*
 *
 * VideoPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_VIDEO,
  FETCH_VIDEO, FETCH_VIDEO_SUCCESS, FETCH_VIDEO_ERROR,
  ADD_VIDEO, ADD_VIDEO_SUCCESS, ADD_VIDEO_ERROR,
  UPDATE_VIDEO, UPDATE_VIDEO_SUCCESS, UPDATE_VIDEO_ERROR,

} from './constants';

export const initialState = fromJS({
  video: {},
  originVideo: {},
  fetchVideoLoading: false,
  fetchVideoError: '',
  addVideoLoading: false,
  addVideoError: '',
  updateVideoLoading: false,
  updateVideoError: '',
});

function videoPageReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIDEO:
      return state
        .set('video', fromJS(action.video));

    case FETCH_VIDEO:
      return state
        .set('video', fromJS({}))
        .set('originVideo', fromJS({}))
        .set('fetchVideoLoading', true)
        .set('fetchVideoError', '');
    case FETCH_VIDEO_SUCCESS:
      return state
        .set('video', fromJS(action.video))
        .set('originVideo', fromJS(action.video))
        .set('fetchVideoLoading', false);
    case FETCH_VIDEO_ERROR:
      return state
        .set('fetchVideoError', action.error)
        .set('fetchVideoLoading', false);

    case ADD_VIDEO:
      return state
        .set('addVideoLoading', true)
        .set('addVideoError', '');
    case ADD_VIDEO_SUCCESS:
      return state
        .set('video', fromJS(action.video))
        .set('originVideo', fromJS(action.video))
        .set('addVideoLoading', false);
    case ADD_VIDEO_ERROR:
      return state
        .set('addVideoError', action.error)
        .set('addVideoLoading', false);

    case UPDATE_VIDEO:
      return state
        .set('updateVideoLoading', true)
        .set('updateVideoError', '');
    case UPDATE_VIDEO_SUCCESS:
      return state
        .set('video', fromJS(action.video))
        .set('originVideo', fromJS(action.video))
        .set('updateVideoLoading', false);
    case UPDATE_VIDEO_ERROR:
      return state
        .set('updateVideoError', action.error)
        .set('updateVideoLoading', false);
    default:
      return state;
  }
}

export default videoPageReducer;
