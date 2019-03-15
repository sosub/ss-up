/**
 *
 * LoginPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Input, Button, notification } from 'antd';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import H1 from 'components/H1';

import { signIn } from './actions';
import makeSelectLoginPage, {
  makeSelectProfile,
  makeSelectSignInLoading,
  makeSelectSignInError,
  makeSelectToken,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import styled from 'styled-components';

const Section = styled.section`
  padding: 20px;
  min-height: 600px;
`;

const Form = styled.div`
  padding: 20px;
  width: 500px;
  margin: auto;
`;

/* eslint-disable react/prefer-stateless-function */
export class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  render() {
    const {
      profile,
      loading,
      error,
      token,
    } = this.props;
    const {
      username,
      password
    } = this.state;

    return (
      <Section>
        <Helmet>
          <title>Login</title>
          <meta name="description" content="Description of Login Page" />
        </Helmet>
        <H1>Login</H1>
        <Form>
          <Input
            placeholder="Username"
            value={username}
            onChange={e => this.setState({ username: e.target.value })}
            style={{ marginBottom: 10 }}
            onPressEnter={() => username && password ? this.props.signIn(username, password) : null}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            style={{ marginBottom: 10 }}
            onPressEnter={() => username && password ? this.props.signIn(username, password) : null}
          />
          <Button
            type="primary"
            disabled={!username || !password}
            onClick={() => this.props.signIn(username, password)}
            loading={loading}
            autoFocus
          >
            Log in
          </Button>
          <br/>
          <br/>
          <p style={{ color: "red" }}>{error}</p>
        </Form>
      </Section>
    );
  }
}

LoginPage.propTypes = {
  signIn: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  loading: makeSelectSignInLoading(),
  error: makeSelectSignInError(),
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    signIn: (username, password) => dispatch(signIn(username, password)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LoginPage);
