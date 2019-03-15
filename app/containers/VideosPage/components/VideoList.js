import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Icon, Button } from 'antd';
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

class VideoList extends React.Component {
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
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => false,
        render: (text, video) => (
          <Name>
            <Link
              to={{
                pathname: '/video',
                search: `?id=${video.id}`,
                state: {
                  video,
                },
              }}
            >
              {text}
            </Link>
          </Name>
        ),
      },
      {
        title: 'Views',
        dataIndex: 'viewAmount',
        sorter: (a, b) => false,
      },
      
      {
        title: 'Youtube',
        dataIndex: 'videoId',
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        sorter: (a, b) => false,
      },
      {
        title: 'Creator',
        dataIndex: 'createdBy.username',
      },
      {
        title: 'Sponsor',
        dataIndex: 'sponsor.name',
      },
      {
        title: 'Source',
        dataIndex: 'source.name',
      },
      {
        title: 'Speakers',
        dataIndex: 'speakers',
        render: (speakers, video) => (
          <span>{speakers.map(speaker => speaker.name).join(", ")}</span>
        ),
      },
      {
        title: 'Categories',
        dataIndex: 'categories',
        render: (categories, video) => (
          <span>{categories.map(category => category.name).join(", ")}</span>
        ),
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        render: (tags, video) => (
          <span>{tags.map(tag => tag.slug).join(", ")}</span>
        ),
      },
      {
        title: 'Published',
        dataIndex: 'isPublished',
        render: (isPublished, video) => {
          return (
            <div>
              {isPublished ? (
                <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
              ) : (
                <div>
                  <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" /> &nbsp;
                  {props.showPublishButton ? (
                    <Button type="primary" size="small" onClick={() => props.onPublish(video)} loading={props.loading}>
                      Publish
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          )
        },
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

VideoList.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
  rowSelection: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default VideoList;
