/**
 * This file is used by the GraphQL LSP to provide configuration for the editor
 * extension. It tells the extension where to find the GraphQL schema and where
 * to find the GraphQL documents (queries, mutations, etc).
 *
 * Install the extension for VSCode here:
 * https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql
 *
 * When you have the extension installed, you will start getting autocompletion
 * and type checking for your GraphQL queries and mutations. However, note that
 * this is *editor-only* validation so make sure you have setup CI validations
 * for your GraphQL queries as well eg. with gql.tada' `check` command:
 * https://gql-tada.0no.co/reference/gql-tada-cli#check
 */
export default {
  projects: {
    server: {
      schema: "./shared/schema.gql",
      documents: ["server-new/src/**/*.{graphql,js,ts,jsx,tsx}"],
    },
    client: {
      schema: "./shared/schema.gql",
      documents: ["client/src/**/*.{graphql,js,ts,jsx,tsx}"],
    },
  },
};
