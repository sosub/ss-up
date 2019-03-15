import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select } from 'antd';
import request from 'utils/request';

const Option = Select.Option;

const Wrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #e2e2e2;
  display: inline-block;
  vertical-align: baseline;
  margin-right: 10px;
  padding: 7px;
  background-color: #eeeeee;
  margin-bottom: 15px;
`;

const Label = styled.p`
  font-size: 12px;
  margin-bottom: 3px;
`;

class FilterFromAPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.defaultItem
        ? [
          {
            display: props.defaultItem,
            value: '',
          },
        ]
        : [],
    };
  }

  componentDidMount() {
    this.fetchFilter();
  }

  async fetchFilter() {
    const response = await request(this.props.api);
    if (response && response.data) {
      const items = response.data.map(this.props.mapItems);
      this.setState({
        items: this.state.items.concat(items),
      });
    }
  }

  render() {
    const { label, width } = this.props;
    const { items } = this.state;

    return (
      <Wrapper>
        <Label>{label}</Label>
        <Select size="small" style={width ? { width } : null} {...this.props}>
          {items.map(item => (
            <Option key={item.display} value={item.value}>
              {item.display}
            </Option>
          ))}
        </Select>
      </Wrapper>
    );
  }
}

FilterFromAPI.propTypes = {
  label: PropTypes.string,
  defaultItem: PropTypes.string,
  api: PropTypes.string.isRequired,
  mapItems: PropTypes.func.isRequired,
  width: PropTypes.number,
};

export default FilterFromAPI;
