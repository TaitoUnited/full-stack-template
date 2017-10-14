import React, { Component } from 'react';

import UsersView from './usersView.component';

class UsersContainer extends Component {
  componentDidMount() {
    this.props.actions.onShowModal();
  }

  render() {
    return (
      <UsersView
        actions={this.props.actions}
        appState={this.props.appState}
      />
    );
  }
}

export default UsersContainer;
