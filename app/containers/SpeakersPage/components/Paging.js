import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Select } from 'antd';

const Option = Select.Option;

const Wrapper = styled.div`
  text-align: right;
  margin: 10px 0;
`;

class Paging extends Component {

  render() {
    const { onNext, onPrev, limit, onLimitChange } = this.props;

    return (
      <Wrapper>
        <Button onClick={onPrev}>Prev</Button>
        <Select value={limit} onChange={onLimitChange} style={{ marginLeft: 10, marginRight: 10 }}>
          <Option value={100}>100</Option>
          <Option value={50}>50</Option>
          <Option value={20}>20</Option>
          <Option value={10}>10</Option>
        </Select>
        <Button onClick={onNext}>Next</Button>
      </Wrapper>
    );
  }
}

Paging.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
};

export default Paging;
