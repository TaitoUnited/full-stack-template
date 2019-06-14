import React from 'react';
import * as Sentry from '@sentry/browser';
import styled from 'styled-components';

import config from '../config';

interface Props {
  children: any;
}

interface State {
  error: any;
}

class ErrorBoundary extends React.Component<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error });

    if (config.ERROR_REPORTING_ENABLED) {
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });

        Sentry.captureException(error);
      });
    } else {
      console.log('> Not sending error reports for thi enviroment!');
    }
  }

  handleErrorReport = () => {
    if (config.ERROR_REPORTING_ENABLED) {
      Sentry.showReportDialog();
    } else {
      console.log('> Error reporting is not enabled in this enviroment!');
    }
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return (
        <Wrapper>
          <button onClick={this.handleErrorReport}>
            <span>Raportoi virhe</span>
          </button>
        </Wrapper>
      );
    }

    return children;
  }
}

const Wrapper = styled.div`
  padding: 16px;
  text-align: center;
`;

export function withErrorBoundary<P extends Props>(
  Comp: React.ComponentType<P>
) {
  const displayName = Comp.displayName || Comp.name || 'Component';

  return class extends React.Component<Props> {
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

export default ErrorBoundary;
