import { describe, expect, it } from 'vitest';

import { graphql, clientWithUser } from '~/test/graphql-test-client';

describe('Organisation API', () => {
  it('should return all organisations', async () => {
    const data = await clientWithUser('admin').request(
      graphql(`
        query Organisations {
          organisations {
            id
            name
          }
        }
      `)
    );

    const { organisations } = data;
    const testOrganisation = organisations?.find(
      (org) => org.id === globalThis.testData.organisation.id
    );
    expect(testOrganisation).toBeDefined();
    expect(testOrganisation?.name).toBe('API integration test organisation');
  });

  it('should return a single organisation', async () => {
    const data = await clientWithUser('admin').request(
      graphql(`
        query Organisation($id: String!) {
          organisation(id: $id) {
            id
            name
          }
        }
      `),
      { id: globalThis.testData.organisation.id }
    );

    const { organisation } = data;
    expect(organisation?.id).toBe(globalThis.testData.organisation.id);
    expect(organisation?.name).toBe('API integration test organisation');
  });
});
