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
  introspection: ['local', 'dev', 'test'].includes(config.COMMON_ENV || ''),
  playground: ['local', 'dev', 'test'].includes(config.COMMON_ENV || '')
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
