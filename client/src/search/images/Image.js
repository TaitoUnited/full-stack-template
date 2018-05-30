import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { appear } from '~utils/animations.utils';

import Circle from './Circle';

const thumbUrl =
  'https://static.ilcdn.fi/viihdeuutiset/kahlekuningaskuva3ek2905_503_vd.jpg';

const propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.number,
  // selectedBy: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
  resultNumber: PropTypes.number.isRequired
};

const styles = () => ({
  rounded: {
    borderRadius: '4px'
  }
});

class Image extends Component {
  state = {
    hover: false,
    width: 130,
    height: 0
  };

  componentWillReceiveProps(newProps) {
    // Automatically select next or previous image if this image
    // is selected but disabled
    // NOTE: This is a hack. Save image width/height to store instead of state
    // so that this can be handled in an action.
    if (
      newProps.selected &&
      newProps.selectedBy === 'key' &&
      this.isDisabled(newProps.filters.shape)
    ) {
      const forwards = this.props.selectedIndex < newProps.index;
      if (forwards && this.props.onSelectNext) {
        this.props.onSelectNext(newProps.selectedBy);
      } else if (!forwards && this.props.onSelectPrev) {
        this.props.onSelectPrev(newProps.selectedBy);
      } else {
        this.props.onUnselect();
      }
    }
  }

  updateImageProportions = e => {
    this.setState({
      width: e.target.clientWidth,
      height: e.target.clientHeight
    });
  };

  isDisabled = shape => {
    return (
      (shape === 'landscape' && this.state.height > this.state.width) ||
      (shape === 'portrait' && this.state.height < this.state.width)
    );
  };

  mouseEnter = () => {
    this.setState({ hover: true });
  };

  /* Scroll content of shortInfo to top when mouse leaves component (for when
  the user has scrolled the content) */
  mouseLeave = () => {
    this.setState({ hover: false });
  };

  showShortInfo = () => {
    return !this.state.hover || this.props.selectedIndex !== -1;
  };

  render() {
    const { classes } = this.props;
    const disabled = this.isDisabled(this.props.filters.shape);
    return (
      <ImageWrapper
        id={`results-item-${this.props.index}`}
        onClick={
          this.mouseLeave &&
          (this.props.selected ? this.props.onUnselect : this.props.onSelect)
        }
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        className={classes.rounded}
      >
        <ThumbContent>
          {/* TODO use thumbnail type or add image crop settings? */}
          <ThumbnailImageWrapper disabled={disabled}>
            <ThumbnailImage
              src={thumbUrl}
              alt={this.props.item.name}
              onLoad={this.updateImageProportions}
            />
            <ResultNumber>{this.props.resultNumber}</ResultNumber>
            <ColorCodes>
              <Circle color='#ffed0f' text='Status circle' />
            </ColorCodes>
          </ThumbnailImageWrapper>
          {this.showShortInfo() && (
            <ShortInfo width={this.state.width} disabled={disabled}>
              asdf asdfasdf asd fa sdf asdf asdf a sdf asdf asdf asdfasd fas
              asdfasdfasdf asdfasdfa sdfasdfa sdfasdf asdfasdf asdfa asdfasdfa
              asdfasdfasdf asd asdfasdf asdf asdf asdfasd fasdf sad.
            </ShortInfo>
          )}
          {!this.showShortInfo() && (
            <LongInfo width={this.state.width} disabled={disabled}>
              asdfasdfasdf asdf asdf asd asdf asdf asd fasd fasdfasd asd fasdf
              asd fasdf asdfas asd fasdfasdfasd asdf asdf asd fasdf asd
              fasdfasdf asd fasdf asdf asdfasd.
            </LongInfo>
          )}
        </ThumbContent>
        {this.props.selected && (
          <SelectedMarker>
            <SelectedMarkerTringle />
          </SelectedMarker>
        )}
      </ImageWrapper>
    );
  }
}

const ImageWrapper = styled(Paper)`
  display: inline-block;
  vertical-align: top;
  width: auto;
  height: 218px;
  min-width: 160px;
  margin: 0 12px 12px 0;
  animation: ${appear} 0.8s forwards;
  background-color: #29323b !important;
  color: #ffffff !important;
  font-size: 11px;
  line-height: 1.4;
  position: relative;
  z-index: 0;
  cursor: pointer;

  &:hover {
    z-index: 1;
  }

  @media (max-width: 480px) {
    width: 100%;
  }

  @media print {
    display: none;
  }
`;

const SelectedMarker = styled.div`
  width: 100%;
  position: absolute;
  bottom: -16px;
`;

const SelectedMarkerTringle = styled.div`
  width: 0;
  height: 0;
  margin: 0 auto;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #29323b;
`;

const ThumbContent = styled.span`
  background-color: #29323b;
`;

const ThumbnailImageWrapper = styled.span`
  display: block;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
`;

const ThumbnailImage = styled.img`
  width: ${props => props.width}px;
  height: 160px;
  margin: 0 auto;
  display: block;
  border-radius: 4px 4px 0px 0px;
`;

const ResultNumber = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 0px 4px 0px;
`;

const ColorCodes = styled.div`
  position: absolute;
  top: 144px;
  left: 0;
  min-width: 10px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 3px;
`;

const ShortInfo = styled.div`
  width: ${props => props.width}px;
  min-width: 160px;
  height: calc(11px * 1.4 * 3.2);
  margin-top: 0;
  margin-bottom: 6px;
  padding: 6px;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* max lines to show */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
`;

const LongInfo = styled.div`
  width: ${props => props.width}px;
  min-width: 160px;
  height: auto;
  margin-top: 0;
  padding: 6px;
  background-color: #29323b !important;
  border-radius: 0px 0px 4px 4px;

  > * {
    opacity: ${props => (props.disabled ? '0.3' : '1')};
  }
`;

Image.propTypes = propTypes;

export default withStyles(styles)(Image);
