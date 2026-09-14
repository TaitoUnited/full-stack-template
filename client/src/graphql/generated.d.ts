/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'Date': unknown;
    'LoginResponse': { kind: 'OBJECT'; name: 'LoginResponse'; fields: { 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'LoginTokenResponse': { kind: 'OBJECT'; name: 'LoginTokenResponse'; fields: { 'sessionId': { name: 'sessionId'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'LogoutResponse': { kind: 'OBJECT'; name: 'LogoutResponse'; fields: { 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'LogoutTokenResponse': { kind: 'OBJECT'; name: 'LogoutTokenResponse'; fields: { 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'login': { name: 'login'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LoginResponse'; ofType: null; }; } }; 'loginToken': { name: 'loginToken'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LoginTokenResponse'; ofType: null; }; } }; 'logout': { name: 'logout'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LogoutResponse'; ofType: null; }; } }; 'logoutToken': { name: 'logoutToken'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LogoutTokenResponse'; ofType: null; }; } }; }; };
    'Organisation': { kind: 'OBJECT'; name: 'Organisation'; fields: { 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'me': { name: 'me'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'organisation': { name: 'organisation'; type: { kind: 'OBJECT'; name: 'Organisation'; ofType: null; } }; 'organisations': { name: 'organisations'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Organisation'; ofType: null; }; }; } }; }; };
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