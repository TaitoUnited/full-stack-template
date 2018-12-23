import React from 'react';
import { hot } from 'react-hot-loader/root';

import logger from './logger.utils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    logger.error(error);
    console.error(info);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return children;
  }
}

export const withErrorBoundary = WrappedComponent => {
  // eslint-disable-next-line
  return class extends React.Component {
    render() {
      return (
        <ErrorBoundary>
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };
};

export default hot(ErrorBoundary);
