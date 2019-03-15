import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the LoginPage state domain
 */

const selectLoginPageDomain = state =>
  state.get('loginPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () =>
  createSelector(selectLoginPageDomain, substate => substate.toJS());

const makeSelectProfile = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('profile').toJS());
  
const makeSelectSignInLoading = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('loading'));

const makeSelectSignInError = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('error'));

const makeSelectToken = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('token'));

export default makeSelectLoginPage;
export {
  selectLoginPageDomain,
  makeSelectProfile,
  makeSelectSignInLoading,
  makeSelectSignInError,
  makeSelectToken,
};
