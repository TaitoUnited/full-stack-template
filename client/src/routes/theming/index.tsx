import Fallback from './Theming.fallback';
import { routeEntry } from '../route-utils';

export default routeEntry({
  path: '/theming',
  fallback: <Fallback />,
  component: () => import('./Theming.page'),
});
