import { describe, expect, it } from 'vitest';

import { client, graphql } from '~/test/graphql-test-client';

describe('Session API', () => {
  it('allows a user without an organisation membership to log in', async () => {
    const { login } = await client.request(
      graphql(`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            status
          }
        }
      `),
      {
        email: globalThis.testData.users.unassigned.email,
        password: 'server-test-password',
      }
    );

    expect(login.status).toBe('OK');
  });
});
