/**
 *
 * VideoPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash';
import { Input, Row, Col, Button, notification, Select, Icon, Upload, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import subsrt from 'subsrt';

import { getQuery, makeSlug } from 'utils/app';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { BASE_URL } from 'config/app';
import request from 'utils/request';
import H1 from 'components/H1';

import Section from './components/Section';
import Center from './components/Center';
import Card from './components/Card';

import {
  setVideo,
  fetchVideo,
  addVideo,
  updateVideo,
} from './actions';
import makeSelectVideoPage, {
  makeSelectVideo,
  makeSelectOriginVideo,
  makeSelectUpdateVideoLoading,
  makeSelectUpdateVideoError,
  makeSelectAddVideoLoading,
  makeSelectAddVideoError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import { makeSelectToken } from 'containers/LoginPage/selectors';

const { TextArea } = Input;
const Option = Select.Option;

const DEFAULT_NEW_VIDEO = {
  speakerIds: [],
  categoryIds: [],
  subcategoryIds: [],
  tags: [],
  imageFile: [],
  viSubFile: [],
  enSubFile: [],
};

const DEFAULT_ORIGIN_VIDEO = {
  speakerIds: [],
  categoryIds: [],
  subcategoryIds: [],
  tags: [],
  imageFile: [],
  viSubFile: [],
  enSubFile: [],
};

/* eslint-disable react/prefer-stateless-function */
export class VideoPage extends React.Component {
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !getQuery(nextProps.location.search).id &&
      nextState.video.id
    ) {
      return {
        video: DEFAULT_NEW_VIDEO,
        originVideo: DEFAULT_ORIGIN_VIDEO,
      };
    }
    if (
      getQuery(nextProps.location.search).id &&
      nextProps.video &&
      nextProps.video.id
    ) {
      return {
        video: nextProps.video,
        speakers: nextState.speakers.length === 0 ? nextProps.video.speakers : nextState.speakers,
        originVideo: nextProps.originVideo,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      video: DEFAULT_NEW_VIDEO,
      originVideo: DEFAULT_ORIGIN_VIDEO,
      sources: [],
      sponsors: [],
      speakers: [],
      categories: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const query = getQuery(this.props.location.search);
    if (query.id) {
      this.props.fetchVideo(query.id);
    }
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updateVideoLoading && !this.props.updateVideoLoading) {
      if (!this.props.updateVideoError) {
        notification.success({
          message: 'Update Video Success',
        });
      } else {
        notification.error({
          message: this.props.updateVideoError,
        });
      }
    }

    if (prevProps.addVideoLoading && !this.props.addVideoLoading) {
      if (!this.props.addVideoError) {
        notification.success({
          message: 'Create Video Success',
        });
        prevProps.history.push(`/video?id=${this.props.video.id}`);
      } else {
        notification.error({
          message: this.props.addVideoError,
        });
      }
    }
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
                  id
                  name
                }
              }
            }
            sponsors {
              edges {
                node {
                  id
                  name
                }
              }
            }
            categories {
              edges {
                node {
                  id
                  name
                  subcategories {
                    id
                    name
                  }
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
            categories: json.data.categories.edges.map(item => item.node),
          });
        }
      });
  }

  searchSpeakers = async (queryString) => {
    request(`${BASE_URL}/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query ($queryString: String) {
            searchList (query: $queryString) {
              speakers (first: 10) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        `,
        variables: {
          queryString,
        }
      })
    })
      .then(json => {
        console.log('searchSpeakers', json);
        if (json.data) {
          this.setState({
            speakers: json.data.searchList.speakers.edges.map(item => item.node),
          })
        }
      });
  }

  handleSubmit() {
    const { video } = this.state;
    console.log('handleSubmit', video);

    if (video.id) {
      this.props.updateVideo(video);
    } else {
      this.props.addVideo(video);
    }
  }

  handleCancel() {
    this.props.history.push(`/videos`);
  }

  fetchYoutubeDuration(youtubeId) {
    request(`${BASE_URL}/api/youtube_duration?youtube_id=${youtubeId}`)
      .then(json => {
        if (json.duration) {
          this.onFieldChange('duration', json.duration);
        }
      })
  }

  onTitleChange = (e) => {
    const title = e.target.value;
    const video = this.state.video;
    const { speakerNames } = video;
    if (!video.id) {
      this.setState({
        video: {
          ...video,
          title,
          slug: makeSlug(title) + (speakerNames && speakerNames.length > 0 ? `-${makeSlug(speakerNames.join(" "))}` : ""),
        },
      });
    }
    this.props.setVideo({
      ...video,
      title,
      slug: makeSlug(title) + (speakerNames && speakerNames.length > 0 ? `-${makeSlug(speakerNames.join(" "))}` : ""),
    });
  }

  onSpeakersChange = (speakerIds, e) => {
    const video = this.state.video;
    const { title } = video;
    const speakerNames = e.map(item => item.props.children);
    if (!video.id) {
      this.setState({
        video: {
          ...video,
          speakerIds,
          speakerNames,
          slug: (title ? makeSlug(title) : "") + (speakerNames && speakerNames.length > 0 ? `-${makeSlug(speakerNames.join(" "))}` : ""),
        },
      });
    }
    this.props.setVideo({
      ...video,
      speakerIds,
      speakerNames,
      slug: (title ? makeSlug(title) : "") + (speakerNames && speakerNames.length > 0 ? `-${makeSlug(speakerNames.join(" "))}` : ""),
    });
  }

  onYoutubeIdChange = e => {
    const youtubeId = e.target.value;
    this.fetchYoutubeDuration(youtubeId);
    const video = this.state.video;
    if (!video.id) {
      this.setState({
        video: {
          ...video,
          videoId: youtubeId,
        },
      });
    }
    this.props.setVideo({
      ...video,
      videoId: youtubeId,
    });
  }

  onUploadFile = (attr, info) => {
    if (info.file.status === 'done') {
      if (info.file.response.is_success) {
        message.success(`${info.file.name} file uploaded successfully`);
        this.onFieldChange(attr, info.file.response.detail);
        this.onFieldChange(`${attr}File`, [{
          uid: info.file.uid,
          name: info.file.response.detail,
          status: 'done',
          url: info.file.response.detail,
        }]);
        if (attr === 'viSub' || attr === 'enSub') {
          var request = new XMLHttpRequest();
          request.open('GET', info.file.response.detail, true);
          request.onload = () => {
            this.onFieldChange(
              attr === 'viSub' ? 'viTranscript' : 'enTranscript',
              subsrt.parse(request.responseText, { verbose: true }).map(item => item.text).join("\n")
            );
          };
          request.send();
        }
        return;
      } else {
        message.error(info.file.response.detail);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.onFieldChange(`${attr}File`, [{
      uid: info.file.uid,
      name: info.file.name,
      status: info.file.status,
      url: info.file.name,
      percent: info.file.percent,
      size: info.file.size,
    }]);
  }

  onRemoveFile = (attr) => {
    this.onFieldChange(attr, null);
    this.onFieldChange(`${attr}File`, []);
  }

  onFieldChange(attr, value) {
    if (!this.state.video.id) {
      this.setState({
        video: {
          ...this.state.video,
          [attr]: value,
        },
      });
    }
    this.props.setVideo({
      ...this.state.video,
      [attr]: value,
    });
  }

  renderActionButtons() {
    const {
      video,
      originVideo,
    } = this.state;
    const { updateVideoLoading, addVideoLoading } = this.props;

    return (
      <Center>
        {video.id ? (
          <span>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={updateVideoLoading}
              onClick={this.handleSubmit}
              disabled={_.isEqual(originVideo, video)}
            >
              Update Video
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              size="large"
              htmlType="submit"
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </span>
        ) : (
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={addVideoLoading}
            onClick={this.handleSubmit}
          >
            Create Video
          </Button>
        )}
      </Center>
    )
  }

  render() {
    const {
      video,
      originVideo,
      sources,
      sponsors,
      speakers,
      categories,
    } = this.state;

    const { token } = this.props;

    const generals = [
      {
        label: 'Source',
        items: sources,
        fieldName: 'sourceId',
        props: {
          showSearch: true,
          filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        }
      },
      {
        label: 'Sponsor',
        items: sponsors,
        fieldName: 'sponsorId',
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        }
      },
      {
        label: 'Speakers',
        items: speakers,
        fieldName: 'speakerIds',
        onChange: this.onSpeakersChange,
        props: {
          mode: 'multiple',
          filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
          onSearch: this.searchSpeakers
        }
      },
      {
        label: 'Categories',
        items: categories,
        fieldName: 'categoryIds',
        props: {
          mode: 'multiple',
          filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        }
      },
      {
        label: 'Tags',
        items: [],
        fieldName: 'tags',
        props: {
          mode: 'tags',
        }
      },
    ];

    return (
      <div>
        <Helmet>
          <title>{`${video.id ? 'Edit' : 'Add'} Video`}</title>
          <meta name="description" content={video.description} />
        </Helmet>
        <Section>
          <H1>
            {video.id ? `Edit Video - ${video.title}` : 'Add Video'}
          </H1>
          {this.renderActionButtons()}

          <Card label="Thông tin cơ bản">
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">Title</div>
              </Col>
              <Col sm={21}>
                <Input
                  value={video.title}
                  onChange={this.onTitleChange}
                  className={
                    video.title !== originVideo.title
                      ? 'updating-input'
                      : ''
                  }
                />
              </Col>
            </Row>
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">Slug</div>
              </Col>
              <Col sm={21}>
                <Input
                  value={video.slug}
                  onChange={e => this.onFieldChange('slug', e.target.value)}
                  className={
                    video.slug !== originVideo.slug
                      ? 'updating-input'
                      : ''
                  }
                />
              </Col>
            </Row>
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">Description</div>
              </Col>
              <Col sm={21}>
                <Row
                  gutter={16}
                  type="flex"
                >
                  <Col sm={12}>
                    <TextArea
                      value={video.description}
                      style={{ height: '100%' }}
                      onChange={e => this.onFieldChange('description', e.target.value)}
                      className={
                        video.description !== originVideo.description
                          ? 'updating-input'
                          : ''
                      }
                    />
                  </Col>
                  <Col sm={12}>
                    <ReactMarkdown
                      source={video.description} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">Youtube Id</div>
              </Col>
              <Col sm={12}>
                <Input
                  value={video.videoId}
                  onChange={this.onYoutubeIdChange}
                  className={
                    video.videoId !== originVideo.videoId
                      ? 'updating-input'
                      : ''
                  }
                />
              </Col>
              <Col sm={3}>
                <div className="text-right">Duration</div>
              </Col>
              <Col sm={3}>
                <Input
                  value={video.duration}
                  onChange={e => this.onFieldChange('duration', e.target.value)}
                  className={
                    video.duration !== originVideo.duration
                      ? 'updating-input'
                      : ''
                  }
                />
              </Col>
              <Col sm={3}>
                <div className="text-left">giây</div>
              </Col>
            </Row>

            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">Image</div>
              </Col>
              <Col sm={21}>
                <Upload
                  name='upload_file'
                  listType='picture-card'
                  action={`${BASE_URL}/api/upload/`}
                  data={{ path: 'video_images' }}
                  headers={{
                    "Authorization": `Token ${token}`,
                  }}
                  onChange={this.onUploadFile.bind(this, 'image')}
                  onRemove={this.onRemoveFile.bind(this, 'image')}
                  fileList={video.imageFile}
                >
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Card>

          <Card label="Phụ đề">
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">Vietname Subtitle</div>
              </Col>
              <Col sm={21}>
                <Upload
                  name='upload_file'
                  action={`${BASE_URL}/api/upload/`}
                  data={{ path: 'subtitles/vi' }}
                  headers={{
                    "Authorization": `Token ${token}`,
                  }}
                  onChange={this.onUploadFile.bind(this, 'viSub')}
                  onRemove={this.onRemoveFile.bind(this, 'viSub')}
                  fileList={video.viSubFile}
                >
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">Vietnam Transcription</div>
              </Col>
              <Col sm={21}>
                <TextArea
                  rows={10}
                  value={video.viTranscript}
                  onChange={e => this.onFieldChange('viTranscript', e.target.value)}
                  className={
                    video.viTranscript !== originVideo.viTranscript
                      ? 'updating-input'
                      : ''
                  }
                />
              </Col>
            </Row>
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">English Subtitle</div>
              </Col>
              <Col sm={21}>
                <Upload
                  name='upload_file'
                  action={`${BASE_URL}/api/upload/`}
                  data={{ path: 'subtitles/en' }}
                  headers={{
                    "Authorization": `Token ${token}`,
                  }}
                  onChange={this.onUploadFile.bind(this, 'enSub')}
                  onRemove={this.onRemoveFile.bind(this, 'enSub')}
                  fileList={video.enSubFile}
                >
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
            <Row
              gutter={16}
              className="margin-bottom-10"
              type="flex"
              align="middle"
            >
              <Col sm={3}>
                <div className="text-right">English Transcription</div>
              </Col>
              <Col sm={21}>
                <TextArea
                  rows={10}
                  value={video.enTranscript}
                  onChange={e => this.onFieldChange('enTranscript', e.target.value)}
                  className={
                    video.enTranscript !== originVideo.enTranscript
                      ? 'updating-input'
                      : ''
                  }
                />
              </Col>
            </Row>
          </Card>
            
          <Card label="Danh mục">
            {generals.map(general => (
              <Row
                key={general.fieldName}
                className="margin-bottom-10"
                gutter={16}
                type="flex"
                justify="space-around"
                align="middle"
              >
                <Col sm={3}>
                  <div className="text-right">{general.label}</div>
                </Col>
                <Col sm={21}>
                  <Select
                    value={video[general.fieldName]}
                    style={{ width: '100%' }}
                    className={!_.isEqual(video[general.fieldName], originVideo[general.fieldName]) ? 'updating-input' : ''}
                    onChange={general.onChange || (value => this.onFieldChange(general.fieldName, value))}
                    {...(general.props || {})}
                  >
                    {general.items.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                  {general.fieldName === 'categoryIds' ? (
                    video.categoryIds.map(categoryId => {

                      let categoryName;
                      let subcategories = [];
                      categories.forEach(category => {
                        if (category.id === categoryId) {
                          categoryName = category.name;
                          subcategories = category.subcategories;
                        }
                      })

                      return (
                        <Row
                          key={categoryId}
                          style={{ marginTop: 5 }}
                          gutter={16}
                          type="flex"
                          justify="space-around"
                          align="middle"
                        >
                          <Col sm={6}>
                            <div>{categoryName}</div>
                          </Col>
                          <Col sm={18}>
                            <Select
                              value={video.subcategoryIds.filter(s => subcategories.map(i => i.id).indexOf(s) !== -1)}
                              style={{ width: '100%' }}
                              className={!_.isEqual(video.subcategoryIds, originVideo.subcategoryIds) ? 'updating-input' : ''}
                              onChange={value => this.onFieldChange('subcategoryIds', _.union(video.subcategoryIds.filter(s => subcategories.map(i => i.id).indexOf(s) === -1), value))}
                              mode="multiple"
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                              {subcategories.map(s => (
                                <Option key={s.id} value={s.id}>
                                  {s.name}
                                </Option>
                              ))}
                            </Select>
                          </Col>
                        </Row>
                      )
                    })
                    
                  ) : null}
                </Col>
              </Row>
            ))}
          </Card>

          {this.renderActionButtons()}
        </Section>
      </div>
    );
  }
}

VideoPage.propTypes = {
  video: PropTypes.object.isRequired,
  setVideo: PropTypes.func.isRequired,
  fetchVideo: PropTypes.func.isRequired,
  addVideo: PropTypes.func.isRequired,
  updateVideo: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // videoPage: makeSelectVideoPage(),
  video: makeSelectVideo(),
  originVideo: makeSelectOriginVideo(),
  updateVideoLoading: makeSelectUpdateVideoLoading(),
  updateVideoError: makeSelectUpdateVideoError(),
  addVideoLoading: makeSelectAddVideoLoading(),
  addVideoError: makeSelectAddVideoError(),
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    setVideo: video => dispatch(setVideo(video)),
    fetchVideo: videoId => dispatch(fetchVideo(videoId)),
    addVideo: video => dispatch(addVideo(video)),
    updateVideo: video => dispatch(updateVideo(video)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'videoPage', reducer });
const withSaga = injectSaga({ key: 'videoPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(VideoPage);
