import { initGraphQL } from '../common/test.utils';
import { userId } from './data';

const { sdk } = initGraphQL();

describe('user', () => {
  it('query "users" returns some users', async () => {
    const response = await sdk.users({
      pagination: { offset: 0, limit: 10 },
    });
    const users = response.users.data;
    expect(users.length).toBeGreaterThan(0);
  });

  it('query "user" return a user', async () => {
    const response = await sdk.user({
      id: userId,
    });
    const user = response.user;
    if (user) {
      expect(user.id).toEqual(userId);
    } else {
      expect(true).toBe(false);
    }
  });
});

describe('user mutations', () => {
  it('mutation "update" works ok', async () => {
    const readResponse1 = await sdk.user({
      id: userId,
    });

    const editedName = 'test';

    const updateUserParams = {
      id: userId,
      firstName: editedName,
    };
    await sdk.updateUser({
      input: updateUserParams,
    });
    const readResponse2 = await sdk.user({
      id: userId,
    });
    expect({
      ...readResponse2.user,
      firstName: editedName,
      updatedAt: undefined,
      createdAt: undefined,
    }).toEqual({
      ...readResponse1.user,
      ...updateUserParams,
      updatedAt: undefined,
      createdAt: undefined,
    });
  });
});
