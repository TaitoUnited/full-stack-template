# full-stack-template | client

## Structure recommendation

The example structure is meant for small applications. If you have a large application, you may want to divide it into 1-N independent modules that may also have submodules. This makes development easier in the long run, and also enables you to use newer technologies and conventions when implementing new modules aside the old ones. Example structure:

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

## Internationalization

This client template is initialized with [LinguiJS](https://lingui.js.org/index.html) for internationalization.

### Usage

The easiest way to add translation support for a piece of text is to use the `Trans` component.

```js
import { Trans } from '@lingui/macro';

const Example = () => (
  <span>
    <Trans>I want to translate this text</Trans>
  </span>
);
```

In some cases it's not possible to use a React component so need to use the `i18n` object directly.

```js
import { t } from '@lingui/macro';
import i18n from '~services/i18n';

const message = i18n._(t`I need to translate this too!`));
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
npm run lang:compile
```
