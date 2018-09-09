import requestBase from 'request-promise-native';
import { expect } from 'chai';
import db from '../common/db.util';

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

    it('GET /infra/config', async () => {
      await request.get('/infra/config');
    });

    it('GET /infra/uptimez', async () => {
      const response = await request.get('/infra/uptimez');
      expect(response.status).to.equal('OK');
    });

    it('GET /infra/healthz', async () => {
      const response = await request.get('/infra/healthz');
      expect(response.status).to.equal('OK');
    });
  });

  describe('db access for integration tests', () => {
    it('Check db access', async () => {
      await db.any('SELECT 1');
    });
  });
});
