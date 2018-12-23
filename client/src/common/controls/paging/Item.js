import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import CloseIcon from '@material-ui/icons/Close';

const Item = ({
  selected,
  showNav,
  onUnselect,
  onSelectPrev,
  onSelectNext,
  minHeight,
  padding,
  children
}) => (
  <FullHeightLayout minHeight={minHeight}>
    {selected
      && showNav && (
      <Side>
        <PrevButton
          variant='contained'
          color='primary'
          disabled={!onSelectPrev}
          onClick={onSelectPrev}
        >
          <NavigateBeforeIcon />
        </PrevButton>
      </Side>
    )}
    <Content flex={20} padding={padding}>
      {children}
    </Content>
    {selected
      && showNav && (
      <Side>
        <CloseButton
          key='close'
          aria-label='Close'
          color='inherit'
          onClick={onUnselect}
        >
          <CloseIcon />
        </CloseButton>
        <NextButton
          variant='contained'
          color='primary'
          disabled={!onSelectNext}
          onClick={onSelectNext}
        >
          <NavigateNextIcon />
        </NextButton>
      </Side>
    )}
  </FullHeightLayout>
);

const FullHeightLayout = styled.div`
  display: flex;
  flex: none;
  min-height: ${props => props.minHeight};
  height: 100%;
`;

const Side = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
`;

const PrevButton = styled(Button)`
  height: 80px;
  min-width: 0 !important;
  padding: 8px !important;
  left: -50%;
`;

const NextButton = styled(Button)`
  height: 80px;
  min-width: 0 !important;
  padding: 8px !important;
  right: -50%;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 0;
  padding: ${props => props.padding};
  width: 100%;
  height: 100%;
  /* Firefox text-overflow fix */
  min-width: 0;
`;

export default Item;
