import React, { Component } from 'react';

import SearchView from './searchView.component';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blah: [],
    };
  }

  render() {
    return <SearchView />;
  }
}

export default SearchContainer;
