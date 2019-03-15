/*
 *
 * SourcesPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_SOURCES, FETCH_SOURCES_SUCCESS, FETCH_SOURCES_ERROR,
  REMOVE_SOURCE, REMOVE_SOURCE_SUCCESS, REMOVE_SOURCE_ERROR,
} from './constants';

export const initialState = fromJS({
  sources: [],
  loading: false,
  error: '',
  removeSourceLoading: false,
  removeSourceError: '',
  cloneSourceId: null,
  cloneSourceLoading: false,
  cloneSourceError: '',
});

function sourcesPageReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SOURCES:
      return state
        .set('loading', true)
        .set('error', '');
    case FETCH_SOURCES_SUCCESS:
      return state
        .set('sources', fromJS(action.sources))
        .set('loading', false);
    case FETCH_SOURCES_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case REMOVE_SOURCE:
      return state
        .set('removeSourceLoading', true)
        .set('removeSourceError', '');
    case REMOVE_SOURCE_SUCCESS:
      return state
        .set(
          'sources',
          state.get('sources').filter(source => source.get('id') !== action.sourceId),
        )
        .set('removeSourceLoading', false);
    case REMOVE_SOURCE_ERROR:
      return state
        .set('removeSourceError', action.error)
        .set('removeSourceLoading', false);
    default:
      return state;
  }
}

export default sourcesPageReducer;
