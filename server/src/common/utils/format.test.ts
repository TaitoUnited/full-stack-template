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
    });

    it('handles whitespace', async () => {
      expect(() => toSnakeCase('some whitespace')).toThrow(
        'Whitespace not allowed'
      );
      expect(() =>
        toSnakeCase('myKeyName with some whiteSpace', false, false)
      ).toThrow('Whitespace not allowed');
      expect(
        toSnakeCase('myKeyName with some whiteSpace', false, true)
      ).toEqual('my_key_name with some white_space');
    });

    it('handles depth', async () => {
      expect(toSnakeCase('assignedUser.firstName', true)).toEqual(
        'assigned_user.first_name'
      );
      expect(toSnakeCase('assignedUser_firstName', true)).toEqual(
        'assigned_user.first_name'
      );
      expect(toSnakeCase('assignedUser.firstName')).toEqual(
        'assigned_user.first_name'
      );
      expect(toSnakeCase('assignedUser_firstName')).toEqual(
        'assigned_user_first_name'
      );
    });

    it('handles ref_ prefix', async () => {
      expect(toSnakeCase('ref_assignedUser_firstName', true)).toEqual(
        'assigned_user.first_name'
      );
    });
  });

  describe('#toSnakeCaseArray', () => {
    it('works', async () => {
      expect(
        toSnakeCaseArray(['colName', 'col_name', 'colname'], true)
      ).toEqual(['col_name', 'col.name', 'colname']);
    });
  });

  describe('#keysAsSnakeCaseArray', () => {
    it('works', async () => {
      const obj = {
        colName: 'asdf',
        col_name: 'wefef',
        colname: 'asdf',
      };
      expect(keysAsSnakeCaseArray(obj, true)).toEqual([
        'col_name',
        'col.name',
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
