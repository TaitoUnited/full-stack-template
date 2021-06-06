import { Suspense, ReactNode, ReactElement } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';

type Props = {
  children: ReactNode;
  fallback?: null | ReactElement;
};

export default function Page({ children, fallback = null }: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
