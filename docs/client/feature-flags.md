# Feature flags

Feature flags make it possible to implement features in isolation while continuing shipping other features and bug fixes to users.

So, instead of having long lived feature branches, that you have to continuously rebase, you break down feature development in small iterations that can be shipped without causing breakage in the app. Feature flags are a way to achieve this by hiding or disabling certain features behind a flag that can be turned on in various ways.

> ℹ️ Feature flags enable true continuous deployment by making it possible to ship incomplete features to production without negatively affecting normal app usage.

## Setup

Feature flags are defined in `src/services/feature-flags.ts` file where you can enable features per environment (note that types are removed from the example).

```ts
import { appEnvironments } from '~/constants/config';

const featureConfig = {
  'feature-1': appEnvironments, // enabled in all envs
  'feature-2': ['localhost', 'dev', 'test'],
  'feature-3': ['localhost'],
};
```

## Session overrides

Feature flags can be forcefully turned on either via URL search parameter or via the feature flag manager widget for the duration of the tab session.

### Feature flag manager

You can open the feature flag manager widget with a `Cmd+K` (or `Ctrl+K`) shortcut and then toggle on/off the features that you want. Note that you need to press the save button to apply the changes which will reload the page.

### URL search parameters

Format: `?feature-flags=feature-name`

Turn on one feature:

```txt
?feature-flags=feature-1
```

Turn on multiple feature:

```txt
?feature-flags=feature-1&feature-flags=feature-2
```

## Usage

There are two ways to check whether a feature is enabled.

### `<FeatureGate>`

```tsx
import FeatureGate from '~/components/feature-flags/feature-gate';

function Example() {
  return (
    <div>
      <p>This text is always visible</p>

      <FeatureGate feature="feature-1">
        <p>This text is only visible when feature 1 is enabled</p>
      </FeatureGate>
    </div>
  );
}
```

### `isFeatureEnabled`

```tsx
import { isFeatureEnabled } from '~/utils/feature-flags';

function Example() {
  const featureEnabled = isFeatureEnabled('feature-1');

  function doSomething() {
    if (featureEnabled) {
      // Some logic for feature 1
    } else {
      // Default logic
    }
  }

  return <div>...</div>;
}
```
