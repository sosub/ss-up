import { fromJS } from 'immutable';
import campaignPageReducer from '../reducer';

describe('campaignPageReducer', () => {
  it('returns the initial state', () => {
    expect(campaignPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
