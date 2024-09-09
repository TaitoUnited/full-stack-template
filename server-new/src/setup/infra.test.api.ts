import { describe, it, expect } from 'vitest';

import { client } from '~/test/http-test-client';

describe('infra', () => {
  describe('infra API', () => {
    it('GET /config returns APP_VERSION', async () => {
      const response = await client
        .get('config')
        .json<{ data: { APP_VERSION: string } }>();
      expect(typeof response.data.APP_VERSION).toBe('string');
    });

    it('GET /healthz returns OK', async () => {
      const response = await client.get('healthz').json<{ status: string }>();
      expect(response.status).toBe('OK');
    });

    it('GET /uptimez returns OK', async () => {
      const response = await client.get('uptimez').json<{ status: string }>();
      expect(response.status).toBe('OK');
    });
  });
});
