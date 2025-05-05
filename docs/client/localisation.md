# Localisation Guide

This guide walks you through managing translations in your project using [LinguiJS](https://lingui.dev), including how to update translations, add new strings and manage dynamic and pluralized text.

---

## Setup

You can find the LinguiJS configuration in [`lingui.config.js`](/client/lingui.config.js). This file contains the locales and other settings for your project.

---

## Translation Management

### Updating Existing Translations

1. Run the following command to extract all translatable strings from your source code:

   ```bash
   npm run i18n:extract
   ```

   This updates each language’s `messages.po` file with new or modified strings.

2. Open the relevant `messages.po` file in a text editor and add your translations. For example:

   ```po
   #: src/app/(auth)/landing.tsx:74
   #: src/app/(auth)/signup.tsx:55
   msgid "Create an account"
   msgstr "Luo tili"
   ```

3. Re-run the extract command to validate your translations and ensure files are properly updated:

   ```bash
   npm run i18n:extract
   ```

---

### Compiling Translations

Compilation is done automatically by the [Vite](/client/vite.config.js) Lingui plugin. It compiles `.po` files into `.js` files for use in your app.

---

### Adding a New Translatable String

To mark a static string as translatable in your code:

```tsx
import { Trans } from "@lingui/react/macro";

<Trans>Create an account</Trans>;
```

Then run:

```bash
npm run i18n:extract
```

This updates all `messages.po` files with the new string.

---

### Translating Dynamic Content

For dynamic values like props or alt attributes:

```tsx
import { useLingui } from "@lingui/react/macro";

export default function ImageWithCaption() {
  const { t } = useLingui();
  return <img src="..." alt={t`Image caption`} />;
}
```

If you're outside of a React component or can't use hooks:

```tsx
import { t } from "@lingui/core/macro";

export function SearchInput({
  placeholder = t`Search`,
  ...
}) {
  ...
}
```

Then extract the translations:

```bash
npm run i18n:extract
```

---

### Handling Plurals

To localize pluralized content:

```tsx
import { plural } from "@lingui/core/macro";

const message = plural(numBooks, {
  one: "# Book",
  other: "# Books",
});
```

- If `numBooks = 1` → "1 Book"
- If `numBooks = 2` → "2 Books"

📘 [Plurals Guide](https://lingui.dev/guides/plurals)

---

### Handling Nested Components

Use nested components within `<Trans>` blocks for rich formatting:

```tsx
<Trans>
  <Text style={{ fontSize: 20 }}>
    <Text>Concert of </Text>
    <Text style={{ color: "green" }}>Green Day</Text>
    <Text style={{ fontWeight: "bold" }}> tonight!</Text>
  </Text>
</Trans>
```

Will be extracted as:

```text
"<0><1>Concert of </1><2>Green Day</2><3> tonight!</3></0>"
```

📘 [Nested Components Guide](https://lingui.dev/tutorials/react-native#nesting-components)

---

## Managing Locales

### Adding a New Language

1. Add your locale to [`lingui.config.js`](/lingui.config.js):

   ```ts
   export default defineConfig({
     locales: ["en-FI", "fi", "<lang>"], // Add your language code here
   });
   ```

2. Run:

   ```bash
   npm run i18n:extract
   ```

   This creates a new folder and `messages.po` file under `src/locales/<lang>`.

3. Update your language switcher in `i18n.tsx` to include the new locale.

---

### Removing a Language

1. Remove the locale from [`lingui.config.js`](/lingui.config.js):

   ```ts
   locales: ['en-FI', 'fi'], // Remove your locale
   ```

2. Then:

   - Run `npm run i18n:extract`
   - Delete the `src/locales/<lang>` folder
   - Update `i18n.tsx` accordingly
