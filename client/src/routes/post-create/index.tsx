import Fallback from './PostCreate.fallback';
import { routeEntry } from '../route-utils';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./PostCreate.page'),
});
