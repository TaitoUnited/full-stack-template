# Testing Patterns

This document describes testing patterns and conventions for the client application. See [`architecture.md`](./architecture.md) for overall architectural patterns.

## Test Organization

Tests are co-located with the code they test, following the same directory structure as the source code.

### Test File Naming

- `.test.tsx` - Component tests (React components)
- `.test.ts` - Hook and utility function tests
- `.spec.ts` - E2E tests (Playwright, located in `/playwright/tests/`)

### Test Location

Tests are placed next to the files they test:

```
src/
  components/
    button/
      button.tsx
      button.test.tsx        # Co-located test
  hooks/
    use-counter.ts
    use-counter.test.ts     # Co-located test
  utils/
    format-date.ts
    format-date.test.ts     # Co-located test
```

## Running Tests

### Unit/Component Tests

Run unit and component tests using Vitest:

```bash
# Run all tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Run tests with coverage
npm run test:unit:coverage
```

### E2E Tests

E2E tests are located in the `/playwright` directory and run separately:

```bash
# Run E2E tests
cd playwright && npm test
```

### CI/CD

Tests are automatically run in CI/CD pipelines. See the project's CI configuration for details.

## Test Types

### Component Tests

Component tests verify that React components render correctly and handle user interactions.

#### Basic Component Test

```tsx
import { render, screen } from '~/test/utils';
import { Button } from '~/components/uikit/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
```

#### Component Interaction Test

```tsx
import { render, screen } from '~/test/utils';
import userEvent from '@testing-library/user-event';
import { Button } from '~/components/uikit/button';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Component with Props Test

```tsx
import { render, screen } from '~/test/utils';
import { Card } from '~/components/uikit/card';

describe('Card', () => {
  it('renders title and content', () => {
    render(
      <Card title="Test Title">
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

### Hook Tests

Hook tests verify that custom React hooks work correctly.

#### Basic Hook Test

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './use-counter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

#### Hook with Dependencies Test

```tsx
import { renderHook } from '@testing-library/react';
import { usePosts } from './use-posts';

// Mock Apollo Client
vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(() => ({
    data: { posts: [{ id: '1', title: 'Test Post' }] },
    loading: false,
    error: null,
  })),
}));

describe('usePosts', () => {
  it('returns posts from query', () => {
    const { result } = renderHook(() => usePosts());
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0].title).toBe('Test Post');
  });
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly.

#### Component Integration Test

```tsx
import { render, screen } from '~/test/utils';
import { PostList } from './post-list';
import { PostCard } from './post-card';

// Mock GraphQL query
vi.mock('~/graphql', () => ({
  useQuery: vi.fn(() => ({
    data: {
      posts: [
        { id: '1', title: 'Post 1' },
        { id: '2', title: 'Post 2' },
      ],
    },
    loading: false,
  })),
}));

describe('PostList Integration', () => {
  it('renders list of posts', () => {
    render(<PostList />);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });
});
```

### E2E Tests

E2E tests are located in `/playwright/tests/` and test the full application flow.

#### Basic E2E Test

```tsx
import { test, expect } from '@playwright/test';

test('user can navigate to posts page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Posts');
  await expect(page).toHaveURL(/.*\/posts/);
});
```

## Test Utilities

### Test Setup

The test setup is configured in `/src/test/setup.tsx`:

```tsx
import '@testing-library/jest-dom/vitest';
```

### Custom Render

A custom render function is provided in `/src/test/utils.tsx` that includes all necessary providers:

```tsx
import { render } from '~/test/utils';

// Automatically includes:
// - I18nProvider
// - Other necessary providers
render(<MyComponent />);
```

### Mock Utilities

#### Mocking GraphQL Queries

```tsx
import { vi } from 'vitest';
import { useQuery } from '@apollo/client';

vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(() => ({
    data: { posts: [] },
    loading: false,
    error: null,
  })),
}));
```

#### Mocking Stores

```tsx
import { vi } from 'vitest';
import { workspaceIdStore } from '~/stores/workspace-store';

vi.mock('~/stores/workspace-store', () => ({
  workspaceIdStore: {
    getState: vi.fn(() => ({ workspaceId: 'test-id' })),
  },
}));
```

## GraphQL Testing

### Mocking GraphQL Queries

Mock GraphQL queries using Vitest:

```tsx
import { vi } from 'vitest';

const mockUseQuery = vi.fn();

vi.mock('@apollo/client', () => ({
  useQuery: () => mockUseQuery(),
}));

describe('PostList', () => {
  it('displays posts', () => {
    mockUseQuery.mockReturnValue({
      data: { posts: [{ id: '1', title: 'Test' }] },
      loading: false,
    });
    
    render(<PostList />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Testing GraphQL Hooks

Test custom hooks that use GraphQL:

```tsx
import { renderHook } from '@testing-library/react';
import { usePosts } from './use-posts';

vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(() => ({
    data: { posts: [] },
    loading: false,
  })),
}));

describe('usePosts', () => {
  it('returns posts from query', () => {
    const { result } = renderHook(() => usePosts());
    expect(result.current.posts).toEqual([]);
  });
});
```

## Accessibility Testing

### ARIA Testing

Test ARIA attributes:

```tsx
it('has proper ARIA label', () => {
  render(<Button aria-label="Close dialog">X</Button>);
  expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
});
```

### Keyboard Navigation Testing

Test keyboard interactions:

```tsx
import userEvent from '@testing-library/user-event';

it('handles keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();
  
  await user.keyboard('{Enter}');
  // Verify action was triggered
});
```

## Test Data

### Mock Data Patterns

Create reusable mock data:

```tsx
// test/mocks/posts.ts
export const mockPost = {
  id: '1',
  title: 'Test Post',
  content: 'Test content',
  createdAt: '2024-01-01',
};

export const mockPosts = [mockPost, { ...mockPost, id: '2', title: 'Post 2' }];
```

### Fixture Organization

Organize test fixtures:

```
src/
  test/
    fixtures/
      posts.ts
      users.ts
    mocks/
      apollo-client.ts
      stores.ts
```

## Testing Best Practices

### What to Test

✅ **Test:**
- Component rendering and display
- User interactions (clicks, form submissions)
- Custom hooks behavior
- Utility functions
- Error states and error handling
- Loading states

❌ **Don't Test:**
- Implementation details
- Third-party library internals
- Framework behavior (React, TanStack Router, etc.)
- Generated code (GraphQL types, etc.)

### Test Structure

Follow the Arrange-Act-Assert pattern:

```tsx
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange: Set up test data and render component
    const props = { title: 'Test' };
    render(<Component {...props} />);
    
    // Act: Perform the action being tested
    userEvent.click(screen.getByRole('button'));
    
    // Assert: Verify the expected outcome
    expect(screen.getByText('Expected result')).toBeInTheDocument();
  });
});
```

### Test Naming

Use descriptive test names:

```tsx
// ✅ Good
it('displays error message when query fails', () => {});
it('calls onSubmit with form data when submit button is clicked', () => {});

// ❌ Bad
it('works', () => {});
it('test 1', () => {});
```

### Test Isolation

Each test should be independent:

```tsx
// ✅ Good: Each test is independent
describe('Counter', () => {
  it('starts at 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it('increments to 1', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

## Common Testing Patterns

### Testing Forms

```tsx
import userEvent from '@testing-library/user-event';

it('submits form with correct data', async () => {
  const handleSubmit = vi.fn();
  const user = userEvent.setup();
  
  render(<Form onSubmit={handleSubmit} />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
  });
});
```

### Testing Async Operations

```tsx
it('displays loading state', async () => {
  const mockUseQuery = vi.fn(() => ({
    data: null,
    loading: true,
  }));
  
  render(<PostList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

### Testing Error States

```tsx
it('displays error message on query failure', () => {
  const mockUseQuery = vi.fn(() => ({
    data: null,
    loading: false,
    error: new Error('Failed to fetch'),
  }));
  
  render(<PostList />);
  expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
});
```

## Summary

- **Co-locate tests** with the code they test
- **Use descriptive test names** that explain what is being tested
- **Test behavior, not implementation** details
- **Keep tests independent** and isolated
- **Use test utilities** from `~/test/utils` for consistent setup
- **Mock external dependencies** (GraphQL, stores, etc.)
- **Test user interactions** using `@testing-library/user-event`
- **Test accessibility** with ARIA and keyboard navigation tests
