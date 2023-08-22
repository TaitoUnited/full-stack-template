import Fallback from './FeatureFlags.fallback';
import { routeEntry } from '../route-utils';

export default routeEntry({
  path: '/feature-flags',
  fallback: <Fallback />,
  featureFlag: 'feature-3',
  component: () => import('./FeatureFlags.page'),
});
