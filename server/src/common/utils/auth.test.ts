import { Context } from 'koa';
import authChecker from './auth';

describe('auth', () => {
  describe('#authChecker', () => {
    it('unimplemented authChecker always returns true', async () => {
      // @ts-ignore
      const context: Context = {};
      // TODO: enable this
      // expect(authChecker(context, [])).toEqual(true);
    });
  });
});
