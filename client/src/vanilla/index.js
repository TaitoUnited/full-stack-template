import React, { Component } from 'react';

import api from './api';
import Files from './Files';

class VanillaContainer extends Component {
  state = {
    files: []
  };

  componentDidMount() {
    this.fetchFiles();
  }

  onAddFile = async file => {
    const id = await api.create({ file });
    this.setState({
      files: [...this.state.files, { ...file, id }]
    });
  };

  fetchFiles = async () => {
    const files = await api.fetch();
    this.setState({ files });
  };

  render() {
    return (
      <Files
        onAddFile={this.onAddFile}
        onSearchFiles={this.onSearchFiles}
        files={this.state.files}
      />
    );
  }
}

export default VanillaContainer;
