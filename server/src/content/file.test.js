import requestBase from 'request-promise-native';
import { expect } from 'chai';

const request = requestBase.defaults({
  baseUrl: `${process.env.TEST_API_URL}`,
  json: true,
});

describe('file', function examples() {
  this.timeout(10000);

  describe('files api', () => {
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

    it('GET /files', async () => {
      await request.get('/files?offset=0&limit=10');
      expect(true).to.equal(true);
    });
  });
});
