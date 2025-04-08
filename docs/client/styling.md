# Styling

Client side styling is achieved with [🐼 Panda CSS](https://panda-css.com/) which is a CSS-in-JS styling library with build time generated CSS stylesheets, RSC compatible, and multi-variant support.

These are the benefits of using Panda CSS over some other CSS-in-JS styling solutions:

- Static CSS stylesheet extraction during build
- Theming based on CSS variables instead of React context
- Possibility to define custom CSS properties and utilities
- Variant oriented mindset when defining dynamic styles
- Easily add responsive styles, even in React props!

Read more about the benefits of Panda [here](https://panda-css.com/docs/overview/why-panda).

> ℹ️ If you have used `styled-components` in the past you might wanna read the [migration guide](https://panda-css.com/docs/migration/styled-components) from the Panda CSS docs to better understand the differences between the two.

## Setup

Panda CSS works by generating the styling library, called **styled system**, from a [configuration file](https://panda-css.com/docs/references/config) (`panda.config.ts`). This styled system is what is used in the client app code instead of importing things from the Panda CSS package directly.

> ⚠️ Whenever you make changes to the Panda CSS setup (any file under `/styled-system/setup/`) you need regenerate the styled system with `npm run generate:styled-system`!
>
> Note that this is done automatically on dev server startup and before production build!

## Usage

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
