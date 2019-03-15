/*
 *
 * SourcePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_SOURCE,
  FETCH_SOURCE, FETCH_SOURCE_SUCCESS, FETCH_SOURCE_ERROR,
  ADD_SOURCE, ADD_SOURCE_SUCCESS, ADD_SOURCE_ERROR,
  UPDATE_SOURCE, UPDATE_SOURCE_SUCCESS, UPDATE_SOURCE_ERROR,

} from './constants';

export const initialState = fromJS({
  source: {},
  originSource: {},
  fetchSourceLoading: false,
  fetchSourceError: '',
  addSourceLoading: false,
  addSourceError: '',
  updateSourceLoading: false,
  updateSourceError: '',
});

function sourcePageReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SOURCE:
      return state
        .set('source', fromJS(action.source));

    case FETCH_SOURCE:
      return state
        .set('source', fromJS({}))
        .set('originSource', fromJS({}))
        .set('fetchSourceLoading', true)
        .set('fetchSourceError', '');
    case FETCH_SOURCE_SUCCESS:
      return state
        .set('source', fromJS(action.source))
        .set('originSource', fromJS(action.source))
        .set('fetchSourceLoading', false);
    case FETCH_SOURCE_ERROR:
      return state
        .set('fetchSourceError', action.error)
        .set('fetchSourceLoading', false);

    case ADD_SOURCE:
      return state
        .set('addSourceLoading', true)
        .set('addSourceError', '');
    case ADD_SOURCE_SUCCESS:
      return state
        .set('source', fromJS(action.source))
        .set('originSource', fromJS(action.source))
        .set('addSourceLoading', false);
    case ADD_SOURCE_ERROR:
      return state
        .set('addSourceError', action.error)
        .set('addSourceLoading', false);

    case UPDATE_SOURCE:
      return state
        .set('updateSourceLoading', true)
        .set('updateSourceError', '');
    case UPDATE_SOURCE_SUCCESS:
      return state
        .set('source', fromJS(action.source))
        .set('originSource', fromJS(action.source))
        .set('updateSourceLoading', false);
    case UPDATE_SOURCE_ERROR:
      return state
        .set('updateSourceError', action.error)
        .set('updateSourceLoading', false);
    default:
      return state;
  }
}

export default sourcePageReducer;
