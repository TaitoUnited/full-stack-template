# GraphQL

This project uses [Apollo Client](https://www.apollographql.com/docs/) for the GraphQL API and [gql.tada](https://gql-tada.0no.co/) for generating TypeScript types and enhancing the developer experience.

## Apollo Client

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. It provides a powerful and flexible API for fetching, caching, and updating data.

### Client Setup

The Apollo instance is inititiated in the [`client/src/graphql/client.ts`](/client/src/graphql/client.ts) file. This file specifies the URI of the GraphQL server and initializes the Apollo Client with the necessary configuration.

#### Example

```ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});
```

## gql.tada

gql.tada is a tool for generating TypeScript types from your GraphQL schema and operations. It provides type-safe GraphQL queries, mutations, and subscriptions, enhancing the developer experience with autocompletion and type checking.

### Integration

The gql.tada configuration is defined in the [`gql.ts`](/client/src/graphql/gql.ts) file. This file specifies the configuration, including the introspection result and custom scalars. It returns a `graphql` function that can be used to create type-safe GraphQL operations.

#### Example

```ts
import { initGraphQLTada } from 'gql.tada';
import type { myIntrospection } from './myIntrospection';

export const graphql = initGraphQLTada<{
  introspection: typeof myIntrospection;
  scalars: {
    DateTime: string;
    Json: any;
  };
}>();

const query = graphql(`
  {
    __typename
  }
`);
```

To generate the types, you can run the following command:

```bash
npm run generate:graphql
```

### Basic Usage

You can use the generated types and hooks in your components to ensure type safety and autocompletion.

```tsx
import { graphql, useQuery } from '~/graphql';

const GET_KITTENS = graphql(/* GraphQL */ `
  query GetKittens {
    kittens {
      id
      name
      breed
    }
  }
`);

const KittensComponent = () => {
  const { data, loading, error } = useQuery(GET_KITTENS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.kittens.map(kitten => (
        <li key={kitten.id}>{kitten.name}</li>
      ))}
    </ul>
  );
};
```

### Usage with Router

> To know more about the router, refer to the [Routing](./routing.md) documentation.

You can preload a query in the router and pass it to the component using the `useLoaderData` hook. This allows you to fetch the data before rendering the component, improving the performance.

```tsx
import { useReadQuery } from '~/graphql';
import { PostListQuery } from '~/graphql/post/queries';

export const Route = createFileRoute('/_app/$workspaceId/posts')({
  component: PostListRoute,
  errorComponent: () => <RouteError />,
  pendingComponent: () => <RouteSpinner />,
  loader: async ({ context }) => ({
    queryRef: context.preloadQuery(PostListQuery),
  }),
});

export default function PostListRoute() {
  const { t } = useLingui();
  const { queryRef } = Route.useLoaderData();
  const {
    data: { posts },
  } = useReadQuery(queryRef);

  ...
}
```

### VSCode Extension

To enhance the developer experience, you can use the [GraphQL extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) to get autocompletion and type checking for your GraphQL operations.

The [`graphql.config.ts`](/graphql.config.ts) file specifies the configuration for the extension, so it knows where to find the GraphQL schema and operations.

## Conclusion

By using **Apollo Client** and **gql.tada**, you can create a robust, type-safe GraphQL API and client with enhanced developer experience.
