import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Post from './Post';

import SearchPage, {
  withMapStateToProps,
  withMapDispatchToProps
} from '../common/SearchPage';

export default withRouter(connect(
  withMapStateToProps('posts', Post),
  withMapDispatchToProps('posts')
)(SearchPage));
