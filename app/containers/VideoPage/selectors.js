import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the videoPage state domain
 */

const selectVideoPageDomain = state =>
  state.get('videoPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by VideoPage
 */

const makeSelectVideoPage = () =>
  createSelector(selectVideoPageDomain, substate => substate.toJS());

const makeSelectVideo = () =>
  createSelector(selectVideoPageDomain, substate => substate.get('video').toJS());

  const makeSelectOriginVideo = () =>
  createSelector(selectVideoPageDomain, substate => substate.get('originVideo').toJS());

const makeSelectUpdateVideoLoading = () =>
  createSelector(selectVideoPageDomain, substate => substate.get('updateVideoLoading'));

const makeSelectUpdateVideoError = () =>
  createSelector(selectVideoPageDomain, substate => substate.get('updateVideoError'));

const makeSelectAddVideoLoading = () =>
  createSelector(selectVideoPageDomain, substate => substate.get('addVideoLoading'));

const makeSelectAddVideoError = () =>
  createSelector(selectVideoPageDomain, substate => substate.get('addVideoError'));

export default makeSelectVideoPage;
export {
  selectVideoPageDomain,
  makeSelectVideo,
  makeSelectOriginVideo,
  makeSelectUpdateVideoLoading,
  makeSelectUpdateVideoError,
  makeSelectAddVideoLoading,
  makeSelectAddVideoError,
};
