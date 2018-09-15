import chai from 'chai'; // eslint-disable-line
import { asCamelCase } from './format.util';

const { expect } = chai;

describe('asCamelCase', () => {
  it('object asCamelCase', () => {
    expect(
      asCamelCase({
        user_name: '',
        first_name: null,
        last_name: null,
      })
    ).to.deep.equal({
      userName: '',
      firstName: null,
      lastName: null,
    });
  });

  it('array asCamelCase', () => {
    expect(
      asCamelCase([
        {
          user_name: '',
          first_name: null,
          last_name: null,
        },
      ])
    ).to.deep.equal([
      {
        userName: '',
        firstName: null,
        lastName: null,
      },
    ]);
  });
});
