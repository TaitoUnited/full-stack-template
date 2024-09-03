import { describe, it, expect } from 'vitest';
import http from 'ky';

import { config } from '~/utils/config';
import { getTestDb } from '~/db/testing';

const baseUrl =
  process.env.TEST_API_URL ||
  `http://${config.API_BINDADDR}:${config.API_PORT}`;

describe('infra', () => {
  describe('infra API', () => {
    it('GET /config returns APP_VERSION', async () => {
      const response = await http
        .get(`${baseUrl}/config`)
        .json<{ data: { APP_VERSION: string } }>();

      expect(typeof response.data.APP_VERSION).toBe('string');
    });

    it('GET /healthz returns OK', async () => {
      const response = await http
        .get(`${baseUrl}/healthz`)
        .json<{ status: string }>();

      expect(response.status).toBe('OK');
    });

    it('GET /uptimez returns OK', async () => {
      const response = await http
        .get(`${baseUrl}/uptimez`)
        .json<{ status: string }>();

      expect(response.status).toBe('OK');
    });
  });

  describe('db access for integration tests', () => {
    it('Check db access', async () => {
      const db = await getTestDb();
      await db.any('SELECT 1');
    });
  });
});
