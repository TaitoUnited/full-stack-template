import React, { Component } from 'react';

import SearchView from './searchView.component';

class SearchContainer extends Component {
  componentDidMount() {
    this.props.actions.onShowModal();
  }

  render() {
    return (
      <SearchView
        actions={this.props.actions}
        appState={this.props.appState}
      />
    );
  }
}

export default SearchContainer;
