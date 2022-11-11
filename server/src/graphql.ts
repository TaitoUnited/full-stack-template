import { buildSchemaSync } from 'type-graphql';
import { ApolloServer } from 'apollo-server-koa';
import { Container } from 'typedi';
import config from './common/setup/config';
import log from './common/setup/log';
import authChecker from './common/setup/auth';

// GraphQL schema
const schema = buildSchemaSync({
  resolvers: [`${process.env.PWD}/src/**/*Resolver.{ts,js}`],
  container: Container,
  authChecker: ({ context }, roles) => authChecker(context, roles),
  authMode: 'null',
  validate: true,
  emitSchemaFile:
    config.NODE_ENV === 'development' ? './shared/schema.gql' : false,
});

// GraphQL routing
const apollo = new ApolloServer({
  schema,
  context: ({ ctx, connection }) => {
    if (ctx) {
      return ctx;
    }
    return connection.context;
  },
  plugins: [
    {
      requestDidStart() {
        return {
          async didEncounterErrors(requestContext) {
            // QUICK HACK: Apollo catches all exceptions before
            // they end up to transactionMiddleware so we need
            // to rollback transaction here.
            // TODO: Implement a custom transaction/error handler for Apollo?
            const { tx } = requestContext.context.state;
            if (tx) await tx.query('ROLLBACK');
          },
        };
      },
    },
  ],
  introspection: config.API_DOCS_ENABLED || config.API_PLAYGROUND_ENABLED,
  playground: config.API_PLAYGROUND_ENABLED
    ? {
        endpoint: config.BASE_PATH,
        settings: {
          'request.credentials': 'include',
        },
      }
    : false,
  formatError: (err) => {
    log.error(err);

    return {
      ...err,
      code: err.extensions?.code,
      extensions: undefined,
    };
  },
});

export default apollo;
