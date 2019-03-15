import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Avatar } from 'antd';
import styled from 'styled-components';

const Name = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  min-width: 350px;
  align-items: center;
  > span {
    flex: 1;
  }
  > b {
    width: 120px;
    margin-left: 10px;
  }
`;

class SourceList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        defaultSortOrder: 'descend',
        sorter: (a, b) => false,
      },
      {
        title: 'Image',
        dataIndex: 'image',
        render: (image, source) => (
          <div style={{ textAlign: 'center', padding: 10 }}>
            <Avatar size={50} src={image} />
          </div>
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => false,
        render: (text, source) => (
          <Name>
            <Link
              to={{
                pathname: '/source',
                search: `?id=${source.id}`,
                state: {
                  source,
                },
              }}
            >
              {text}
            </Link>
          </Name>
        ),
      },
      {
        title: 'Slug',
        dataIndex: 'slug',
      },
      {
        title: 'Videos',
        dataIndex: 'videoAmount',
        sorter: (a, b) => false,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: (description, source) => (
          <span>{description ? `${description.slice(0, 80)}...` : null}</span>
        ),
      },
    ];
  }

  render() {
    const {
      loading,
      rowSelection,
      dataSource,
      onChange,
    } = this.props;

    return (
      <Table
        id="list-table"
        loading={loading}
        rowKey="id"
        rowSelection={rowSelection}
        columns={this.columns}
        dataSource={dataSource}
        onChange={onChange}
        pagination={false}
      />
    );
  }
}

SourceList.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
  rowSelection: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SourceList;
