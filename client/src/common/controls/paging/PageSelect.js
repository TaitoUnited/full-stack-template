import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';

const propTypes = {
  paging: PropTypes.shape({
    page: PropTypes.number.isRequired
  }).isRequired,
  numOfPages: PropTypes.number.isRequired,
  onSelectPage: PropTypes.func.isRequired
};

// TODO use Select.js
class PageSelect extends React.Component {
  componentDidMount() {
    const { paging } = this.props;
    this.pageInput.value = paging.page + 1;
    this.pageInput.min = 1;
  }

  componentWillReceiveProps(props) {
    this.pageInput.value = props.paging.page + 1;
  }

  onWheel = event => {
    const page = parseInt(this.pageInput.value, 10) || 1;
    this.pageInput.value = Math.max(1, page + Math.sign(event.deltaY));
  };

  onClick = () => {
    this.pageInput.select();
  };

  onKeyDown = event => {
    if (event.keyCode === 13) this.onSelect();
  };

  onSelect = () => {
    const { paging, onSelectPage } = this.props;
    const page = Math.max(0, (parseInt(this.pageInput.value, 10) || 1) - 1);
    if (page === paging.page || page < 0) {
      this.resetValue();
      return;
    }
    onSelectPage(page);
  };

  resetValue = () => {
    const { paging } = this.props;
    this.pageInput.value = paging.page + 1;
  };

  render() {
    const { numOfPages } = this.props;
    return (
      <Wrapper>
        <PageInput
          type='number'
          onClick={this.onClick}
          inputRef={ref => {
            this.pageInput = ref;
          }}
          onKeyDown={this.onKeyDown}
          onBlur={this.resetValue}
          onWheel={this.onWheel}
        />
        /
        {numOfPages}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 100%;
`;

const PageInput = styled(TextField)`
  width: 80px;
`;

PageSelect.propTypes = propTypes;

export default PageSelect;
