import React, { Component } from 'react';
import axios from 'axios';

import logger from '~common/logger.util';
import VanillaView from './vanilla-view.component';
// import VanillaView2 from './vanilla-view2.component';

const apiUrl = `${process.env.API_ROOT}${process.env.API_URL}`;

class VanillaContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
    this.actions = {
      onCauseErrorOnBrowser: this.onCauseErrorOnBrowser,
      onCauseErrorOnNginx: this.onCauseErrorOnNginx,
      onCauseErrorOnServer: this.onCauseErrorOnServer,
      onSearchFiles: this.onSearchFiles,
      onAddFile: this.onAddFile,
    };
    this.fetchFiles();
  }

  onCauseErrorOnBrowser = () => {
    logger.error(new Error('error_on_browser'));
  }

  onCauseErrorOnNginx = () => {
    axios.get('/not_found');
  }

  onCauseErrorOnServer = () => {
    axios.post(`${apiUrl}/info`);
  }

  onSearchFiles = () => {
  }

  onAddFile = file => {
    axios.post(`${apiUrl}/files`, file)
    .then(resp => {
      this.setState({
        files: [...this.state.files, { ...file, id: resp.data.id }],
      });
    });
  }

  fetchFiles = () => {
    axios.get(`${apiUrl}/files`)
    .then(resp => {
      this.setState({ files: resp.data });
    });
  }

  render() {
    return (
      <VanillaView
        actions={this.actions}
        files={this.state.files}
      />
    );
  }
}

export default VanillaContainer;
