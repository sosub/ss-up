/**
 *
 * SpeakersPage
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
import SpeakerList from './components/SpeakerList';
import Paging from './components/Paging';

import { fetchSpeakers, removeSpeaker } from './actions';
import makeSelectSpeakersPage, {
  makeSelectSpeakers,
  makeSelectFetchSpeakerLoading,
  makeSelectFetchSpeakerError,
  makeSelectRemoveSpeakerLoading,
  makeSelectRemoveSpeakerError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const confirm = Modal.confirm;

const PAGE_SIZE = 10;

/* eslint-disable react/prefer-stateless-function */
export class SpeakersPage extends React.Component {
  constructor(props) {
    super(props);

    const query = getQuery(this.props.location.search);

    this.state = {
      orderBy: query.order_by || '-id',
      limit: query.limit || PAGE_SIZE,
      searchFilter: query.search || '',
    };

    this.onRefresh = this.onRefresh.bind(this);
    this.fetchSpeakers = this.fetchSpeakers.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
    this.onDeleteSpeaker = this.onDeleteSpeaker.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
  }

  componentDidMount() {
    this.fetchSpeakers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.location.key !== this.props.location.key &&
      this.props.location.pathname === '/speakers' &&
      this.props.location.search === ''
    ) {
      this.setState(
        {
          orderBy: '-id',
          limit: PAGE_SIZE,
          searchFilter: '',
        },
        this.fetchSpeakers,
      );
    }

    if (prevProps.removeSpeakerLoading && !this.props.removeSpeakerLoading) {
      if (!this.props.removeSpeakerError) {
        notification.success({
          message: 'Remove Speaker Success',
        });
        this.fetchSpeakers();
      } else {
        notification.error({
          message: this.props.removeSpeakerError,
        });
      }
    }
  }

  onRefresh() {
    this.fetchSpeakers();
  }

  fetchSpeakers(before, after) {
    const {
      orderBy,
      limit,
      creatorFilter,
      sponsorFilter,
      sourceFilter,
      searchFilter,
    } = this.state;

    this.updateQueryString();

    this.props.fetchSpeakers({
      orderBy,
      limit,
      before,
      after,
      creator: creatorFilter,
      sponsor: sponsorFilter,
      source: sourceFilter,
      search: searchFilter,
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
    } = this.state;

    let query = `?limit=${limit}`;

    if (orderBy) {
      query += `&order_by=${orderBy}`;
    }
    if (searchFilter) {
      query += `&search=${searchFilter}`;
    }

    this.props.history.push({
      pathname: window.location.pathname,
      search: query,
    });
  }

  onSearchFilterChange(value) {
    this.setState(
      {
        searchFilter: value,
      },
      () => this.fetchSpeakers(),
    );
  }

  onNextPage() {
    this.fetchSpeakers(null, this.props.speakers.length > 0 ? this.props.speakers.slice(-1)[0].cursor : null);
  }

  onPrevPage() {
    this.fetchSpeakers(this.props.speakers.length > 0 ? this.props.speakers.slice(0)[0].cursor : null);
  }

  onLimitChange(value) {
    this.setState(
      {
        limit: value,
      },
      () => this.fetchSpeakers(),
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
      () => this.fetchSpeakers(),
    );
  }

  onDeleteSpeaker(speaker) {
    confirm({
      title: `Are you sure Delete speaker "${speaker.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.props.removeSpeaker(speaker.id);
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
      speakers,
      fetchSpeakerLoading,
      removeSpeakerLoading,
    } = this.props;
    const {
      limit,
      searchFilter,
    } = this.state;

    const loading =
      fetchSpeakerLoading || removeSpeakerLoading;

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
          <title>Speakers</title>
          <meta name="description" content="Description of Speakers Page" />
        </Helmet>
        <H1>Speakers</H1>
        <FilterList
          searchFilter={searchFilter}
          onSearchFilterChange={this.onSearchFilterChange}
          onRefresh={this.onRefresh}
          loading={loading}
        />
        <Paging
          limit={parseInt(limit, 10)}
          onLimitChange={this.onLimitChange}
          onNext={this.onNextPage}
          onPrev={this.onPrevPage}
        />
        <SpeakerList
          loading={loading}
          onDelete={speaker => this.onDeleteSpeaker(speaker)}
          rowSelection={rowSelection}
          dataSource={speakers}
          onChange={this.onTableChange}
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

SpeakersPage.propTypes = {
  fetchSpeakers: PropTypes.func.isRequired,
  removeSpeaker: PropTypes.func.isRequired,
  speakers: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // speakersPage: makeSelectSpeakersPage(),
  speakers: makeSelectSpeakers(),
  fetchSpeakerLoading: makeSelectFetchSpeakerLoading(),
  fetchSpeakerError: makeSelectFetchSpeakerError(),
  removeSpeakerLoading: makeSelectRemoveSpeakerLoading(),
  removeSpeakerError: makeSelectRemoveSpeakerError(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchSpeakers: filters => dispatch(fetchSpeakers(filters)),
    removeSpeaker: speakerId => dispatch(removeSpeaker(speakerId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'speakersPage', reducer });
const withSaga = injectSaga({ key: 'speakersPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SpeakersPage);
