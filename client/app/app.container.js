import React, { Component } from 'react';

import App from './app.component';

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: true,
      modalVisible: false,
    };
    this.actions = {
      onToggleMenu: this.onToggleMenu,
      onHideModal: this.onHideModal,
      onShowModal: this.onShowModal,
    };
  }

  // NOTE: This is an example of 'vanilla react'. In a really simple
  // application it is often easier to manage state and actions directly
  // on a container component instead of using redux and redux-saga.
  // TODO service call example
  onToggleMenu = () => {
    this.setState({
      menuVisible: !this.state.menuVisible,
    });
  }

  onHideModal = () => {
    this.setState({ modalVisible: false });
  };

  onShowModal = () => {
    this.setState({ modalVisible: true });
  };

  render() {
    return (
      <App
        actions={this.actions}
        appState={this.state}
      />
    );
  }
}

export default AppContainer;
