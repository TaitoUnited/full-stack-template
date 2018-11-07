import requestBase from 'request-promise-native';
import { expect } from 'chai';

const request = requestBase.defaults({
  baseUrl: `${process.env.TEST_API_URL}`,
  json: true,
});

describe('infra', function infra() {
  this.timeout(10000);

  describe('infra api', () => {
    before(async () => {
      // Nothing to do. Just an example.
      expect(true).to.equal(true);
    });

    after(async () => {
      // Nothing to do. Just an example.
      expect(true).to.equal(true);
    });

    beforeEach(async () => {
      // Nothing to do. Just an example.
      expect(true).to.equal(true);
    });

    it('GET /config', async () => {
      await request.get('/config');
    });

    it('GET /uptimez', async () => {
      const response = await request.get('/uptimez');
      expect(response.status).to.equal('OK');
    });

    it('GET /healthz', async () => {
      const response = await request.get('/healthz');
      expect(response.status).to.equal('OK');
    });
  });
});
