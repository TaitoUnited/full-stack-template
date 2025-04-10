# Unit tests

Unit tests are used to test individual functions and modules in isolation.

For example if you have a `user.utils.ts` file in the `src/user` folder,
you should create a `user.test.unit.ts` file in the same folder that contains
the unit tests for all user related testable units like utility functions.

You can run unit tests with the following command:

```sh
taito test:server unit
```

## Component Tests

When writing tests, you should follow the [Testing Library](https://testing-library.com/docs/react-testing-library/intro) principles to ensure that your tests are user-centric and focus on the behavior of your components.

Here's an example of a simple test using Testing Library:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";

test("Button should render correctly", () => {
  render(<Button label="Click me" />);

  const button = screen.getByRole("button", { name: /click me/i });

  expect(button).toBeInTheDocument();
});

test("Button should call onClick handler", () => {
  const onClick = jest.fn();
  render(<Button label="Click me" onClick={onClick} />);

  const button = screen.getByRole("button", { name: /click me/i });

  userEvent.click(button);

  expect(onClick).toHaveBeenCalledTimes(1);
});
```
