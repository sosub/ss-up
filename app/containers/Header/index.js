import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { Menu } from 'antd';
import { Link } from 'react-router-dom';

import Banner from './Banner';
import A from './A';
import Img from './Img';
import logo from './logo.png';

import { makeSelectToken, makeSelectProfile } from '../LoginPage/selectors';
import { signOut } from '../LoginPage/actions';
import withRouter from 'react-router-dom/withRouter';

const PATH_TO_KEY = {
  '/': 'videos',
  '/videos': 'videos',
  '/video': 'video',
  '/speakers': 'speakers',
  '/speaker': 'speaker',
  '/sources': 'sources',
  '/source': 'source',
  '/login': 'login',
};

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
  render() {
    const { token, profile, signOut } = this.props;
    return (
      <div>
        <Banner>
          <A href="/">
            <Img src={logo} alt="SOSUB logo" />
          </A>
        </Banner>
        <Menu
          selectedKeys={[PATH_TO_KEY[this.props.location.pathname]]}
          mode="horizontal"
        >
          <Menu.Item key="videos">
            <Link to="/videos">Videos</Link>
          </Menu.Item>
          <Menu.Item key="video">
            <Link to="/video">Add video</Link>
          </Menu.Item>
          <Menu.Item key="speakers">
            <Link to="/speakers">Speakers</Link>
          </Menu.Item>
          <Menu.Item key="speaker">
            <Link to="/speaker">Speaker</Link>
          </Menu.Item>
          <Menu.Item key="sources">
            <Link to="/sources">Sources</Link>
          </Menu.Item>
          <Menu.Item key="source">
            <Link to="/source">Source</Link>
          </Menu.Item>
          {!token ? (
            <Menu.Item key="login" style={{ float: 'right' }}>
              <Link to="/login">Đăng nhập</Link>
            </Menu.Item>
          ) : (
            [
            <Menu.Item key="1" style={{ float: 'right' }}>
              <span onClick={signOut}>Đăng xuất</span>
            </Menu.Item>,
            <Menu.Item key="2" style={{ float: 'right' }} disabled>
              <span>Xin chào, {profile.name || profile.username} ({profile.role})</span>
            </Menu.Item>
            ]
          )}
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: makeSelectToken(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    signOut: () => dispatch(signOut())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(Header);
