import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import getTestConfig from './test.config';
import { getSdk } from './sdk';

export const request = axios.create({
  baseURL: `${process.env.TEST_API_URL}`,
  responseType: 'json',
});

export function createTestClient() {
  const client = new GraphQLClient(
    process.env.TEST_API_URL || `http://localhost:9999/api`
  );
  return client;
}

export function initGraphQL() {
  const api = createTestClient();
  const sdk = getSdk(api);

  return { api, sdk };
}

// https://auth0.com/docs/authorization/flows/call-your-api-using-resource-owner-password-flow
export async function getAccessToken(username: string, password: string) {
  const config = await getTestConfig();
  const response = await axios.post(
    `https://${config.AUTH0_DOMAIN}/oauth/token`,
    {
      audience: config.AUTH0_AUDIENCE,
      client_id: config.AUTH0_TEST_CLIENT_ID,
      client_secret: config.AUTH0_TEST_CLIENT_SECRET,
      grant_type: 'password',
      scope: 'openid',
      username,
      password,
    }
  );
  return response.data.access_token;
}

export async function setUser(
  client: GraphQLClient,
  user: string | null = 'USER1'
) {
  const config = await getTestConfig();

  let token = null;
  if (user) {
    token = await getAccessToken(
      config[`TEST_${user}_USERNAME`],
      config[`TEST_${user}_PASSWORD`]
    );
  }
  client.setHeader('authorization', token ? `Bearer ${token}` : '');
}
