/**
 *
 * SpeakerPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash';
import { Input, Row, Col, Button, notification, Icon, Upload, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import subsrt from 'subsrt';

import { getQuery, makeSlug } from 'utils/app';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { BASE_URL } from 'config/app';
import H1 from 'components/H1';

import Section from './components/Section';
import Center from './components/Center';
import Card from './components/Card';

import {
  setSpeaker,
  fetchSpeaker,
  addSpeaker,
  updateSpeaker,
} from './actions';
import makeSelectSpeakerPage, {
  makeSelectSpeaker,
  makeSelectOriginSpeaker,
  makeSelectUpdateSpeakerLoading,
  makeSelectUpdateSpeakerError,
  makeSelectAddSpeakerLoading,
  makeSelectAddSpeakerError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import { makeSelectToken } from 'containers/LoginPage/selectors';

const { TextArea } = Input;

const DEFAULT_NEW_SPEAKER = {
  imageFile: [],
};

const DEFAULT_ORIGIN_SPEAKER = {
  imageFile: [],
};

/* eslint-disable react/prefer-stateless-function */
export class SpeakerPage extends React.Component {
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !getQuery(nextProps.location.search).id &&
      nextState.speaker.id
    ) {
      return {
        speaker: DEFAULT_NEW_SPEAKER,
        originSpeaker: DEFAULT_ORIGIN_SPEAKER,
      };
    }
    if (
      getQuery(nextProps.location.search).id &&
      nextProps.speaker &&
      nextProps.speaker.id
    ) {
      return {
        speaker: nextProps.speaker,
        originSpeaker: nextProps.originSpeaker,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      speaker: DEFAULT_NEW_SPEAKER,
      originSpeaker: DEFAULT_ORIGIN_SPEAKER,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const query = getQuery(this.props.location.search);
    if (query.id) {
      this.props.fetchSpeaker(query.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updateSpeakerLoading && !this.props.updateSpeakerLoading) {
      if (!this.props.updateSpeakerError) {
        notification.success({
          message: 'Update Speaker Success',
        });
      } else {
        notification.error({
          message: this.props.updateSpeakerError,
        });
      }
    }

    if (prevProps.addSpeakerLoading && !this.props.addSpeakerLoading) {
      if (!this.props.addSpeakerError) {
        notification.success({
          message: 'Create Speaker Success',
        });
        prevProps.history.push(`/speaker?id=${this.props.speaker.id}`);
      } else {
        notification.error({
          message: this.props.addSpeakerError,
        });
      }
    }
  }

  handleSubmit() {
    const { speaker } = this.state;
    console.log('handleSubmit', speaker);

    if (speaker.id) {
      this.props.updateSpeaker(speaker);
    } else {
      this.props.addSpeaker(speaker);
    }
  }

  handleCancel() {
    this.props.history.push(`/speakers`);
  }

  onNameChange = (e) => {
    const name = e.target.value;
    const speaker = this.state.speaker;
    const { speakerNames } = speaker;
    if (!speaker.id) {
      this.setState({
        speaker: {
          ...speaker,
          name,
          slug: makeSlug(name),
        },
      });
    }
    this.props.setSpeaker({
      ...speaker,
      name,
      slug: makeSlug(name),
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
    if (!this.state.speaker.id) {
      this.setState({
        speaker: {
          ...this.state.speaker,
          [attr]: value,
        },
      });
    }
    this.props.setSpeaker({
      ...this.state.speaker,
      [attr]: value,
    });
  }

  renderActionButtons() {
    const {
      speaker,
      originSpeaker,
    } = this.state;
    const { updateSpeakerLoading, addSpeakerLoading } = this.props;

    return (
      <Center>
        {speaker.id ? (
          <span>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={updateSpeakerLoading}
              onClick={this.handleSubmit}
              disabled={_.isEqual(originSpeaker, speaker)}
            >
              Update Speaker
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
            loading={addSpeakerLoading}
            onClick={this.handleSubmit}
          >
            Create Speaker
          </Button>
        )}
      </Center>
    )
  }

  render() {
    const {
      speaker,
      originSpeaker,
    } = this.state;

    const { token } = this.props;

    return (
      <div>
        <Helmet>
          <title>{`${speaker.id ? 'Edit' : 'Add'} Speaker`}</title>
          <meta name="description" content={speaker.description} />
        </Helmet>
        <Section>
          <H1>
            {speaker.id ? `Edit Speaker - ${speaker.name}` : 'Add Speaker'}
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
                <div className="text-right">Name</div>
              </Col>
              <Col sm={21}>
                <Input
                  value={speaker.name}
                  onChange={this.onNameChange}
                  className={
                    speaker.name !== originSpeaker.name
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
                  value={speaker.slug}
                  onChange={e => this.onFieldChange('slug', e.target.value)}
                  className={
                    speaker.slug !== originSpeaker.slug
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
                      value={speaker.description}
                      style={{ height: '100%' }}
                      onChange={e => this.onFieldChange('description', e.target.value)}
                      className={
                        speaker.description !== originSpeaker.description
                          ? 'updating-input'
                          : ''
                      }
                    />
                  </Col>
                  <Col sm={12}>
                    <ReactMarkdown
                      source={speaker.description} />
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
                <div className="text-right">Image</div>
              </Col>
              <Col sm={21}>
                <Upload
                  name='upload_file'
                  listType='picture-card'
                  action={`${BASE_URL}/api/upload/`}
                  data={{ path: 'speaker_images' }}
                  headers={{
                    "Authorization": `Token ${token}`,
                  }}
                  onChange={this.onUploadFile.bind(this, 'image')}
                  onRemove={this.onRemoveFile.bind(this, 'image')}
                  fileList={speaker.imageFile}
                >
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Card>

          {this.renderActionButtons()}
        </Section>
      </div>
    );
  }
}

SpeakerPage.propTypes = {
  speaker: PropTypes.object.isRequired,
  setSpeaker: PropTypes.func.isRequired,
  fetchSpeaker: PropTypes.func.isRequired,
  addSpeaker: PropTypes.func.isRequired,
  updateSpeaker: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // speakerPage: makeSelectSpeakerPage(),
  speaker: makeSelectSpeaker(),
  originSpeaker: makeSelectOriginSpeaker(),
  updateSpeakerLoading: makeSelectUpdateSpeakerLoading(),
  updateSpeakerError: makeSelectUpdateSpeakerError(),
  addSpeakerLoading: makeSelectAddSpeakerLoading(),
  addSpeakerError: makeSelectAddSpeakerError(),
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    setSpeaker: speaker => dispatch(setSpeaker(speaker)),
    fetchSpeaker: speakerId => dispatch(fetchSpeaker(speakerId)),
    addSpeaker: speaker => dispatch(addSpeaker(speaker)),
    updateSpeaker: speaker => dispatch(updateSpeaker(speaker)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'speakerPage', reducer });
const withSaga = injectSaga({ key: 'speakerPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SpeakerPage);
