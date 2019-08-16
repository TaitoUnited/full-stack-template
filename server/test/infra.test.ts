import requestBase from 'request-promise';
import testDb from './common/testDb';

const request = requestBase.defaults({
  baseUrl: `${process.env.TEST_API_URL}`,
  json: true,
  simple: false,
  resolveWithFullResponse: true,
});

describe('infra', function infra() {
  // EXAMPLE: You can increase API timeout for slow API calls
  jest.setTimeout(5000);

  describe('infra API', () => {
    it('GET /config returns APP_VERSION', async () => {
      const response = await request.get('/config');
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data.APP_VERSION).toBe('string');
    });

    it('GET /uptimez returns OK', async () => {
      const response = await request.get('/uptimez');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('OK');
    });

    it('GET /healthz returns OK', async () => {
      const response = await request.get('/healthz');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('db access for integration tests', () => {
    it('Check db access', async () => {
      await testDb.any('SELECT 1');
    });
  });
});
