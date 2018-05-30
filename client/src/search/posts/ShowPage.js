import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { read } from '~entities/posts.api';
import Post from './Post';

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

/* eslint-disable no-mixed-operators */
class ShowPage extends React.Component {
  state = {
    item: null
  };

  componentWillMount() {
    const { database, itemId } = this.props.match.params;
    this.read(database, itemId);
  }

  componentWillReceiveProps(nextProps) {
    const { database, itemId } = nextProps.match.params;
    if (itemId !== this.state.item.itemId) {
      this.read(database, itemId);
    }
  }

  onGoBack = () => {
    this.props.history.goBack();
  };

  async read(database, itemId) {
    // item not needed elsewhere -> just fetch it directly
    const item = await read({
      id: itemId
    });
    this.setState({ item });
  }

  render() {
    return (
      <Post
        item={this.state.item}
        onGoBack={this.onGoBack}
        classes={this.props.classes}
      >
        <Button variant='raised' color='primary' onClick={this.onGoBack}>
          <NavigateBeforeIcon className={this.props.classes.leftIcon} />
          Takaisin
        </Button>
      </Post>
    );
  }
}

export default connect(
  null,
  null
)(withStyles(styles)(ShowPage), withRouter(ShowPage));
