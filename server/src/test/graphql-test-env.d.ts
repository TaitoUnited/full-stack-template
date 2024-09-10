/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'Float': unknown;
    'ID': unknown;
    'Int': unknown;
    'LoginResponse': { kind: 'OBJECT'; name: 'LoginResponse'; fields: { 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'LoginTokenResponse': { kind: 'OBJECT'; name: 'LoginTokenResponse'; fields: { 'sessionId': { name: 'sessionId'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'LogoutResponse': { kind: 'OBJECT'; name: 'LogoutResponse'; fields: { 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'LogoutTokenResponse': { kind: 'OBJECT'; name: 'LogoutTokenResponse'; fields: { 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Message': { kind: 'OBJECT'; name: 'Message'; fields: { 'author': { name: 'author'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'authorId': { name: 'authorId'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'authorType': { name: 'authorType'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'content': { name: 'content'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; }; };
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'createPost': { name: 'createPost'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Post'; ofType: null; }; } }; 'login': { name: 'login'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LoginResponse'; ofType: null; }; } }; 'loginToken': { name: 'loginToken'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LoginTokenResponse'; ofType: null; }; } }; 'logout': { name: 'logout'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LogoutResponse'; ofType: null; }; } }; 'logoutToken': { name: 'logoutToken'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LogoutTokenResponse'; ofType: null; }; } }; }; };
    'Organisation': { kind: 'OBJECT'; name: 'Organisation'; fields: { 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Post': { kind: 'OBJECT'; name: 'Post'; fields: { 'author': { name: 'author'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'authorId': { name: 'authorId'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'content': { name: 'content'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'title': { name: 'title'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'chat': { name: 'chat'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Message'; ofType: null; }; }; }; } }; 'me': { name: 'me'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'organisation': { name: 'organisation'; type: { kind: 'OBJECT'; name: 'Organisation'; ofType: null; } }; 'organisations': { name: 'organisations'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Organisation'; ofType: null; }; }; } }; 'post': { name: 'post'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'posts': { name: 'posts'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Post'; ofType: null; }; }; }; } }; 'user': { name: 'user'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'users': { name: 'users'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; }; }; } }; }; };
    'String': unknown;
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'email': { name: 'email'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: 'Mutation';
  subscription: never;
  types: introspection_types;
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}