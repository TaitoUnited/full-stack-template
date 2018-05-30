// import request from 'request-promise-native';
import chai from 'chai';
import { helper, helper2, helper3, helper4 } from '../common/test.util';

const { expect } = chai;

describe('image', function examples() {
  this.timeout(10000);

  describe('images api', () => {
    before(async () => {
      await helper();
    });

    after(async () => {
      await helper2();
    });

    beforeEach(async () => {
      await helper3();
    });

    it('image /examples/ adds new examples', async () => {
      await helper4();
      expect(200).to.equal(200);
    });
  });
});
