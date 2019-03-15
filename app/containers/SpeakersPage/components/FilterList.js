import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Input } from 'antd';
import { BASE_URL } from 'config/app';
import request from 'utils/request'

import Filter from './Filter';

const Search = Input.Search;

const Wrapper = styled.div`
  margin-bottom: 30px;
`;

class FilterList extends Component {

  state = {
    search: '',
  }

  render() {
    const {
      searchFilter,
      onSearchFilterChange,
      onRefresh,
      loading,
    } = this.props;

    const { search } = this.state;

    return (
      <Wrapper>
        <Search
          placeholder="Input search text"
          onSearch={onSearchFilterChange}
          defaultValue={searchFilter}
          style={{
            width: 500,
            marginBottom: 20,
          }}
        />
        <br />
        <Button type="primary" onClick={onRefresh} loading={loading}>
          Refresh Data
        </Button>
      </Wrapper>
    );
  }
}

FilterList.propTypes = {
  searchFilter: PropTypes.string.isRequired,
  onSearchFilterChange: PropTypes.func.isRequired,

  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FilterList;
