import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import View from '~layout/view.component';

const UsersViewWrapper = styled(View)``;

const UsersViewContainer = () => (
  <UsersViewWrapper className='UsersView' title='Users' type='fullPage'>
    Users
  </UsersViewWrapper>
);

function mapStateToProps(state) {
  return {
    example: state.example
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersViewContainer);
