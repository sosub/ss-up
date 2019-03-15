import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the speakersPage state domain
 */

const selectSpeakersPageDomain = state =>
  state.get('speakersPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SpeakersPage
 */

const makeSelectSpeakersPage = () =>
  createSelector(selectSpeakersPageDomain, substate => substate.toJS());

const makeSelectSpeakers = () =>
  createSelector(selectSpeakersPageDomain, substate => substate.get('speakers').toJS());
  
const makeSelectFetchSpeakerLoading = () =>
  createSelector(selectSpeakersPageDomain, substate => substate.get('loading'));

const makeSelectFetchSpeakerError = () =>
  createSelector(selectSpeakersPageDomain, substate => substate.get('error'));

const makeSelectRemoveSpeakerLoading = () =>
  createSelector(selectSpeakersPageDomain, substate => substate.get('removeSpeakerLoading'));

const makeSelectRemoveSpeakerError = () =>
  createSelector(selectSpeakersPageDomain, substate => substate.get('removeSpeakerError'));

export default makeSelectSpeakersPage;
export {
  selectSpeakersPageDomain,
  makeSelectSpeakers,
  makeSelectFetchSpeakerLoading,
  makeSelectFetchSpeakerError,
  makeSelectRemoveSpeakerLoading,
  makeSelectRemoveSpeakerError,
};
