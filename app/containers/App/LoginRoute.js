import React, { Component } from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectToken } from '../LoginPage/selectors';

class LoginRoute extends Component {
  render() {
    const { component: Comp, token, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          !token ? (
            <Comp {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(LoginRoute);
