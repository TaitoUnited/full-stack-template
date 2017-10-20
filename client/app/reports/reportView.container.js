import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import View from '~layout/view.component';

const ReportViewWrapper = styled(View)``;

const ReportViewContainer = () => (
  <ReportViewWrapper className='ReportView' title='Report' type='fullPage'>
    Report
  </ReportViewWrapper>
);

function mapStateToProps(state) {
  return {
    example: state.example
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ReportViewContainer
);
