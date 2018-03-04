import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import View from '~layout/view.component';

const FilesViewWrapper = styled(View)``;

const FilesViewContainer = () => (
  <FilesViewWrapper className='FilesView' title='Files' type='fullPage'>
    Files
  </FilesViewWrapper>
);

const mapStateToProps = state => {
  return {
    example: state.example
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesViewContainer);
