import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the videosPage state domain
 */

const selectVideosPageDomain = state =>
  state.get('videosPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by VideosPage
 */

const makeSelectVideosPage = () =>
  createSelector(selectVideosPageDomain, substate => substate.toJS());

const makeSelectVideos = () =>
  createSelector(selectVideosPageDomain, substate => substate.get('videos').toJS());
  
const makeSelectFetchVideoLoading = () =>
  createSelector(selectVideosPageDomain, substate => substate.get('loading'));

const makeSelectFetchVideoError = () =>
  createSelector(selectVideosPageDomain, substate => substate.get('error'));

const makeSelectPublishVideoLoading = () =>
  createSelector(selectVideosPageDomain, substate => substate.get('publishVideoLoading'));

const makeSelectPublishVideoError = () =>
  createSelector(selectVideosPageDomain, substate => substate.get('publishVideoError'));

export default makeSelectVideosPage;
export {
  selectVideosPageDomain,
  makeSelectVideos,
  makeSelectFetchVideoLoading,
  makeSelectFetchVideoError,
  makeSelectPublishVideoLoading,
  makeSelectPublishVideoError,
};
