import { range } from './number';

describe('Number utils', () => {
  describe('range', () => {
    it('3 returns [0 ... 2]', () => {
      expect(range(3)).toEqual([0, 1, 2]);
    });
  });
});
