/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import VideosPage from 'containers/VideosPage';
import VideoPage from 'containers/VideoPage';
import SpeakersPage from 'containers/SpeakersPage';
import SpeakerPage from 'containers/SpeakerPage';
import SourcesPage from 'containers/SourcesPage';
import SourcePage from 'containers/SourcePage';
import LoginPage from 'containers/LoginPage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'containers/Header';
import Footer from 'components/Footer';

import PrivateRoute from './PrivateRoute';
import LoginRoute from './LoginRoute';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

export default class App extends Component {
  render() {
    return (
      <AppWrapper>
        <Helmet titleTemplate="%s - UP.SOSUB" defaultTitle="UP.SOSUB">
          <meta name="description" content="UP.SOSUB application" />
        </Helmet>
        <Header />
        <Switch>
          <PrivateRoute exact path="/" component={VideosPage} />
          <PrivateRoute path="/videos" component={VideosPage} />
          <PrivateRoute path="/video" component={VideoPage} />
          <PrivateRoute path="/speakers" component={SpeakersPage} />
          <PrivateRoute path="/speaker" component={SpeakerPage} />
          <PrivateRoute path="/sources" component={SourcesPage} />
          <PrivateRoute path="/source" component={SourcePage} />
          <LoginRoute path="/login" component={LoginPage} />
          <Route path="" component={NotFoundPage} />
        </Switch>
        <Footer />
        <GlobalStyle />
      </AppWrapper>
    );
  }
}
