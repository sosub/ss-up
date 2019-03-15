import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import request from 'utils/request';

const Option = Select.Option;

class DynamicSelect extends Component {
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
    this.fetchItems();
  }

  async fetchItems() {
    const response = await request(this.props.api);
    if (response && response.data) {
      const items = response.data.map(this.props.mapItems);
      this.setState({
        items: this.state.items.concat(items),
      });
    }
  }

  render() {
    const { items } = this.state;
    const { value, originValue } = this.props;

    return (
      <Select
        {...this.props}
        style={{ minWidth: 300 }}
        className={value !== originValue ? 'updating-input' : ''}
      >
        {items.map(item => (
          <Option key={item.display} value={item.value}>
            {item.display}
          </Option>
        ))}
      </Select>
    );
  }
}

DynamicSelect.propTypes = {
  defaultItem: PropTypes.string,
  api: PropTypes.string.isRequired,
  mapItems: PropTypes.func.isRequired,
};

export default DynamicSelect;
