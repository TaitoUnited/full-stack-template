/* eslint-disable @typescript-eslint/camelcase */
import { asCamelCase } from './formatters';

describe('formatters', () => {
  describe('#asCamelCase', () => {
    it('converts an object to camel case', async () => {
      expect(
        asCamelCase({
          first_name: 'John',
          last_name: 'Doe',
        })
      ).toEqual({
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('converts an array of objects to camel case', async () => {
      expect(
        asCamelCase([
          {
            first_name: 'Matt',
          },
          {
            first_name: 'Susan',
          },
        ])
      ).toEqual([
        {
          firstName: 'Matt',
        },
        {
          firstName: 'Susan',
        },
      ]);
    });
  });
});
