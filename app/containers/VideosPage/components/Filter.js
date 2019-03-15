import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select } from 'antd';

const Option = Select.Option;

const Wrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #e2e2e2;
  display: inline-block;
  vertical-align: baseline;
  margin-right: 10px;
  padding: 7px;
  background-color: #EEEEEE;
  margin-bottom: 15px;
`;

const Label = styled.p`
  font-size: 12px;
  margin-bottom: 3px;
`;

class Filter extends Component {

  static getDerivedStateFromProps(nextProps, nextState) {
    let items = nextProps.mapItems ? nextProps.items.map(nextProps.mapItems) : nextProps.items;

    if (nextProps.defaultItem) {
      items = [ { display: nextProps.defaultItem, value: '' } ].concat(items);
    }

    return {
      items,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      items: []
    }
  }

  render() {
    const { label, width, disabled } = this.props;
    const { items } = this.state;

    return (
      <Wrapper>
        <Label>{label}</Label>
        <Select
          disabled={disabled}
          size="small"
          style={width ? { width } : null}
          {...this.props}>
          {items.map(item =>
            <Option key={item.display} value={item.value}>{item.display}</Option>
          )}
        </Select>
      </Wrapper>
    );
  }
}


Filter.propTypes = {
  label: PropTypes.string,
  defaultItem: PropTypes.string,
  items: PropTypes.array.isRequired,
  width: PropTypes.number,
};

export default Filter;
