import Fallback from './HomePlaceholder';
import { routeEntry } from '../route-utils';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./Home'),
});
