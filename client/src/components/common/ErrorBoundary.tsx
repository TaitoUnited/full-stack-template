import { Component, ComponentType, ReactNode } from 'react';
import { Trans } from '@lingui/macro';
import styled from 'styled-components';
import * as Sentry from '@sentry/browser';

import config from '~constants/config';

type Props = {
  children: ReactNode;
};

type State = {
  error: any;
};

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: any, errorInfo: any) {
    // Automatically reload page when loading a loadable component fails
    // TODO: might cause infinite reload
    if (
      error?.message?.indexOf('Importing a module script failed') !== -1 ||
      error?.message?.indexOf('is not a valid JavaScript MIME type') !== -1
    ) {
      this.tryReload();
    }

    this.setState({ error });

    if (config.ERROR_REPORTING_ENABLED) {
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });

        Sentry.captureException(error);
      });
    } else {
      console.log('> Not sending error reports for this enviroment!');
    }
  }

  handleErrorReport = () => {
    if (config.ERROR_REPORTING_ENABLED) {
      Sentry.showReportDialog();
    } else {
      console.log('> Error reporting is not enabled in this enviroment!');
    }
  };

  tryReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return (
        <Wrapper>
          {!config.ERROR_REPORTING_ENABLED && (
            <Button onClick={this.handleErrorReport}>
              <Trans>Report an error</Trans>
            </Button>
          )}
          <div>
            <Button onClick={this.tryReload}>
              <Trans>Reload Page</Trans>
            </Button>
          </div>
        </Wrapper>
      );
    }

    return children;
  }
}

const Wrapper = styled.div`
  padding: ${p => p.theme.spacing.medium}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${p => p.theme.spacing.medium}px;
`;

const Button = styled.button`
  padding: ${p => p.theme.spacing.small}px;
  background-color: ${p => p.theme.colors.errorMuted};
  color: ${p => p.theme.colors.errorText};
  border-radius: ${p => p.theme.radii.normal}px;
`;

export function withErrorBoundary<P extends Props>(Comp: ComponentType<P>) {
  const displayName = Comp.displayName || Comp.name || 'Component';

  return class extends Component<Props> {
    public static displayName = `withErrorBoundary(${displayName})`;

    render() {
      return (
        <ErrorBoundary>
          <Comp {...(this.props as P)} />
        </ErrorBoundary>
      );
    }
  };
}
