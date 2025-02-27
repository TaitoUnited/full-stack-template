# Testing

We are using [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/) for unit testing on the client side. Vitest is a fast and lightweight test runner, while Testing Library provides utilities to test UI components in a user-centric way.

## Test Scripts

There are three main scripts for running tests:

### `test:unit`

This script runs all unit tests once.

```bash
npm run test:unit
```

### `test:unit:watch`

This script runs unit tests in watch mode, which means it will re-run the tests whenever a file changes. This is useful during development to get immediate feedback on your changes.

```bash
npm run test:unit:watch
```

### `test:unit:coverage`

This script runs all unit tests and generates a code coverage report. The coverage report helps you understand how much of your code is covered by tests and identify areas that may need more testing.

```bash
npm run test:unit:coverage
```

## Writing Tests

When writing tests, you should follow the [Testing Library](https://testing-library.com/docs/react-testing-library/intro) principles to ensure that your tests are user-centric and focus on the behavior of your components.

Here's an example of a simple test using Testing Library:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';

test('Button should render correctly', () => {
  render(<Button label="Click me" />);

  const button = screen.getByRole('button', { name: /click me/i });

  expect(button).toBeInTheDocument();
});

test('Button should call onClick handler', () => {
  const onClick = jest.fn();
  render(<Button label="Click me" onClick={onClick} />);

  const button = screen.getByRole('button', { name: /click me/i });

  userEvent.click(button);

  expect(onClick).toHaveBeenCalledTimes(1);
});
```
