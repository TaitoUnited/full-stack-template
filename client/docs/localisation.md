# Localisation

This client template is initialized with [LinguiJS](https://lingui.dev/) for internationalization.

## Setup

The Lingui setup can be found in the [package.json](../package.json) file:

```json
  "lingui": {
    "sourceLocale": "en",
    "locales": [
      "en",
      "fi"
    ],
    "catalogs": [
      {
        "path": "src/locales/{locale}/messages",
        "include": [
          "src"
        ]
      }
    ],
    "format": "po"
  },
```

## Usage

The easiest way to add translation support for a piece of text is to use the `Trans` component.

```tsx
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

```tsx
import { useLingui } from '@lingui/react/macro';

function Example() {
  const { t } = useLingui();

  function handleClick() {
    window.alert(t`I need to translate this too!`);
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

## Translation process

### Add a new locale _(optional)_

By default, our applications have two locales: `fi` and `en`. To add a new locale, run the following command:

```sh
npm run lang:add-locale <locale>
```

### Extract messages

To extract messages from the source code, run the following command:

```sh
npm run lang:extract
```

This command will generate `.po` files in the `src/locales/{locale}/messages` directory.

### Translate message

Send the `.po` files to customer for translation.

### Compile messages

The compilation of messages is done with the vite **lingui** plugin set in [`vite.config.js`](../vite.config.js) file, so we do not need to run any additional commands to compile messages.
