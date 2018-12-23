import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { read } from '~entities/posts.api';
import Post from './Post';

/* eslint-disable no-mixed-operators */
class ShowPage extends React.Component {
  state = {
    item: null
  };

  componentWillMount() {
    const { match } = this.props;
    const { database, itemId } = match.params;
    this.read(database, itemId);
  }

  componentWillReceiveProps(nextProps) {
    const { item } = this.state;
    const { database, itemId } = nextProps.match.params;
    if (itemId !== item.itemId) {
      this.read(database, itemId);
    }
  }

  onGoBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  async read(database, itemId) {
    // item not needed elsewhere -> just fetch it directly
    const item = await read({
      id: itemId
    });
    this.setState({ item });
  }

  render() {
    const { classes } = this.props;
    const { item } = this.state;
    return (
      <Post item={item} onGoBack={this.onGoBack} classes={classes}>
        <Button variant='contained' color='primary' onClick={this.onGoBack}>
          <NavigateBeforeIcon className={classes.leftIcon} />
          Takaisin
        </Button>
      </Post>
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

export default connect(
  null,
  null
)(withStyles(styles)(ShowPage), withRouter(ShowPage));
