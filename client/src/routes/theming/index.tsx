import Fallback from './ThemingPlaceholder';
import { routeEntry } from '../route-utils';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./Theming'),
});
