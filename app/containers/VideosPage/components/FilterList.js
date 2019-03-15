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
    creators: [],
    sponsors: [],
    sources: [],
  }

  componentDidMount() {
    this.fetchData();
  }
  
  fetchData() {
    request(`${BASE_URL}/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            sources {
              edges {
                node {
                  slug
                  name
                }
              }
            }
            sponsors {
              edges {
                node {
                  slug
                  name
                }
              }
            }
            creators {
              edges {
                node {
                  slug
                  name
                }
              }
            }
          }
        `,
      })
    })
      .then(json => {
        console.log('fetchData', json);
        if (json.data) {
          this.setState({
            sources: json.data.sources.edges.map(item => item.node),
            sponsors: json.data.sponsors.edges.map(item => item.node),
            creators: json.data.creators.edges.map(item => item.node),
          });
        }
      });
  }

  render() {
    const {
      creatorFilter,
      onCreatorFilterChange,
      sponsorFilter,
      onSponsorFilterChange,
      sourceFilter,
      onSourceFilterChange,
      searchFilter,
      onSearchFilterChange,
      isPublishedFilter,
      onIsPublishedFilterChange,
      onRefresh,
      loading,
      profile,
    } = this.props;

    const { sponsors, sources, creators, search } = this.state;

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
        <br/>
        <Filter
          label="Creator:"
          value={creatorFilter}
          defaultItem="All Creators"
          items={creators}
          onChange={onCreatorFilterChange}
          mapItems={item => ({ display: item.name, value: item.slug })}
          width={250}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          disabled={profile.role === 'Poster'}
        />
        <Filter
          label="Sponsor:"
          value={sponsorFilter}
          defaultItem="All Sponsors"
          onChange={onSponsorFilterChange}
          items={sponsors}
          mapItems={item => ({ display: item.name, value: item.slug })}
          width={250}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
        <Filter
          label="Source:"
          value={sourceFilter}
          defaultItem="All Sources"
          onChange={onSourceFilterChange}
          items={sources}
          mapItems={item => ({ display: item.name, value: item.slug })}
          width={250}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
        <Filter
          label="Published:"
          value={isPublishedFilter}
          defaultItem="All Videos"
          onChange={onIsPublishedFilterChange}
          items={[
            {
              display: "Yes",
              value: "1"
            },
            {
              display: "No",
              value: "0"
            },
          ]}
          width={250}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
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
  creatorFilter: PropTypes.string.isRequired,
  onCreatorFilterChange: PropTypes.func.isRequired,

  sponsorFilter: PropTypes.string.isRequired,
  onSponsorFilterChange: PropTypes.func.isRequired,

  sourceFilter: PropTypes.string.isRequired,
  onSourceFilterChange: PropTypes.func.isRequired,

  searchFilter: PropTypes.string.isRequired,
  onSearchFilterChange: PropTypes.func.isRequired,

  isPublishedFilter: PropTypes.string.isRequired,
  onIsPublishedFilterChange: PropTypes.func.isRequired,

  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FilterList;
