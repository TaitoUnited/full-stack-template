import React, { Component } from 'react';

import UxView from './uxView.component';

class UxContainer extends Component {
  componentDidMount() {
    this.props.actions.onShowModal();
  }

  render() {
    return (
      <UxView
        actions={this.props.actions}
        appState={this.props.appState}
      />
    );
  }
}

export default UxContainer;
