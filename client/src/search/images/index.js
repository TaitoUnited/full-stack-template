import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Image from './Image';
import SelectedImage from './SelectedImage';

import SearchPage, {
  withMapStateToProps,
  withMapDispatchToProps
} from '../common/SearchPage';

export default withRouter(connect(
  withMapStateToProps('images', Image, SelectedImage),
  withMapDispatchToProps('images')
)(SearchPage));
