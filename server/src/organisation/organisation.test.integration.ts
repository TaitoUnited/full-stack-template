import { describe, expect, it } from 'vitest';

import { organisationService } from './organisation.service';
import { makeTestContext } from '~/test/test-utils';

describe('orgainsation service', async () => {
  it('return organisation', async () => {
    const ctx = await makeTestContext({ user: 'admin' });

    const data = await organisationService.getOrganisation(
      ctx,
      globalThis.testData.organisation.id
    );

    expect(data).toBeDefined();
    const id = data?.id;
    expect(id).toEqual(globalThis.testData.organisation.id);
  });
});
