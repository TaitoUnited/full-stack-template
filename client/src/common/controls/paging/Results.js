import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { prevFunc, nextFunc } from './utils';

const propTypes = {
  criteria: PropTypes.any.isRequired,
  results: PropTypes.shape({
    items: PropTypes.array,
    selectedIndex: PropTypes.number.isRequired
  }).isRequired,
  filters: PropTypes.any,
  paging: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
  }).isRequired,
  onUpdatePaging: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onShowItem: PropTypes.func.isRequired,
  itemComponent: PropTypes.any.isRequired,
  openedItemComponent: PropTypes.any
};

class Results extends React.Component {
  state = {
    openedItemIndex: null
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    if (this.props.listenKeys) {
      document.addEventListener('keydown', this.keydownListener, false);
    }
    this.updateOpenedItemIndex();
  }

  componentDidUpdate() {
    this.updateOpenedItemIndex();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    if (this.props.listenKeys) {
      document.removeEventListener('keydown', this.keydownListener, false);
    }
  }

  updateDimensions = () => {
    this.forceUpdate();
  };

  updateOpenedItemIndex = () => {
    if (this.props.openedItemComponent) {
      let index = this.props.results.selectedIndex;

      if (index >= 0) {
        let item = document.getElementById(`results-item-${index}`);
        if (item) {
          const selectedItemTop = item.offsetTop;
          let currentElementTop = -1;
          while (item && currentElementTop <= selectedItemTop) {
            index += 1;
            item = document.getElementById(`results-item-${index}`);
            if (item) {
              currentElementTop = item.offsetTop;
            }
          }
        }
      }

      if (index !== this.state.openedItemIndex) {
        this.setState({ openedItemIndex: index });
      }
    }
  };

  render() {
    let selectedProps = null;

    const items = this.props.results.items.map((item, index) => {
      const selected = index === this.props.results.selectedIndex;

      const onPrev = prevFunc(
        index,
        this.props.paging,
        this.props.onUpdatePaging,
        this.props.onSelectItem
      );
      const onNext = nextFunc(
        index,
        this.props.results,
        this.props.paging,
        this.props.onUpdatePaging,
        this.props.onSelectItem
      );

      const props = {
        index,
        selectedIndex: this.props.results.selectedIndex,
        selectedBy: this.props.results.selectedBy,
        key: item.id,
        item,
        criteria: this.props.criteria,
        paging: this.props.paging,
        filters: this.props.filters,
        resultNumber:
          index + this.props.paging.pageSize * this.props.paging.page + 1, // eslint-disable-line
        selected,
        onShow: () => this.props.onShowItem(index),
        onSelect: () => this.props.onSelectItem(index),
        onUnselect: () => this.props.onSelectItem(-1),
        onSelectPrev: onPrev,
        onSelectNext: onNext
      };
      if (selected) {
        selectedProps = props;
      }
      return React.createElement(this.props.itemComponent, props);
    });

    // Insert opened item to the calculated position
    if (this.state.openedItemIndex && selectedProps) {
      items.splice(
        this.state.openedItemIndex,
        0,
        React.createElement(this.props.openedItemComponent, {
          ...selectedProps,
          key: 'opened-item' // `opened-${selectedProps.key}`
        })
      );
    }

    return <StyledWrapper>{items}</StyledWrapper>;
  }
}

const StyledWrapper = styled.div`
  padding: 16px 32px 8px 32px;
  margin-bottom: 150px;
`;

Results.propTypes = propTypes;

export default Results;
