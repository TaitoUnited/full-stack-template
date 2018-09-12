import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paper, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FileDownloadIcon from '@material-ui/icons/CloudDownload';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PrintIcon from '@material-ui/icons/Print';
import CopyClipboardButton from '~controls/CopyClipboardButton';

import Item from '~controls/paging/Item';
import Circle from './Circle';

// TODO: load thumbnail from server
// eslint-disable-next-line
const imageUrl =
  'https://static.ilcdn.fi/viihdeuutiset/kahlekuningaskuva3ek2905_503_vd.jpg';

const propTypes = {
  item: PropTypes.object,
  onUnselect: PropTypes.func,
  onSelectPrev: PropTypes.func,
  onSelectNext: PropTypes.func
};

class SelectedImage extends React.Component {
  // As a default, we assume that images are landscape oriented
  state = {
    itemId: null
    // imgWidth: 3,
    // imgHeight: 2
  };

  componentWillMount() {
    this.scrollTo(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.scrollTo(newProps);
  }

  scrollTo(newProps) {
    // Scroll the SelectedImage component into view if  image section has
    // changed
    const { itemId } = this.state;
    if (itemId !== newProps.item.id && this.anchorEl) {
      this.setState({ itemId: newProps.item.id });
      setTimeout(() => {
        const domEl = ReactDOM.findDOMNode(this.anchorEl); // eslint-disable-line
        if (domEl) {
          // NOTE: use domEl.offsetParent as scrollParentEl if surrounding
          // element should be scrolled instead of document body.
          const scrollParentEl = document.documentElement;
          const middle = scrollParentEl.clientHeight / 2;
          const half = domEl.clientHeight / 2;
          const position = middle - half;
          const scrollTop = Math.max(0, domEl.offsetTop - position);
          scrollParentEl.scrollTop = scrollTop;
        }
      });
    }
  }

  render() {
    const {
      item,
      classes,
      onUnselect,
      onSelectPrev,
      onSelectNext
    } = this.props;
    return (
      <SelectedImageWrapper
        ref={anchorEl => {
          this.anchorEl = anchorEl;
        }}
      >
        <Item
          selected
          showNav
          onUnselect={onUnselect}
          onSelectPrev={onSelectPrev}
          onSelectNext={onSelectNext}
          minHeight='20vh'
          padding='20px'
        >
          <Content>
            <ContentLeft>
              <PreviewWrapper>
                <Preview
                  src={imageUrl}
                  alt='IMAGE'
                  onClick={() => window.open(imageUrl)}
                />
              </PreviewWrapper>
              <Actions>
                <CopyClipboardButton
                  buttonText='Copy link'
                  buttonClass={classes.button}
                  infoMessage='The link has been copied to your clipboard'
                  copyContent={imageUrl}
                />

                <Button
                  variant='raised'
                  color='primary'
                  className={classes.button}
                  onClick={() => window.open(imageUrl)}
                >
                  Open
                  <OpenInNewIcon className={classes.rightIcon} />
                </Button>

                <Button
                  variant='raised'
                  color='primary'
                  className={classes.button}
                  onClick={() => (window.location = imageUrl)}
                >
                  Download
                  <FileDownloadIcon className={classes.rightIcon} />
                </Button>
                <Button
                  variant='raised'
                  color='primary'
                  className={classes.button}
                  onClick={() => window.print()}
                >
                  Print
                  <PrintIcon className={classes.rightIcon} />
                </Button>
              </Actions>
            </ContentLeft>
            <ContentRight>
              <ResultInfo>
                <Circle color='#ffed0f' text='Status circle' />
                <Circle color='#ff421f' text='Another status circle' />
              </ResultInfo>

              <Table>
                <tbody>
                  <tr>
                    <th>Filename:</th>
                    <td>{item.filename}</td>
                  </tr>
                  <tr>
                    <th>Type:</th>
                    <td>{item.type}</td>
                  </tr>
                  <tr>
                    <th>Author:</th>
                    <td>{item.author}</td>
                  </tr>
                  <tr>
                    <th>Description:</th>
                    <td>{item.description}</td>
                  </tr>
                </tbody>
              </Table>
            </ContentRight>
          </Content>
        </Item>
      </SelectedImageWrapper>
    );
  }
}

// TODO convert to styled
const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 1.5,
    marginRight: theme.spacing.unit * 1.5
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    height: 16,
    width: 16
  }
});

const SelectedImageWrapper = styled(Paper)`
  display: block;
  width: 100%;
  min-height: 20vh;
  margin: 4px 0 16px 0;
  background-color: #29323b !important;
  color: #ffffff !important;
  font-size: 12px;
  line-height: 1.4;
  position: relative;
  z-index: 1;
  border-radius: 4px;

  @media (max-width: 480px) {
    width: 100%;
  }

  @media print {
    background-color: #ffffff !important;
    color: #000000 !important;
    height: auto !important;
    overflow: visible !important;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;

  @media screen and (min-width: 769px) {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    align-content: center !important;
  }

  @media screen and (min-width: 1700px) {
    width: 80%;
    margin: 0 auto;
  }

  @media screen and (min-width: 2000px) {
    width: 65%;
  }

  @media screen and (min-width: 3000px) {
    width: 50%;
  }

  @media print {
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    display: inline !important;
  }
`;

const ContentLeft = styled.div`
  width: 50%;
  height: 100%;

  @media screen and (max-width: 768px) {
    width: 100% !important;
    height: auto;
    position: relative;
    padding-bottom: 20px;
  }

  button {
    height: 36px !important;
  }

  @media print {
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    display: inline !important;
  }
`;

const PreviewWrapper = styled.div`
  width: 100%;
  background-color: #212930;
  padding: 0;
`;

const Preview = styled.img`
  max-width: 100%;
  max-height: 35vh;
  display: block;
  margin: 0 auto;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    max-height: 30vh;
  }
`;

const Actions = styled.div``;

const ContentRight = styled.div`
  width: 50%;
  height: 100%;
  padding-left: 2%;

  @media screen and (max-width: 768px) {
    width: 100% !important;
    height: auto;
    position: relative;
    padding-left: 0;
  }

  @media print {
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    display: inline !important;
  }
`;

const ResultInfo = styled.span`
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  span {
    margin-right: 6px;
  }

  @media print {
    font-weight: 400;
  }
`;

const Table = styled.table`
  margin-top: 10px;
  text-align: left;
  width: 100%;
  border: 0;

  tr {
    width: 100%;
    padding-left: 0;
  }

  th {
    vertical-align: top;
    padding-right: 5px;
    padding-left: 0;
    padding-bottom: 3px;
    width: 120px;

    &:hover > span {
      visibility: visible;
    }

    @media print {
      font-weight: 400;
    }
  }

  td {
    vertical-align: top;
    padding-left: 0;
    padding-bottom: 2px;
  }
`;

SelectedImage.propTypes = propTypes;

export default withStyles(styles)(SelectedImage);
