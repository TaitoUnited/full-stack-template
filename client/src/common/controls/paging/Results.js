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
    const { listenKeys } = this.props;
    window.addEventListener('resize', this.updateDimensions);
    if (listenKeys) {
      document.addEventListener('keydown', this.keydownListener, false);
    }
    this.updateOpenedItemIndex();
  }

  componentDidUpdate() {
    this.updateOpenedItemIndex();
  }

  componentWillUnmount() {
    const { listenKeys } = this.props;
    window.removeEventListener('resize', this.updateDimensions);
    if (listenKeys) {
      document.removeEventListener('keydown', this.keydownListener, false);
    }
  }

  updateDimensions = () => {
    this.forceUpdate();
  };

  updateOpenedItemIndex = () => {
    const { openedItemComponent, results } = this.props;

    const { openedItemIndex } = this.state;

    if (openedItemComponent) {
      let index = results.selectedIndex;

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

      if (index !== openedItemIndex) {
        this.setState({ openedItemIndex: index });
      }
    }
  };

  render() {
    const {
      results,
      paging,
      criteria,
      filters,
      itemComponent,
      openedItemComponent,
      onUpdatePaging,
      onSelectItem,
      onShowItem
    } = this.props;

    const { openedItemIndex } = this.state;

    let selectedProps = null;

    const items = results.items.map((item, index) => {
      const selected = index === results.selectedIndex;

      const onPrev = prevFunc(index, paging, onUpdatePaging, onSelectItem);
      const onNext = nextFunc(
        index,
        results,
        paging,
        onUpdatePaging,
        onSelectItem
      );

      const props = {
        index,
        selectedIndex: results.selectedIndex,
        key: item.id,
        item,
        criteria,
        paging,
        filters,
        resultNumber: index + paging.pageSize * paging.page + 1, // eslint-disable-line
        selected,
        onShow: () => onShowItem(index),
        onSelect: () => onSelectItem(index),
        onUnselect: () => onSelectItem(-1),
        onSelectPrev: onPrev,
        onSelectNext: onNext
      };
      if (selected) {
        selectedProps = props;
      }
      return React.createElement(itemComponent, props);
    });

    // Insert opened item to the calculated position
    if (openedItemIndex && selectedProps) {
      items.splice(
        openedItemIndex,
        0,
        React.createElement(openedItemComponent, {
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
