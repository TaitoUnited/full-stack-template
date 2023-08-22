import { ReactNode } from 'react';
import { Feature, isFeatureEnabled } from '~utils/feature-flags';

type Props = {
  feature: Feature;
  children: ReactNode;
};

export default function FeatureGate({ children, feature }: Props) {
  if (!isFeatureEnabled(feature)) return null;
  return <>{children}</>;
}
