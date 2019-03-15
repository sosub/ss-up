import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from 'containers/App';
import LanguageProvider from 'containers/LanguageProvider';
import { ConnectedRouter } from 'connected-react-router/immutable';
import history from 'utils/history';

import configureStore from './configureStore';

import { fetchProfile } from 'containers/LoginPage/apis';
import { signOut, fetchProfileSuccess } from 'containers/LoginPage/actions';

export default class AppLoading extends Component {
  constructor() {
    super();
    const initialState = {};

    this.state = {
      status: 'storeLoading',
      store: configureStore(initialState, history, this.onCompleted),
    }
  }

  onCompleted = () => {
    const token = this.state.store.getState().get('loginPage').get('token');
    if (token) {
      this.setState({ status: 'authenticating' })
      this.onAuthenticate(token);
    } else {
      this.setState({ status: 'ready' })
    }
  }

  onAuthenticate = async (token) => {
    const { profile } = await fetchProfile(token);
    if (!profile) {
      this.state.store.dispatch(signOut());
    } else {
      this.state.store.dispatch(fetchProfileSuccess(profile));
    }
    this.setState({ status: 'ready' });
  }

  render() {
    const { status, store } = this.state;
    const { messages } = this.props;

    if (status === 'storeLoading') {
      return <span>Loading...</span>;
    }

    if (status === 'authenticating') {
      return <span>Authenticating...</span>;
    }

    return (
        <Provider store={store}>
          <LanguageProvider messages={messages}>
            <ConnectedRouter history={history}>
              <App />
            </ConnectedRouter>
          </LanguageProvider>
        </Provider>
    )
  }
}
