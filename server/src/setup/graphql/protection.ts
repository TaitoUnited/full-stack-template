import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
  // Don't allow queries that are too deep
  maxDepth: {
    enabled: true,
    n: 10,
  },
  // GraphQL can leak the schema by suggesting fields for typos etc.
  blockFieldSuggestion: {
    enabled: true,
  },
  // Apply a simple cost analysis algorithm to your GraphQL operation
  costLimit: {
    enabled: true,
    maxCost: 5000,
    objectCost: 2,
    scalarCost: 1,
    depthCostFactor: 1.5,
    ignoreIntrospection: true,
  },
  // Prevent overloading the server by aliasing operations
  maxAliases: {
    enabled: true,
    n: 5,
  },
  // Prevent overuse of directives like @skip and @limit
  maxDirectives: {
    enabled: true,
    n: 1,
  },
});

export const protection = armor.protect();
