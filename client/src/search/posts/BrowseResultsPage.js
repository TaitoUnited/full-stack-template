import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import KeyListener from '~controls/paging/KeyListener';
import { prevFunc, nextFunc } from '~controls/paging/utils';

import { search, withSection } from '../common/ducks';
import Post from './Post';

const propTypes = {
  results: PropTypes.object.isRequired,
  paging: PropTypes.object.isRequired,
  onUpdatePaging: PropTypes.func.isRequired,
  onShowItem: PropTypes.func.isRequired
};

/* eslint-disable no-mixed-operators */
class BrowseResults extends React.Component {
  onGoBack = () => {
    this.props.history.push('/search/posts');
  };

  render() {
    const { paging, results, classes } = this.props;
    const item = this.props.results.items[this.props.results.selectedIndex];
    const onPrev = prevFunc(
      results.selectedIndex,
      paging,
      this.props.onUpdatePaging,
      this.props.onShowItem
    );
    const onNext = nextFunc(
      results.selectedIndex,
      results,
      paging,
      this.props.onUpdatePaging,
      this.props.onShowItem
    );

    const postNumber =
      paging.page * paging.pageSize + results.selectedIndex + 1;

    return (
      <div>
        <KeyListener
          listenEsc={false}
          results={results}
          paging={paging}
          onUpdatePaging={this.props.onUpdatePaging}
          onSelectItem={this.props.onShowItem}
        />
        <Post
          item={item}
          headlinePrefix={`${postNumber}.`}
          onGoBack={this.onGoBack}
          classes={classes}
        >
          <Button variant='raised' color='primary' onClick={this.onGoBack}>
            <NavigateBeforeIcon className={classes.leftIcon} />
            Back to results
          </Button>
          <Spacer />
          <Button
            variant='raised'
            color='primary'
            disabled={!onPrev}
            onClick={onPrev}
          >
            <NavigateBeforeIcon />
          </Button>
          <Spacer />
          <Button
            variant='raised'
            color='primary'
            disabled={!onNext}
            onClick={onNext}
          >
            <NavigateNextIcon />
          </Button>
        </Post>
      </div>
    );
  }
}

// TODO convert to styled
const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
    height: 16,
    width: 16
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

const Spacer = styled.div`
  margin: 5px;
`;

export const mapStateToProps = state => {
  return {
    results: state.search.posts.results,
    paging: state.search.posts.paging
  };
};

const mapDispatchToProps = dispatch => {
  const actionCreators = bindActionCreators(
    {
      onUpdatePaging: search.updatePaging,
      onShowItem: search.showItem
    },
    dispatch
  );
  return {
    onUpdatePaging: withSection('posts', actionCreators.onUpdatePaging),
    onShowItem: withSection('posts', actionCreators.onShowItem)
  };
};

BrowseResults.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BrowseResults), withRouter(BrowseResults));
