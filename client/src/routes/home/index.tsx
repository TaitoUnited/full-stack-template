import Fallback from './Home.fallback';
import { routeEntry } from '../route-utils';

export default routeEntry({
  path: '/',
  fallback: <Fallback />,
  component: () => import('./Home.page'),
});
