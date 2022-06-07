import Fallback from './PostCreatePlaceholder';
import { routeEntry } from '../route-utils';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./PostCreate'),
});
