import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, LinearProgress } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import CopyClipboardButton from '~controls/CopyClipboardButton';

const propTypes = {
  item: PropTypes.object,
  headlinePrefix: PropTypes.string,
  onGoBack: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

/* eslint-disable */

/* eslint-disable no-mixed-operators */
class Post extends React.Component {
  componentDidMount() {
    document.addEventListener('keyup', this.keyupListener, false);
  }
  componentWillReceiveProps() {
    if (this.content) {
      this.content.scrollTop = 0;
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyupListener, false);
  }
  keyupListener = event => {
    // ESC: go back
    if (
      event.keyCode === 27 &&
      !event.altKey &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.props.onGoBack();
    }
  };

  highlightText = post => {
    const start = post.indexOf('\\o2');
    const end = post.indexOf('\\f2') + 3;
    if (start === -1 || end === -1) return post;
    return [
      post.slice(0, start),
      <HighLight>{post.slice(start, end).replace(/\\(o|f)2/g, '')}</HighLight>,
      this.highlightText(post.slice(end, post.length))
    ];
  };

  copyText = () => {
    const { item } = this.props;
    return `${item.subject}\n\n${item.content}`;
  };

  render() {
    const { item, headlinePrefix, classes } = this.props;
    return !item ? (
      <StyledProgress />
    ) : (
      <StyledMain>
        <Navigator rounded="false">
          <Navi>{this.props.children}</Navi>
          <Actions>
            <CopyClipboardButton
              buttonText="Copy text"
              infoMessage="Text has been copied to your clipboard"
              copyContent={this.copyText()}
            />
            <Spacer />
            <CopyClipboardButton
              buttonText="Copy link"
              infoMessage="Link has been copied to your clipboard"
              copyContent="TODO link"
            />
            <Spacer />
            <Button
              variant="raised"
              color="primary"
              onClick={() => window.print()}
            >
              Print
              <PrintIcon className={classes.rightIcon} />
            </Button>
          </Actions>
        </Navigator>
        <Content
          innerRef={node => {
            this.content = node;
          }}
        >
          <TextContent>
            <Header>
              <Headline>{item.subject}</Headline>
            </Header>
            <Text>{item.content}</Text>
          </TextContent>
        </Content>
      </StyledMain>
    );
  }
}

const TextParagraph = styled.div`
  font-weight: ${props => props.decoration || 'none'};
  margin: 1rem 0;
`;

const StyledProgress = styled(LinearProgress)`
  width: 100%;
`;

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;

  @media print {
    padding-top: 0;
    page-break-inside: auto;
    height: auto !important;
    overflow: visible;
    display: inline !important;
  }
`;

const Navigator = styled.div`
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  background-color: #eee !important;
  border: 1px solid #d6d6d6 !important;
  width: 100%;
  padding: 16px 32px;

  @media print {
    display: none !important;
  }

  @media (max-width: 1050px) {
    flex-direction: column;
    justify-content: center;
  }

  button {
    padding: 4px 16px !important;
  }
`;

const Spacer = styled.div`
  margin: 5px;
`;

const Navi = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 1050px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 1050px) {
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 15px;
  }
`;

const Content = styled.div`
  display: flex;
  /* using row-reverse to put info content to top in narrow view */
  flex-direction: row-reverse;
  justify-content: flex-end;
  overflow: auto;
  padding: 40px;
  height: 100%;

  @media print {
    overflow: visible;
    page-break-inside: auto;
    height: auto !important;
    display: inline !important;
  }

  @media (max-width: 920px) {
    /* column-reverse caused problems with margins */
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const TextContent = styled.div`
  padding-bottom: 50px;
  width: 720px;
  max-width: 720px;

  @media print {
    page-break-inside: auto;
    height: auto !important;
    overflow: visible;
    display: inline !important;
  }

  @media (max-width: 1100px) {
    width: 800px;
    max-width: 800px;
  }

  @media (max-width: 920px) {
    width: 100;
    max-width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
`;

const Headline = styled.span`
  color: #1a9bf5;
  font-size: 15pt;
`;

const HeadlinePrefix = styled.span`
  margin-right: 8px;
`;

const HeaderInformation = styled.div`
  color: #6a737d;
  font-size: 11pt;
  line-height: 2em;
`;

const CorrectionButton = styled(Button)`
  margin-left: 30px;
  margin-top: -5px;
  height: 30px !important;
  padding: 4px 16px !important;
`;

const Text = styled.div`
  padding-bottom: 50px;

  @media print {
    overflow: visible;
    height: auto;
    display: block;
  }
`;

const HighLight = styled.span`
  background-color: yellow;
  @media print {
    background-color: transparent;
  }
`;

const SideContent = styled.div`
  margin-left: 50px;
  margin-right: 30px;
  min-width: 350px;
  max-width: 350px;
  width: 350px;

  @media (max-width: 1100px) {
    min-width: 300px;
    max-width: 300px;
    width: 300px;
  }

  @media (max-width: 920px) {
    margin: auto;
    margin-top: 15px;
    margin-bottom: 30px;
  }
`;

const InformationContainer = styled.div`
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-collapse: separate;
  border-spacing: 5px;
  border-radius: 15px;
  background-color: #eeeeee;
`;

const TextID = styled.div`
  width: 100%;
  margin-bottom: 10px;
  padding: 2px;
  font-size: 11pt;
  line-height: 1.3;
`;

const TextIDHeader = styled.span`
  font-weight: 500;
`;

const InformationTable = styled.table`
  table-layout: fixed;
  line-height: 1.3;
`;

const InformationRow = styled.tr`
  width: 100%;
  font-size: 11pt;
  vertical-align: top;
`;

const InformationField = styled.th`
  text-align: left;
  font-weight: 500;
  max-width: 100px;
  width: 100px;

  &:hover > span {
    visibility: visible;
  }
`;

const InformationValue = styled.td`
  padding-left: 15px;
  vertical-align: bottom;
`;

const ToolTip = styled.span`
  visibility: hidden;
  width: auto;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 8px;
  position: absolute;
  margin-left: 8px;
  margin-top: -5px;
  z-index: 1;

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

const Download = styled.div`
  margin-top: 15px;
  padding: 15px 15px 10px 15px;
  max-width: 100%;
  width: auto;
  background-color: #eee;
  box-sizing: border-box;
  border-collapse: separate;
  border-spacing: 5px;
  border-radius: 15px;
  text-align: center;

  img {
    max-width: 100%;
    width: auto;
    height: auto;
  }

  button {
    margin-top: 5px;
    width: 100%;
  }

  @media print {
    display: none !important;
  }
`;

Post.propTypes = propTypes;

export default Post;
