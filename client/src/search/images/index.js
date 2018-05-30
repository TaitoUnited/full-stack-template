import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Image from './Image';
import SelectedImage from './SelectedImage';
import SearchFields from './SearchFields';

import SearchPage, {
  withMapStateToProps,
  withMapDispatchToProps
} from '../common/SearchPage';

export default withRouter(connect(
  withMapStateToProps(
    'images',
    'Search images',
    SearchFields,
    Image,
    SelectedImage
  ),
  withMapDispatchToProps('images')
)(SearchPage));
