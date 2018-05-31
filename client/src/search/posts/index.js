import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PostSummary from './PostSummary';
import SearchFields from './SearchFields';

import SearchPage, {
  withMapStateToProps,
  withMapDispatchToProps
} from '../common/SearchPage';

export default withRouter(connect(
  withMapStateToProps('posts', 'Search posts', SearchFields, PostSummary),
  withMapDispatchToProps('posts')
)(SearchPage));
