import React from 'react';
import styled from 'styled-components';

const Circle = ({ color, text }) => (
  <CircleWrapper color={color}>
    <ToolTip>{text}</ToolTip>
  </CircleWrapper>
);

const CircleWrapper = styled.div`
  width: 10px;
  height: 10px;
  margin: 0 1px 0 1px;
  border-radius: 5px;
  background-color: ${props => props.color};
  position: relative;
  display: inline-block;

  &:hover > span {
    visibility: visible;
  }
`;

const ToolTip = styled.span`
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 8px;
  position: absolute;
  -webkit-transform: translateY(-40%);
  -moz-transform: translateY(-40%);
  -ms-transform: translateY(-40%);
  -o-transform: translateY(-40%);
  transform: translateY(-40%);
  left: 160%;
  z-index: 2;

  &:after {
    content: ' ';
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent black transparent transparent;
  }
`;

export default Circle;
