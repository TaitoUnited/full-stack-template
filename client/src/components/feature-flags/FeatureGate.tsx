import { ReactNode } from 'react';
import { Feature, isFeatureEnabled } from '~services/feature-flags';

type Props = {
  feature: Feature;
  children: ReactNode;
};

export function FeatureGate({ children, feature }: Props) {
  if (!isFeatureEnabled(feature)) return null;
  return <>{children}</>;
}
