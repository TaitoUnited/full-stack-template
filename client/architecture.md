# Client Architecture

Looking for client documentation? See the client docs [here](/docs/client/README.md).

> **Note**: This application is **desktop-only** with landscape-oriented layouts. No mobile or responsive design is required.

## Architectural Overview

### Architectural Style

This frontend application follows a **component-based, design system-driven architecture** with a focus on:

- **TypeScript-first development**: Full type safety across the application
- **Design system primacy**: UI kit components and design tokens are prioritized over custom implementations
- **GraphQL-first data fetching**: Apollo Client with generated TypeScript types
- **File-based routing**: TanStack Router with type-safe route definitions
- **CSS-in-JS with build-time generation**: Panda CSS for type-safe, token-based styling
- **Functional programming patterns**: React functional components with hooks
- **Co-location principle**: Related code is organized together (routes, components, hooks)

### Key Architectural Principles

1. **Design System First**: Always check Storybook and design tokens before creating new components or styles
2. **Type Safety**: Leverage TypeScript and GraphQL code generation for end-to-end type safety
3. **Composition over Configuration**: Build complex UIs by composing simple, reusable components
4. **Separation of Concerns**: Clear boundaries between routing, state management, data fetching, and presentation
5. **Co-location**: Keep related code together (routes with their components, components with their hooks)
6. **Minimal Custom Code**: Prefer established libraries and design system components over custom implementations

### Technology Stack

- **React 18+**: Functional components with hooks
- **TypeScript**: Full type safety
- **TanStack Router**: Type-safe, file-based routing
- **Apollo Client**: GraphQL client with code generation
- **Panda CSS**: Build-time CSS-in-JS with design tokens
- **React Aria / React Aria Components**: Accessibility primitives (keyboard, focus, ARIA); used by UI kit components and for tablists
- **Zustand**: Lightweight state management for client state
- **Storybook**: Design system documentation and component library
- **Lingui**: Internationalization (i18n)

### Coding Style

#### Component Style

- **Functional Components**: All components are functional, using hooks for state and side effects
- **Named Exports**: Components are exported as named exports
- **TypeScript Interfaces**: Props are typed with TypeScript interfaces/types
- **Composition**: Build complex components by composing simpler ones

```tsx
// Example component style
import { type ReactNode } from 'react';
import { styled } from '~/styled-system/jsx';

export function MyComponent({ title, children }: { 
  title: string; 
  children: ReactNode;
}) {
  return (
    <Container>
      <Title>{title}</Title>
      {children}
    </Container>
  );
}

const Container = styled('div', {
  base: {
    padding: '$large',
  },
});
```

#### Styling Style

- **Panda CSS**: Use `css()` and `styled()` from the generated styled system
- **Design Tokens**: Always use design tokens (e.g., `'$large'`, `'$primary'`) instead of arbitrary values
- **Token-First**: Check design tokens before using custom values
- **No Inline Styles**: Avoid `style={{}}` prop, use Panda CSS instead

```tsx
// ✅ Good: Using design tokens
const styles = css({
  padding: '$large',
  color: '$text',
  backgroundColor: '$primary',
});

// ❌ Bad: Arbitrary values
const styles = css({
  padding: '13px',
  color: '#1f2937',
  backgroundColor: '#0070f3',
});
```

#### Data Fetching Style

- **GraphQL Hooks**: Use generated GraphQL hooks from `gql-tada`
- **Type Safety**: Leverage generated TypeScript types from GraphQL schema
- **Apollo Client**: Use Apollo Client for caching and state management
- **Error Handling**: Handle GraphQL errors at the component level

```tsx
// Example GraphQL usage
import { useQuery } from '@apollo/client';
import { graphql } from '~/graphql';

const MyQuery = graphql(`
  query GetPosts {
    posts {
      id
      title
    }
  }
`);

export function PostList() {
  const { data, loading, error } = useQuery(MyQuery);
  // ...
}
```

#### State Management Style

- **Zustand for Client State**: Use Zustand stores for UI state that needs to be shared
- **Apollo Cache for Server State**: Use Apollo Client cache for server data
- **Local State for Component State**: Use `useState` for component-local state
- **Minimal Global State**: Only use global state when truly needed

#### File Organization Style

- **Co-location**: Keep related files together
- **File Naming**: Use kebab-case for file names (e.g., `post-list.route.tsx`)
- **Type Definitions**: Co-locate types with components or in `/src/types`
- **Hooks**: Custom hooks in `/src/hooks` or co-located with components

```
routes/
  post-list/
    post-list.route.tsx      # Route component
    post-list.component.tsx  # Feature component (if needed)
    post-list.hook.ts        # Custom hook (if needed)
```

#### Import Style

- **Path Aliases**: Use `~/` alias for imports from `src/`
- **Absolute Imports**: Prefer absolute imports over relative imports
- **Grouped Imports**: Group imports by type (external, internal, types)

```tsx
// External dependencies
import { type ReactNode } from 'react';
import { useQuery } from '@apollo/client';

// Internal imports
import { styled } from '~/styled-system/jsx';
import { Button } from '~/components/uikit/button';

// Types
import type { Post } from '~/types';
```

### Architectural Patterns

#### Component Hierarchy

```
Route Component (TanStack Router)
  └─ Feature Component
      └─ UI Kit Components
          └─ Design System Tokens
```

#### Data Flow

```
GraphQL Query/Mutation
  └─ Apollo Client (cache, state)
      └─ React Component (hooks)
          └─ UI Kit Component (presentation)
```

#### State Flow

```
Server State: GraphQL → Apollo Cache → Component
Client State: Zustand Store → Component
Local State: useState → Component
```

### Design System Integration

The architecture is deeply integrated with the design system:

- **UI Kit Components**: Located in `/src/components/uikit/`, documented in Storybook
- **Design Tokens**: Located in `/src/styled-system/tokens/`, used throughout styling
- **Design System First**: Always check Storybook before creating new components
- **Token-First Styling**: Always check design tokens before using custom values

### Differences from Common Patterns

This architecture differs from common React patterns in several ways:

1. **Design System Primacy**: Design system components and tokens are mandatory, not optional
2. **Build-Time CSS**: Panda CSS generates CSS at build time, not runtime
3. **Type-Safe Routing**: TanStack Router provides type-safe routing with file-based configuration
4. **GraphQL Code Generation**: GraphQL types are generated, ensuring type safety from schema to component
5. **Desktop-Only**: No responsive design considerations, focused on desktop landscape layouts
6. **Co-location Over Separation**: Related code is kept together rather than separated by type

## Structure Recommendations

### Main Project Structure

- `/src/components` - React components organized by type
  - `/common` - Shared/common components
  - `/feature-flags` - Feature flag components
  - `/navigation` - Navigation components
  - `/uikit` - UI kit components (design system)
- `/src/routes` - Route components and page-level components
- `/src/graphql` - GraphQL client setup, hooks, and queries
- `/src/hooks` - Custom React hooks
- `/src/stores` - State management stores (Zustand)
- `/src/services` - Service layer (i18n, feature flags, reporting)
- `/src/utils` - Utility functions
- `/src/constants` - Constants and configuration
- `/src/types` - TypeScript type definitions
- `/src/styled-system` - Styling system configuration (Panda CSS)

### Component Organization

- **Route components**: Page-level components in `/src/routes`
- **Feature components**: Domain-specific components co-located with routes
- **UI components**: Reusable UI kit components in `/src/components/uikit`
- **Common components**: Shared components in `/src/components/common`

## Routing

### TanStack Router

The application uses [TanStack Router](https://tanstack.com/router) for type-safe, file-based routing.

#### Route Configuration

Routes are defined in `route-config.ts` using the virtual file routes pattern:

```tsx
import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

export const routeConfig = rootRoute('root.tsx', [
  layout('app', 'layout.tsx', [
    index('index.tsx'),
    route('/$workspaceId', 'workspace/workspace.route.tsx', [
      route('/posts', 'post-list/post-list.route.tsx'),
    ]),
  ]),
]);
```

#### Route Components

Route components are defined in `/src/routes` using TanStack Router's `createFileRoute`:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts')({
  component: PostListRoute,
});

function PostListRoute() {
  // Component implementation
}
```

#### Route Guards

Authentication and authorization checks are performed in route `beforeLoad` hooks:

```tsx
export const Route = createFileRoute('/posts')({
  beforeLoad: async ({ context }) => {
    if (!context.authenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: PostListRoute,
});
```

## State Management

### Zustand for Client State

Zustand is used for client-side UI state that needs to be shared across components:

```tsx
import { create } from 'zustand';

type WorkspaceStore = {
  workspaceId: string | null;
  setWorkspaceId: (id: string | null) => void;
};

export const workspaceIdStore = create<WorkspaceStore>((set) => ({
  workspaceId: null,
  setWorkspaceId: (id) => set({ workspaceId: id }),
}));
```

### Apollo Client Cache for Server State

Apollo Client manages server state through its cache. The cache is automatically updated when queries and mutations are executed.

### State Management Guidelines

- **Use Zustand** for UI state that needs to be shared (modals, sidebars, etc.)
- **Use Apollo Cache** for server data (queries, mutations)
- **Use `useState`** for component-local state
- **Minimize global state**: Only use global state when truly necessary

## GraphQL Integration

### Apollo Client Setup

Apollo Client is configured in `/src/graphql/client.ts`:

```tsx
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function setupApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: '/graphql',
    }),
  });
}
```

### GraphQL Code Generation

GraphQL queries and mutations are defined using `gql-tada` for type-safe code generation:

```tsx
import { graphql } from '~/graphql';

const GetPostsQuery = graphql(`
  query GetPosts {
    posts {
      id
      title
    }
  }
`);
```

### Using GraphQL Queries

```tsx
import { useQuery } from '@apollo/client';
import { GetPostsQuery } from './queries';

export function PostList() {
  const { data, loading, error } = useQuery(GetPostsQuery);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### GraphQL Error Handling

GraphQL errors are handled at the component level:

```tsx
const { data, error } = useQuery(MyQuery);

if (error) {
  // Handle error (display message, log, etc.)
  return <ErrorMessage error={error} />;
}
```

## Styling

### Panda CSS

The application uses [Panda CSS](https://panda-css.com/) for build-time CSS generation with design tokens.

#### Using `css()` Function

```tsx
import { css } from '~/styled-system/css';

const containerStyles = css({
  padding: '$large',
  backgroundColor: '$neutral5',
  borderRadius: '$md',
});
```

#### Using `styled()` Function

```tsx
import { styled } from '~/styled-system/jsx';

const Container = styled('div', {
  base: {
    padding: '$large',
    backgroundColor: '$neutral5',
  },
  variants: {
    size: {
      small: { padding: '$small' },
      large: { padding: '$large' },
    },
  },
});
```

#### Design Tokens

Always use design tokens instead of arbitrary values:

```tsx
// ✅ Good: Design tokens
css({ padding: '$large', color: '$text' })

// ❌ Bad: Arbitrary values
css({ padding: '13px', color: '#1f2937' })
```

### Design System Integration

- **Check Storybook** (`npm run uikit:preview`) before creating new components
- **Use UI kit components** from `/src/components/uikit/`
- **Use design tokens** from `/src/styled-system/tokens/`
- **Desktop-only**: No responsive design considerations

### React Aria and interactive components

Use UI kit components when one exists for the use case. If no UI kit component exists, use **React Aria Components** when possible so keyboard, focus, and ARIA are handled correctly:

1. **UI kit first**: Prefer components from `/src/components/uikit/` (Storybook).
2. **React Aria second**: For interactive or a11y-heavy patterns (tabs, dialogs, menus, selects, etc.), use `react-aria-components`. Check the official docs for the primitive you need (e.g. `https://react-aria.adobe.com/react-aria/components/Tabs.html` for Tabs). Use that as the reference for implementing the component in the project; style with Panda CSS and design tokens.
3. **Do not build complex a11y-heavy components from scratch** without React Aria. Prefer React Aria primitives and style with Panda rather than custom `role`/ARIA and manual key handlers.

**Covered by UI kit / React Aria today:** Buttons, Forms (TextField, Checkbox, RadioGroup), Pickers (Select, ComboBox), Overlays (Dialog, Popover, Tooltip, Menu), Tabs (use React Aria Tabs in feature components; no uikit Tabs yet). When adding **new** patterns (e.g. Switch, NumberField, SearchField, Accordion/Disclosure), prefer the corresponding React Aria primitive and style with Panda; only add a uikit wrapper if the same component is needed in many places (see “When to add to the UI kit” below).

## Component Patterns

### Component Structure

Components follow a consistent structure:

```tsx
import { type ReactNode } from 'react';
import { styled } from '~/styled-system/jsx';

type MyComponentProps = {
  title: string;
  children: ReactNode;
};

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <Container>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled('div', {
  base: {
    padding: '$large',
  },
});

const Title = styled('h2', {
  base: {
    fontSize: '$xl',
    fontWeight: '$bold',
  },
});

const Content = styled('div', {
  base: {
    marginTop: '$medium',
  },
});
```

### Composition Patterns

Build complex components by composing simpler ones:

```tsx
export function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <Title>{post.title}</Title>
      </CardHeader>
      <CardBody>
        <Text>{post.content}</Text>
      </CardBody>
      <CardFooter>
        <Button>Read more</Button>
      </CardFooter>
    </Card>
  );
}
```

### Hooks Usage

Custom hooks encapsulate reusable logic:

```tsx
// hooks/use-posts.ts
export function usePosts() {
  const { data, loading, error } = useQuery(GetPostsQuery);
  
  return {
    posts: data?.posts ?? [],
    loading,
    error,
  };
}

// Component
export function PostList() {
  const { posts, loading, error } = usePosts();
  // ...
}
```

## Error Handling

### Error Boundaries

Error boundaries catch React errors in the component tree:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return <div>Something went wrong: {error.message}</div>;
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
```

### GraphQL Error Handling

Handle GraphQL errors in components:

```tsx
const { data, error } = useQuery(MyQuery);

if (error) {
  return <ErrorMessage message={error.message} />;
}
```

### User-Facing Errors

Display user-friendly error messages:

```tsx
if (error) {
  toast.error('Failed to load posts. Please try again.');
}
```

## Performance

### Code Splitting

Use React's `lazy` and `Suspense` for code splitting:

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization

Use `useMemo` and `useCallback` to prevent unnecessary re-renders:

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Query Optimization

Optimize GraphQL queries:

- Use `fetchPolicy` to control caching
- Use `pollInterval` for real-time updates
- Use `refetch` for manual updates

## Accessibility

### ARIA Patterns

Use proper ARIA attributes:

```tsx
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  Close
</button>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```tsx
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</button>
```

### Tablists

Use **React Aria Tabs** for tab UIs so keyboard navigation, focus management, and ARIA are handled correctly:

- Use `TabList`, `Tab`, and `TabPanel` from `react-aria-components` (or the headless `useTabList` / `useTab` from `react-aria` if you need full styling control).
- Do not build tablists with custom `role="tablist"` / `role="tab"` and manual key handlers; React Aria provides arrow-key navigation, roving tabindex, Enter/Space activation, and optional type-ahead.
- Style the React Aria components with Panda CSS (e.g. `styled()` or `className`) to match the design system. The UI kit does not yet include a Tabs component; feature components may wrap React Aria Tabs and apply design tokens.

### Screen Reader Support

Use semantic HTML and ARIA labels:

```tsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/posts">Posts</a></li>
  </ul>
</nav>
```

## Internationalization

### Lingui Setup

The application uses [Lingui](https://lingui.dev/) for internationalization.

### Using Translations

```tsx
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

export function MyComponent() {
  const { t } = useLingui();
  
  return (
    <div>
      <h1>{t`Welcome`}</h1>
      <Trans>Hello, {name}!</Trans>
    </div>
  );
}
```

## Feature Flags

### Using Feature Flags

```tsx
import { isFeatureEnabled } from '~/services/feature-flags';

export function MyComponent() {
  const featureEnabled = isFeatureEnabled('feature-1');
  
  if (featureEnabled) {
    return <NewFeature />;
  }
  
  return <OldFeature />;
}
```

## Decision-Making Guidelines

### When to Create New Components

Create a new component when:
- The component represents a distinct UI element
- The component will be reused in multiple places
- The component encapsulates complex logic or state

Don't create a new component when:
- The component is only used once
- The component is a simple wrapper with no logic
- An existing UI kit component can be used instead

**When to add to the UI kit:** Do **not** create new UI kit components unless explicitly requested. Prefer **use-case-specific (feature) components** first; implement in the feature or route and style with React Aria + Panda. Generalize into the UI kit only when the same component is clearly needed in many places and the team decides to extract it. This avoids premature abstraction and keeps the UI kit focused on proven, reused building blocks.

### When to Use Stores vs Props

Use Zustand stores when:
- State needs to be shared across multiple components
- State needs to persist across route changes
- State is used in many unrelated components

Use props when:
- State is only needed in a component and its children
- State is component-local
- State can be passed down through the component tree

### When to Create New Routes

Create a new route when:
- The route represents a distinct page or view
- The route has its own URL and can be bookmarked
- The route requires its own data fetching

### When to Add to `/src/utils` vs Domain Folders

Add to `/src/utils` when:
- The utility is used across multiple domains
- The utility is generic and not domain-specific
- The utility is a pure function with no dependencies

Keep in domain folders when:
- The utility is specific to a domain
- The utility depends on domain-specific types or logic
- The utility is only used within that domain

## Common Patterns Summary

- **Component → Hook → GraphQL**: Data flows from GraphQL through hooks to components
- **Route → Component → UI component**: Route components compose feature components which use UI kit components
- **Store → Component**: Zustand stores provide shared state to components
- **Error → User feedback**: Errors are caught and displayed to users with appropriate messaging
