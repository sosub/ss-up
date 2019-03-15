/**
 *
 * SourcesPage
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
import SourceList from './components/SourceList';
import Paging from './components/Paging';

import { fetchSources, removeSource } from './actions';
import makeSelectSourcesPage, {
  makeSelectSources,
  makeSelectFetchSourceLoading,
  makeSelectFetchSourceError,
  makeSelectRemoveSourceLoading,
  makeSelectRemoveSourceError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const confirm = Modal.confirm;

const PAGE_SIZE = 10;

/* eslint-disable react/prefer-stateless-function */
export class SourcesPage extends React.Component {
  constructor(props) {
    super(props);

    const query = getQuery(this.props.location.search);

    this.state = {
      orderBy: query.order_by || '-id',
      limit: query.limit || PAGE_SIZE,
      searchFilter: query.search || '',
    };

    this.onRefresh = this.onRefresh.bind(this);
    this.fetchSources = this.fetchSources.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
    this.onDeleteSource = this.onDeleteSource.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
  }

  componentDidMount() {
    this.fetchSources();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.location.key !== this.props.location.key &&
      this.props.location.pathname === '/sources' &&
      this.props.location.search === ''
    ) {
      this.setState(
        {
          orderBy: '-id',
          limit: PAGE_SIZE,
          searchFilter: '',
        },
        this.fetchSources,
      );
    }

    if (prevProps.removeSourceLoading && !this.props.removeSourceLoading) {
      if (!this.props.removeSourceError) {
        notification.success({
          message: 'Remove Source Success',
        });
        this.fetchSources();
      } else {
        notification.error({
          message: this.props.removeSourceError,
        });
      }
    }
  }

  onRefresh() {
    this.fetchSources();
  }

  fetchSources(before, after) {
    const {
      orderBy,
      limit,
      creatorFilter,
      sponsorFilter,
      sourceFilter,
      searchFilter,
    } = this.state;

    this.updateQueryString();

    this.props.fetchSources({
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
      () => this.fetchSources(),
    );
  }

  onNextPage() {
    this.fetchSources(null, this.props.sources.length > 0 ? this.props.sources.slice(-1)[0].cursor : null);
  }

  onPrevPage() {
    this.fetchSources(this.props.sources.length > 0 ? this.props.sources.slice(0)[0].cursor : null);
  }

  onLimitChange(value) {
    this.setState(
      {
        limit: value,
      },
      () => this.fetchSources(),
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
      () => this.fetchSources(),
    );
  }

  onDeleteSource(source) {
    confirm({
      title: `Are you sure Delete source "${source.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.props.removeSource(source.id);
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
      sources,
      fetchSourceLoading,
      removeSourceLoading,
    } = this.props;
    const {
      limit,
      searchFilter,
    } = this.state;

    const loading =
      fetchSourceLoading || removeSourceLoading;

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
          <title>Sources</title>
          <meta name="description" content="Description of Sources Page" />
        </Helmet>
        <H1>Sources</H1>
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
        <SourceList
          loading={loading}
          onDelete={source => this.onDeleteSource(source)}
          rowSelection={rowSelection}
          dataSource={sources}
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

SourcesPage.propTypes = {
  fetchSources: PropTypes.func.isRequired,
  removeSource: PropTypes.func.isRequired,
  sources: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // sourcesPage: makeSelectSourcesPage(),
  sources: makeSelectSources(),
  fetchSourceLoading: makeSelectFetchSourceLoading(),
  fetchSourceError: makeSelectFetchSourceError(),
  removeSourceLoading: makeSelectRemoveSourceLoading(),
  removeSourceError: makeSelectRemoveSourceError(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchSources: filters => dispatch(fetchSources(filters)),
    removeSource: sourceId => dispatch(removeSource(sourceId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sourcesPage', reducer });
const withSaga = injectSaga({ key: 'sourcesPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SourcesPage);
