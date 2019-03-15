import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sourcePage state domain
 */

const selectSourcePageDomain = state =>
  state.get('sourcePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SourcePage
 */

const makeSelectSourcePage = () =>
  createSelector(selectSourcePageDomain, substate => substate.toJS());

const makeSelectSource = () =>
  createSelector(selectSourcePageDomain, substate => substate.get('source').toJS());

  const makeSelectOriginSource = () =>
  createSelector(selectSourcePageDomain, substate => substate.get('originSource').toJS());

const makeSelectUpdateSourceLoading = () =>
  createSelector(selectSourcePageDomain, substate => substate.get('updateSourceLoading'));

const makeSelectUpdateSourceError = () =>
  createSelector(selectSourcePageDomain, substate => substate.get('updateSourceError'));

const makeSelectAddSourceLoading = () =>
  createSelector(selectSourcePageDomain, substate => substate.get('addSourceLoading'));

const makeSelectAddSourceError = () =>
  createSelector(selectSourcePageDomain, substate => substate.get('addSourceError'));

export default makeSelectSourcePage;
export {
  selectSourcePageDomain,
  makeSelectSource,
  makeSelectOriginSource,
  makeSelectUpdateSourceLoading,
  makeSelectUpdateSourceError,
  makeSelectAddSourceLoading,
  makeSelectAddSourceError,
};
