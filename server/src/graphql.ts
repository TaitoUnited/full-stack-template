import { buildSchemaSync } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { Container } from 'typedi';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { unwrapResolverError } from '@apollo/server/errors';
// import { useServer } from 'graphql-ws/lib/use/ws'; <-- Uncomment this if you need subscriptions
import depthLimit from 'graphql-depth-limit';

import { httpServer } from './http';
import config from './common/setup/config';
import authChecker from './common/setup/auth';
import { CustomValidationError } from './graphqlErrors';

// GraphQL schema
const schema = buildSchemaSync({
  resolvers: [`${process.env.PWD}/src/**/*Resolver.{ts,js}`],
  container: Container,
  authChecker: ({ context }, roles) => authChecker(context, roles),
  authMode: 'error',
  validate: {
    forbidUnknownValues: false,
  },
  emitSchemaFile:
    config.NODE_ENV === 'development' ? './shared/schema.gql' : false,
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
// const serverCleanup = useServer({ schema }, wsServer); <-- Uncomment this if you need subscriptions

// GraphQL routing
const apollo = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    // Uncomment this if you need subscriptions
    // {
    //   async serverWillStart() {
    //     return {
    //       async drainServer() {
    //         await serverCleanup.dispose();
    //       },
    //     };
    //   },
    // },
    {
      async requestDidStart() {
        return {
          async didEncounterErrors(requestContext) {
            // QUICK HACK: Apollo catches all exceptions before
            // they end up to transactionMiddleware so we need
            // to rollback transaction here.
            // TODO: Implement a custom transaction/error handler for Apollo?
            // Note: The V4 version of Apollo Server has a new error handling and logging the whole request context is spammy.

            // Go through all errors and log them:
            requestContext.errors.forEach((error) => {
              if (error.message === 'Argument Validation Error') {
                // Forcing the error to show the validation errors
                // @ts-ignore
                const originalError: ArgumentValidationError =
                  unwrapResolverError(error);

                throw new CustomValidationError(originalError.validationErrors);
              }

              console.log({
                operationName: requestContext.operationName,
                errors: {
                  message: error.message,
                  code: error.extensions?.code,
                  validationErrors: JSON.stringify(
                    error.extensions?.validationErrors
                  ),
                  path: error.path,
                  locations: JSON.stringify(error.locations),
                },
              });
            });
          },
        };
      },
    },
  ],

  introspection: ['local'].includes(config.COMMON_ENV || ''),
  formatError: (err) => {
    return {
      ...err,
      code: err.extensions?.code,
      extensions: undefined,
    };
  },
  validationRules: [depthLimit(10)],
});

export default apollo;
