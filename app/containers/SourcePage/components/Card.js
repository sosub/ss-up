import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #e2e2e2;
  padding: 25px;
  background-color: #EEEEEE;
  max-width: 80%;
  margin: auto;
  margin-bottom: 50px;
`;

const Label = styled.h2`
  text-align: center;
  margin-bottom: 25px;
`;

class Card extends Component {

  render() {
    const { label, children } = this.props;

    return (
      <Wrapper>
        <Label>{label}</Label>
        {children}
      </Wrapper>
    );
  }
}


Card.propTypes = {
  label: PropTypes.string,
  children: PropTypes.any,
};

export default Card;
