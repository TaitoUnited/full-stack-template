import {
  toSnakeCase,
  trimGaps,
  toSnakeCaseArray,
  keysAsSnakeCaseArray,
} from './format';

describe('format.ts', () => {
  describe('#toSnakeCase', () => {
    it('works', async () => {
      expect(toSnakeCase('myKeyName')).toEqual('my_key_name');
      expect(toSnakeCase('name')).toEqual('name');
      expect(() => toSnakeCase('some whitespace')).toThrow(
        'Invalid whitespace'
      );
      expect(toSnakeCase('myKeyName with some whiteSpace', true)).toEqual(
        'my_key_name with some white_space'
      );
      expect(() =>
        toSnakeCase('myKeyName with some whiteSpace', false)
      ).toThrow('Invalid whitespace');
    });
  });

  describe('#toSnakeCaseArray', () => {
    it('works', async () => {
      expect(toSnakeCaseArray(['colName', 'col_name', 'colname'])).toEqual([
        'col_name',
        'col_name',
        'colname',
      ]);
    });
  });

  describe('#keysAsSnakeCaseArray', () => {
    it('works', async () => {
      const obj = {
        colName: 'asdf',
        col_name: 'wefef',
        colname: 'asdf',
      };
      expect(keysAsSnakeCaseArray(obj)).toEqual([
        'col_name',
        'col_name',
        'colname',
      ]);
    });
  });

  describe('#trimGaps', () => {
    it('works', async () => {
      expect(trimGaps('  word1\n\n  word2  word3\n')).toEqual(
        'word1 word2 word3'
      );
    });
  });
});
