import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './sdk';

export const request = axios.create({
  baseURL: `${process.env.TEST_API_URL}`,
  responseType: 'json',
});

export function createTestClient() {
  return new GraphQLClient(
    process.env.TEST_API_URL || `http://localhost:9999/api`
  );
}

export function initGraphQL() {
  const api = createTestClient();
  const sdk = getSdk(api);

  return { api, sdk };
}

export async function setUser(
  client: GraphQLClient,
  user: string | null = 'USER1'
) {
  // TODO
}
