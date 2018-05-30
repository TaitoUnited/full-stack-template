import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

// TODO jj
import { readItem } from '../common/item.api';
import Article from '../common/Article';

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
class TextViewPage extends React.Component {
  state = {
    item: null
  };

  componentWillMount() {
    const { database, itemId } = this.props.match.params;
    this.readItem(database, itemId);
  }

  componentWillReceiveProps(nextProps) {
    const { database, itemId } = nextProps.match.params;
    if (itemId !== this.state.item.itemId) {
      this.readItem(database, itemId);
    }
  }

  onGoBack = () => {
    this.props.history.goBack();
  };

  async readItem(database, itemId) {
    // item not needed elsewhere -> just fetch it directly
    // TODO remove criteria and redux stuff
    const item = await readItem({
      criteria: { database },
      itemId
    });
    this.setState({ item });
  }

  render() {
    return (
      <Article
        item={this.state.item}
        onGoBack={this.onGoBack}
        classes={this.props.classes}
      >
        <Button variant='raised' color='primary' onClick={this.onGoBack}>
          <NavigateBeforeIcon className={this.props.classes.leftIcon} />
          Takaisin
        </Button>
      </Article>
    );
  }
}

export default connect(
  null,
  null
)(withStyles(styles)(TextViewPage), withRouter(TextViewPage));
