/**
 *
 * VideosPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Modal, notification } from 'antd';

import { getQuery } from 'utils/app';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import H1 from 'components/H1';

import Section from './components/Section';
import FilterList from './components/FilterList';
import VideoList from './components/VideoList';
import Paging from './components/Paging';

import { fetchVideos, publishVideo } from './actions';
import makeSelectVideosPage, {
  makeSelectVideos,
  makeSelectFetchVideoLoading,
  makeSelectFetchVideoError,
  makeSelectPublishVideoLoading,
  makeSelectPublishVideoError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import { makeSelectProfile } from 'containers/LoginPage/selectors';

const confirm = Modal.confirm;

const PAGE_SIZE = 10;

/* eslint-disable react/prefer-stateless-function */
export class VideosPage extends React.Component {
  constructor(props) {
    super(props);

    const query = getQuery(this.props.location.search);

    this.state = {
      orderBy: query.order_by || '-id',
      limit: query.limit || PAGE_SIZE,
      creatorFilter: query.creator || (props.profile.role === 'Poster' ? props.profile.username : ''),
      sponsorFilter: query.sponsor || '',
      sourceFilter: query.source || '',
      searchFilter: query.search || '',
      isPublishedFilter: query.published || '',
    };

    this.onRefresh = this.onRefresh.bind(this);
    this.fetchVideos = this.fetchVideos.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
    this.onPublishVideo = this.onPublishVideo.bind(this);
    this.onCreatorFilterChange = this.onCreatorFilterChange.bind(this);
    this.onSponsorFilterChange = this.onSponsorFilterChange.bind(this);
    this.onSourceFilterChange = this.onSourceFilterChange.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.onIsPublishedFilterChange = this.onIsPublishedFilterChange.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
  }

  componentDidMount() {
    this.fetchVideos();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.location.key !== this.props.location.key &&
      this.props.location.pathname === '/videos' &&
      this.props.location.search === ''
    ) {
      this.setState(
        {
          orderBy: '-id',
          limit: PAGE_SIZE,
          creatorFilter: this.props.profile.role === 'Poster' ? this.props.profile.username : '',
          sponsorFilter: '',
          sourceFilter: '',
          searchFilter: '',
          isPublishedFilter: '',
        },
        this.fetchVideos,
      );
    }

    if (prevProps.publishVideoLoading && !this.props.publishVideoLoading) {
      if (!this.props.publishVideoError) {
        notification.success({
          message: 'Publish Video Success',
        });
        this.fetchVideos();
      } else {
        notification.error({
          message: this.props.publishVideoError,
        });
      }
    }
  }

  onRefresh() {
    this.fetchVideos();
  }

  fetchVideos(before, after) {
    const {
      orderBy,
      limit,
      creatorFilter,
      sponsorFilter,
      sourceFilter,
      searchFilter,
      isPublishedFilter,
    } = this.state;

    this.updateQueryString();

    this.props.fetchVideos({
      orderBy,
      limit,
      before,
      after,
      creator: creatorFilter,
      sponsor: sponsorFilter,
      source: sourceFilter,
      search: searchFilter,
      published: isPublishedFilter,
    });
  }

  updateQueryString() {
    const {
      orderBy,
      limit,
      creatorFilter,
      sponsorFilter,
      sourceFilter,
      searchFilter,
      isPublishedFilter,
    } = this.state;

    let query = `?limit=${limit}`;

    if (orderBy) {
      query += `&order_by=${orderBy}`;
    }
    if (creatorFilter) {
      query += `&creator=${creatorFilter}`;
    }
    if (sponsorFilter) {
      query += `&sponsor=${sponsorFilter}`;
    }
    if (sourceFilter) {
      query += `&source=${sourceFilter}`;
    }
    if (searchFilter) {
      query += `&search=${searchFilter}`;
    }
    if (isPublishedFilter) {
      query += `&published=${isPublishedFilter}`;
    }

    this.props.history.push({
      pathname: window.location.pathname,
      search: query,
    });
  }

  onCreatorFilterChange(value) {
    this.setState(
      {
        creatorFilter: value,
      },
      () => this.fetchVideos(),
    );
  }

  onSponsorFilterChange(value) {
    this.setState(
      {
        sponsorFilter: value,
      },
      () => this.fetchVideos(),
    );
  }

  onSourceFilterChange(value) {
    this.setState(
      {
        sourceFilter: value,
      },
      () => this.fetchVideos(),
    );
  }

  onSearchFilterChange(value) {
    this.setState(
      {
        searchFilter: value,
      },
      () => this.fetchVideos(),
    );
  }

  onIsPublishedFilterChange(value) {
    this.setState(
      {
        isPublishedFilter: value,
      },
      () => this.fetchVideos(),
    );
  }

  onNextPage() {
    this.fetchVideos(null, this.props.videos.length > 0 ? this.props.videos.slice(-1)[0].cursor : null);
  }

  onPrevPage() {
    this.fetchVideos(this.props.videos.length > 0 ? this.props.videos.slice(0)[0].cursor : null);
  }

  onLimitChange(value) {
    this.setState(
      {
        limit: value,
      },
      () => this.fetchVideos(),
    );
  }

  onTableChange(pagination, filters, sorter) {
    console.log(sorter);
    this.setState(
      {
        orderBy: sorter.field
          ? `${sorter.order === 'descend' ? '-' : ''}${sorter.field.split(/(?=[A-Z])/).join('_').toLowerCase()}`
          : '',
      },
      () => this.fetchVideos(),
    );
  }

  onPublishVideo(video) {
    confirm({
      title: `Are you sure Publish video "${video.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.props.publishVideo(video.id);
      },
      onCancel() {
        console.log('Cancel');
      },
      cancelButtonProps: {
        type: 'primary',
      },
      okButtonProps: {
        type: 'danger',
      },
      maskClosable: true,
      autoFocusButton: 'cancel',
    });
  }

  render() {
    const {
      videos,
      fetchVideoLoading,
      publishVideoLoading,
      profile,
    } = this.props;
    const {
      limit,
      creatorFilter,
      sponsorFilter,
      sourceFilter,
      searchFilter,
      isPublishedFilter,
    } = this.state;

    const loading =
      fetchVideoLoading || publishVideoLoading;

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows,
        );
      },
    };

    return (
      <Section>
        <Helmet>
          <title>Videos</title>
          <meta name="description" content="Description of Videos Page" />
        </Helmet>
        <H1>Videos</H1>
        <FilterList
          searchFilter={searchFilter}
          onSearchFilterChange={this.onSearchFilterChange}
          creatorFilter={creatorFilter}
          onCreatorFilterChange={this.onCreatorFilterChange}
          sponsorFilter={sponsorFilter}
          onSponsorFilterChange={this.onSponsorFilterChange}
          sourceFilter={sourceFilter}
          onSourceFilterChange={this.onSourceFilterChange}
          isPublishedFilter={isPublishedFilter}
          onIsPublishedFilterChange={this.onIsPublishedFilterChange}
          onRefresh={this.onRefresh}
          loading={loading}
          profile={profile}
        />
        <Paging
          limit={parseInt(limit, 10)}
          onLimitChange={this.onLimitChange}
          onNext={this.onNextPage}
          onPrev={this.onPrevPage}
        />
        <VideoList
          loading={loading}
          onPublish={this.onPublishVideo}
          rowSelection={rowSelection}
          dataSource={videos}
          onChange={this.onTableChange}
          showPublishButton={profile.role !== "Poster"}
        />
        <Paging
          limit={parseInt(limit, 10)}
          onLimitChange={this.onLimitChange}
          onNext={this.onNextPage}
          onPrev={this.onPrevPage}
        />
      </Section>
    );
  }
}

VideosPage.propTypes = {
  fetchVideos: PropTypes.func.isRequired,
  publishVideo: PropTypes.func.isRequired,
  videos: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // videosPage: makeSelectVideosPage(),
  videos: makeSelectVideos(),
  fetchVideoLoading: makeSelectFetchVideoLoading(),
  fetchVideoError: makeSelectFetchVideoError(),
  publishVideoLoading: makeSelectPublishVideoLoading(),
  publishVideoError: makeSelectPublishVideoError(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchVideos: filters => dispatch(fetchVideos(filters)),
    publishVideo: videoId => dispatch(publishVideo(videoId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'videosPage', reducer });
const withSaga = injectSaga({ key: 'videosPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(VideosPage);
