# Analytics

We are using [Sentry](https://sentry.io/) for error tracking and reporting. Sentry is configured to be enabled only in production environment to monitor and capture exceptions, providing insights into issues that occur in the live application.

> [!WARNING]
> The analytics implementation in the template is rudimentary and should be expanded to include more detailed error tracking and reporting. For more information on Sentry, refer to the [official documentation](https://docs.sentry.io/).

## Sentry Configuration

The Sentry configuration is managed through the [`constants/config.ts`](/client//src/constants/config.ts) file, which includes an `ERROR_REPORTING_ENABLED` flag to control whether error reporting is enabled and a `SENTRY_DSN` to specify the Sentry Data Source Name (DSN).

```typescript
export const config = {
  SENTRY_DSN: process.env.SENTRY_DSN,
  ERROR_REPORTING_ENABLED:
    currentEnv === 'prod' &&
    import.meta.env.PROD &&
    !!process.env.SENTRY_DSN &&
    process.env.SENTRY_DSN.startsWith('https'),
  // Other configuration settings...
};
```

> [!IMPORTANT]
> Don't forget to add your project's Sentry DSN.
>
> Search for `#sentryDSN` within the project to find the location where you need to add your DSN.

### Sentry Initialization

The Sentry SDK is initialized in the `setupErrorReporting` function from the [`reporting.ts`](/client/src/services/reporting.ts) file, which is called in the [`index.tsx`](/client/src/index.tsx) file. The initialization is conditionally executed based on the `ERROR_REPORTING_ENABLED` flag.

```jsx
import { init } from '@sentry/browser';

import { config } from '~/constants/config';

export function setupErrorReporting() {
  if (config.ERROR_REPORTING_ENABLED) {
    init({ dsn: config.SENTRY_DSN });
  } else {
    console.log('Ignoring error reporting setup for this environment');
  }
}
```

### Usage

By default, any routing errors are captured and reported using Sentry. The [`RouteError`](/client/src/routes/route-error.tsx) component is responsible for capturing and reporting route errors, while the [`ErrorView`](/client/src/components/common/error-view.tsx) component displays an error message and provides options to report the error or reload the page.

As in `ErrorView`, you can add Sentry error reporting to other components by calling `captureException` with the error object. The following example demonstrates how to capture an error in a component:

```jsx
import { captureException } from '@sentry/browser';

function MyComponent() {
  try {
    // Code that may throw an error
  } catch (error) {
    console.error('Error occurred:', error);
    if (config.ERROR_REPORTING_ENABLED) {
      captureException(error);
    }
  }
}
```

> Note: The `ERROR_REPORTING_ENABLED` flag is used to conditionally enable Sentry error reporting in production environments. Ensure that you set the flag to `true` in your production environment.

## Summary

By integrating Sentry into your project, you can effectively monitor and capture exceptions in your production environment. The `RouteError` and `ErrorView` components demonstrate how to use Sentry for error reporting, ensuring that you are aware of issues and can address them promptly. Remember to configure the `ERROR_REPORTING_ENABLED` flag to enable Sentry only in production environments.
