import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { appear } from '~utils/animations.utils';
import Item from '~controls/paging/Item';
import { addSearchStateToPath } from '../common/utils';

const propTypes = {
  resultNumber: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  criteria: PropTypes.object.isRequired,
  paging: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelectPrev: PropTypes.func,
  onSelectNext: PropTypes.func,
  onShow: PropTypes.func.isRequired
};

class PostSummary extends Component {
  componentDidMount() {
    const { selected } = this.props;
    if (selected) {
      this.node.scrollIntoView({
        behavior: 'instant',
        inline: 'center'
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props.selected) {
      this.node.scrollIntoView({
        behavior: 'instant',
        inline: 'center'
      });
    }
  }

  render() {
    const {
      resultNumber,
      item,
      criteria,
      paging,
      selected,
      onSelectPrev,
      onSelectNext,
      onShow
    } = this.props;

    return (
      <TextWrapper
        id={`result${resultNumber}`}
        innerRef={node => {
          this.node = node;
        }}
      >
        <Item
          selected={selected}
          onSelectPrev={onSelectPrev}
          onSelectNext={onSelectNext}
          showNav={false}
          minHeight='1vh'
          padding='12px 20px'
        >
          <Header>
            <Headline
              selected={selected}
              onClick={onShow}
              href={addSearchStateToPath(
                '/search/posts/browse',
                criteria,
                paging,
                item.id
              )}
            >
              <HeadlineTopic selected={selected}>
                {resultNumber}
                .&nbsp;&nbsp;
                {' '}
                {item.subject}
              </HeadlineTopic>
              <br />
              <Information>
                by
                {item.author}
              </Information>
            </Headline>
          </Header>
          <InnerText>{item.content}</InnerText>
        </Item>
      </TextWrapper>
    );
  }
}

const TextWrapper = styled.div`
  max-width: 950px;
  max-height: 190px;
  min-height: 50px;
  height: auto;
  margin: 2px;
  padding: 2px;
  animation: ${appear} 0.8s forwards;

  :nth-child(odd) {
    background-color: #f0f0f0;
  }
`;

const Headline = styled.span`
  color: #1a9bf5;
  overflow: hidden;
  white-space: nowrap;
`;

const HeadlineTopic = styled.a`
  display: block;
  cursor: pointer;
  color: #1a9bf5;
  font-size: 16px;
  line-height: 1.2em;

  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: ${props => (props.selected ? 'underline' : 'none')};
  :hover {
    text-decoration: underline;
  }
`;

const Information = styled.div`
  color: #6a737d;
  font-size: 14px;
  line-height: 1.2em;
`;

const InnerText = styled.p`
  margin-left: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 0.3em;
`;

PostSummary.propTypes = propTypes;

export default PostSummary;
