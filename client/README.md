# full-stack-template | client

## Structure recommendation

The example structure used in the example implementation is meant for small applications. If you have a large application, you may want to divide it into 1-N independent modules that may also optionally contain submodules. This makes development easier in the long run, and also enables you to use newer technologies and conventions when implementing new modules aside the old ones. An example structure for a larger application:

```
src/
  common/
    components/
      product/
      uikit/
    constants/
    graphql/
    images/
    locales/
    services/
    utils/
  billing/
    components/
      invoice/
    locales/
    graphql/
    routes/
  warehouse/
    components/
      shelf/
    locales/
    modules/
      common/
        components/
          floor/
          wall/
      floorplan/
        components/
        routes/
      utilization/
        components/
        routes/
    graphql/
    routes/
```

## Styling

Client side styling is achieved with [🐼 Panda CSS](https://panda-css.com/) which is a CSS-in-JS styling library with build time generated CSS stylesheets, RSC compatible, and multi-variant support.

These are the benefits of using Panda CSS over some other CSS-in-JS styling solutions:

- Static CSS stylesheet extraction during build
- Theming based on CSS variables instead of React context
- Possibility to define custom CSS properties and utilities
- Variant oriented mindset when defining dynamic styles
- Easily add responsive styles, even in React props!

Read more about the benefits of Panda [here](https://panda-css.com/docs/overview/why-panda).

> ℹ️ If you have used `styled-components` in the past you might wanna read the [migration guide](https://panda-css.com/docs/migration/styled-components) from the Panda CSS docs to better understand the differences between the two.

### Setup

Panda CSS works by generating the styling library, called **styled system**, from a [configuration file](https://panda-css.com/docs/references/config) (`panda.config.ts`). This styled system is what is used in the client app code instead of importing things from the Panda CSS package directly.

> ⚠️ Whenever you make changes to the Panda CSS setup (any file under `/styled-system/setup/`) you need regenerate the styled system with `npm run generate:styled-system`!
>
> Note that this is done automatically on dev server startup and before production build!

### Usage

The generated styled system exposes a few styling utilities from which `css` and `styled` are the most commonly useful.

```tsx
import { css } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

function Example() {
  return (
    <div className={someStyles}>
      <Comp size="small">Small</Comp>
      <Comp size="large">Large</Comp>
    </div>
  );
}

// Styles without a component
const someStyles = css({
  backgroundColor: '$primary',
});

// Styled component
const Comp = styled('div', {
  base: {
    color: '$text',
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    size: {
      small: { padding: '$small' },
      large: { padding: '$large' },
    },
  },
});
```

If you want to define styles without having to name things you can prefer using the `css()` inline to apply the generated classname directly to the element:

```tsx
import { css } from '~/styled-system/css';

function Example() {
  return (
    // Inline styles
    <div className={css({ padding: '$large' })}>
      <p className={css({ color: '$primary' })}>Hello again</p>
    </div>
  );
}
```

Panda also exposes other utilities like [`cx`](https://panda-css.com/docs/concepts/writing-styles#merging) or [`cva`](https://panda-css.com/docs/concepts/recipes) that can be useful in certain situations.

> ℹ️ Panda CSS allows you to use the `styled` helper in another way which however is not recommended due to how it negatively affects the JS bundle size:

```tsx
import { styled } from '~/styled-system/jsx';

function Example() {
  return (
    // Try to avoid this
    <styled.div padding="$large">
      <styled.p color="$primary">Hello there</styled.p>
    </styled.div>
  );
}
```

#### Theming

The client app is configured to pull design tokens, think of them as variables of your design, directly from Figma with a [Figmage](https://github.com/Temzasse/figmage) CLI tool. When you bootstrap a new project with this template you should have a Figma design that has all the necessary design tokens available for the client, things like colors, spacing, sizes, shadows, radii, and icons.

You need to add a `.env` file under `/styled-system` that contains the following:

```txt
FIGMA_ACCESS_TOKEN=get-this-from-figma
FIGMA_FILE_ID=get-this-from-figma-project-url
```

Before you can pull down the design system tokens from Figma ensure that the necessary variables (colors, text styles, etc.) have been [published](https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library). Also you should update the Figmage configuration inside package.json `"figmage"` field - see available configuration options [here](https://github.com/Temzasse/figmage#configuration).

Then you can run `npm run design-system:sync` to pull down the tokens from the Figma project. This will store the tokens in `/styled-system/tokens` and you **should not** edit them manually but instead rerun the command in case you need to update the tokens.

## Internationalization

This client template is initialized with [LinguiJS](https://lingui.dev/) for internationalization.

### Usage

The easiest way to add translation support for a piece of text is to use the `Trans` component.

```js
import { Trans } from '@lingui/react/macro';

function Example() {
  return (
    <span>
      <Trans>I want to translate this text</Trans>
    </span>
  );
}
```

In some cases it's not possible to use a React component so need to use the `t` macro with `useLingui` hook.

```js
import { useLingui } from '@lingui/react/macro';

function Example() {
  const { t } = useLingui();

  function handleClick() {
    window.alert(t`I need to translate this too!`);
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

### Translation process

#### 1. Add locale (_optional_)

By default the template contains `fi` and `en` locales.

```sh
npm run lang:add-locale fi
```

#### 2. Extract messages

```sh
npm run lang:extract
```

#### 3. Translate message

Send `.po` files to customer for translation.

#### 4. Compile messages

```sh
npm run generate:lang
```

## Feature flags

Feature flags make it possible to implement features in isolation while continuing shipping other features and bug fixes to users.

So, instead of having long lived feature branches, that you have to continuously rebase, you break down feature development in small iterations that can be shipped without causing breakage in the app. Feature flags are a way to achieve this by hiding or disabling certain features behind a flag that can be turned on in various ways.

> ℹ️ Feature flags enable true continuous deployment by making it possible to ship incomplete features to production without negatively affecting normal app usage.

### Setup

Feature flags are defined in `src/utils/feature-flags.ts` file where you can enable features per environment (note that types are removed from the example).

```ts
import { appEnvironments } from '~/constants/config';

const features = ['feature-1', 'feature-2', 'feature-3'];

const featureConfig = {
  'feature-1': appEnvironments, // enabled in all envs
  'feature-2': ['localhost', 'dev', 'test'],
  'feature-3': ['localhost'],
};
```

### Session overrides

Feature flags can be forcefully turned on either via URL search parameter or via the feature flag manager widget for the duration of the tab session.

#### Feature flag manager

You can open the feature flag manager widget with a `Cmd+K` (or `Ctrl+K`) shortcut and then toggle on/off the features that you want. Note that you need to press the save button to apply the changes which will reload the page.

#### URL search parameters

Format: `?feature-flags=feature-name`

Turn on one feature:

```txt
?feature-flags=feature-1
```

Turn on multiple feature:

```txt
?feature-flags=feature-1&feature-flags=feature-2
```

### Usage

Then there are three ways to check whether a feature is enabled.

#### `<FeatureGate>`

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

#### `isFeatureEnabled`

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
