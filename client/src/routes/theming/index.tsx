import Fallback from './Theming.fallback';
import { routeEntry } from '../route-utils';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./Theming.page'),
});
