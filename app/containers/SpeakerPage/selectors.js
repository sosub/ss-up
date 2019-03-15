import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the speakerPage state domain
 */

const selectSpeakerPageDomain = state =>
  state.get('speakerPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SpeakerPage
 */

const makeSelectSpeakerPage = () =>
  createSelector(selectSpeakerPageDomain, substate => substate.toJS());

const makeSelectSpeaker = () =>
  createSelector(selectSpeakerPageDomain, substate => substate.get('speaker').toJS());

  const makeSelectOriginSpeaker = () =>
  createSelector(selectSpeakerPageDomain, substate => substate.get('originSpeaker').toJS());

const makeSelectUpdateSpeakerLoading = () =>
  createSelector(selectSpeakerPageDomain, substate => substate.get('updateSpeakerLoading'));

const makeSelectUpdateSpeakerError = () =>
  createSelector(selectSpeakerPageDomain, substate => substate.get('updateSpeakerError'));

const makeSelectAddSpeakerLoading = () =>
  createSelector(selectSpeakerPageDomain, substate => substate.get('addSpeakerLoading'));

const makeSelectAddSpeakerError = () =>
  createSelector(selectSpeakerPageDomain, substate => substate.get('addSpeakerError'));

export default makeSelectSpeakerPage;
export {
  selectSpeakerPageDomain,
  makeSelectSpeaker,
  makeSelectOriginSpeaker,
  makeSelectUpdateSpeakerLoading,
  makeSelectUpdateSpeakerError,
  makeSelectAddSpeakerLoading,
  makeSelectAddSpeakerError,
};
