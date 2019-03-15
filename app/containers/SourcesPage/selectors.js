import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sourcesPage state domain
 */

const selectSourcesPageDomain = state =>
  state.get('sourcesPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SourcesPage
 */

const makeSelectSourcesPage = () =>
  createSelector(selectSourcesPageDomain, substate => substate.toJS());

const makeSelectSources = () =>
  createSelector(selectSourcesPageDomain, substate => substate.get('sources').toJS());
  
const makeSelectFetchSourceLoading = () =>
  createSelector(selectSourcesPageDomain, substate => substate.get('loading'));

const makeSelectFetchSourceError = () =>
  createSelector(selectSourcesPageDomain, substate => substate.get('error'));

const makeSelectRemoveSourceLoading = () =>
  createSelector(selectSourcesPageDomain, substate => substate.get('removeSourceLoading'));

const makeSelectRemoveSourceError = () =>
  createSelector(selectSourcesPageDomain, substate => substate.get('removeSourceError'));

export default makeSelectSourcesPage;
export {
  selectSourcesPageDomain,
  makeSelectSources,
  makeSelectFetchSourceLoading,
  makeSelectFetchSourceError,
  makeSelectRemoveSourceLoading,
  makeSelectRemoveSourceError,
};
