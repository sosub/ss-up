/**
 *
 * SourcePage
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
  setSource,
  fetchSource,
  addSource,
  updateSource,
} from './actions';
import makeSelectSourcePage, {
  makeSelectSource,
  makeSelectOriginSource,
  makeSelectUpdateSourceLoading,
  makeSelectUpdateSourceError,
  makeSelectAddSourceLoading,
  makeSelectAddSourceError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import { makeSelectToken } from 'containers/LoginPage/selectors';

const { TextArea } = Input;

const DEFAULT_NEW_SOURCE = {
  imageFile: [],
};

const DEFAULT_ORIGIN_SOURCE = {
  imageFile: [],
};

/* eslint-disable react/prefer-stateless-function */
export class SourcePage extends React.Component {
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !getQuery(nextProps.location.search).id &&
      nextState.source.id
    ) {
      return {
        source: DEFAULT_NEW_SOURCE,
        originSource: DEFAULT_ORIGIN_SOURCE,
      };
    }
    if (
      getQuery(nextProps.location.search).id &&
      nextProps.source &&
      nextProps.source.id
    ) {
      return {
        source: nextProps.source,
        originSource: nextProps.originSource,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      source: DEFAULT_NEW_SOURCE,
      originSource: DEFAULT_ORIGIN_SOURCE,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const query = getQuery(this.props.location.search);
    if (query.id) {
      this.props.fetchSource(query.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updateSourceLoading && !this.props.updateSourceLoading) {
      if (!this.props.updateSourceError) {
        notification.success({
          message: 'Update Source Success',
        });
      } else {
        notification.error({
          message: this.props.updateSourceError,
        });
      }
    }

    if (prevProps.addSourceLoading && !this.props.addSourceLoading) {
      if (!this.props.addSourceError) {
        notification.success({
          message: 'Create Source Success',
        });
        prevProps.history.push(`/source?id=${this.props.source.id}`);
      } else {
        notification.error({
          message: this.props.addSourceError,
        });
      }
    }
  }

  handleSubmit() {
    const { source } = this.state;
    console.log('handleSubmit', source);

    if (source.id) {
      this.props.updateSource(source);
    } else {
      this.props.addSource(source);
    }
  }

  handleCancel() {
    this.props.history.push(`/sources`);
  }

  onNameChange = (e) => {
    const name = e.target.value;
    const source = this.state.source;
    const { sourceNames } = source;
    if (!source.id) {
      this.setState({
        source: {
          ...source,
          name,
          slug: makeSlug(name),
        },
      });
    }
    this.props.setSource({
      ...source,
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
    if (!this.state.source.id) {
      this.setState({
        source: {
          ...this.state.source,
          [attr]: value,
        },
      });
    }
    this.props.setSource({
      ...this.state.source,
      [attr]: value,
    });
  }

  renderActionButtons() {
    const {
      source,
      originSource,
    } = this.state;
    const { updateSourceLoading, addSourceLoading } = this.props;

    return (
      <Center>
        {source.id ? (
          <span>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={updateSourceLoading}
              onClick={this.handleSubmit}
              disabled={_.isEqual(originSource, source)}
            >
              Update Source
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
            loading={addSourceLoading}
            onClick={this.handleSubmit}
          >
            Create Source
          </Button>
        )}
      </Center>
    )
  }

  render() {
    const {
      source,
      originSource,
    } = this.state;

    const { token } = this.props;

    return (
      <div>
        <Helmet>
          <title>{`${source.id ? 'Edit' : 'Add'} Source`}</title>
          <meta name="description" content={source.description} />
        </Helmet>
        <Section>
          <H1>
            {source.id ? `Edit Source - ${source.name}` : 'Add Source'}
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
                  value={source.name}
                  onChange={this.onNameChange}
                  className={
                    source.name !== originSource.name
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
                  value={source.slug}
                  onChange={e => this.onFieldChange('slug', e.target.value)}
                  className={
                    source.slug !== originSource.slug
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
                      value={source.description}
                      style={{ height: '100%' }}
                      onChange={e => this.onFieldChange('description', e.target.value)}
                      className={
                        source.description !== originSource.description
                          ? 'updating-input'
                          : ''
                      }
                    />
                  </Col>
                  <Col sm={12}>
                    <ReactMarkdown
                      source={source.description} />
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
                  data={{ path: 'source_images' }}
                  headers={{
                    "Authorization": `Token ${token}`,
                  }}
                  onChange={this.onUploadFile.bind(this, 'image')}
                  onRemove={this.onRemoveFile.bind(this, 'image')}
                  fileList={source.imageFile}
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

SourcePage.propTypes = {
  source: PropTypes.object.isRequired,
  setSource: PropTypes.func.isRequired,
  fetchSource: PropTypes.func.isRequired,
  addSource: PropTypes.func.isRequired,
  updateSource: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // sourcePage: makeSelectSourcePage(),
  source: makeSelectSource(),
  originSource: makeSelectOriginSource(),
  updateSourceLoading: makeSelectUpdateSourceLoading(),
  updateSourceError: makeSelectUpdateSourceError(),
  addSourceLoading: makeSelectAddSourceLoading(),
  addSourceError: makeSelectAddSourceError(),
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    setSource: source => dispatch(setSource(source)),
    fetchSource: sourceId => dispatch(fetchSource(sourceId)),
    addSource: source => dispatch(addSource(source)),
    updateSource: source => dispatch(updateSource(source)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sourcePage', reducer });
const withSaga = injectSaga({ key: 'sourcePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SourcePage);
