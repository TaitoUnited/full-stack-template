import axios from 'axios';
import getTestDb from './common/testDb';

const request = axios.create({
  baseURL: `${process.env.TEST_API_URL}`,
  responseType: 'json',
});

describe('infra', function infra() {
  // EXAMPLE: You can increase API timeout for slow API calls
  jest.setTimeout(5000);

  describe('infra API', () => {
    it('GET /config returns APP_VERSION', async () => {
      const response = await request.get('/config');
      expect(response.status).toBe(200);
      expect(typeof response.data.data.APP_VERSION).toBe('string');
    });

    it('GET /uptimez returns OK', async () => {
      const response = await request.get('/uptimez');
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('OK');
    });

    it('GET /healthz returns OK', async () => {
      const response = await request.get('/healthz');
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('OK');
    });
  });

  describe('db access for integration tests', () => {
    it('Check db access', async () => {
      // Disable db check on template
      // TODO: remove if clause once it works also on template
      if ('full-stack-template'.substring(1) !== 'ull-stack-template') {
        const testDb = await getTestDb();
        await testDb.any('SELECT 1');
      }
    });
  });
});
