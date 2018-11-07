import chai from 'chai'; // eslint-disable-line
import { dummy } from './format.util';

const { expect } = chai;

describe('dummy', () => {
  it('dummy', () => {
    expect(
      dummy({
        foobar: '',
      })
    ).to.deep.equal({
      foobar: '',
    });
  });
});
