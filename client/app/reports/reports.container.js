import React, { Component } from 'react';

import ReportsView from './reportsView.component';

class ReportsContainer extends Component {
  componentDidMount() {
    this.props.actions.onShowModal();
  }

  render() {
    return (
      <ReportsView
        actions={this.props.actions}
        appState={this.props.appState}
      />
    );
  }
}

export default ReportsContainer;
