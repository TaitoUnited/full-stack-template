import { describe, expect } from 'vitest';

import { organisationService } from './organisation.service';
import { test } from '~/test/setup/db-fixture';
import { makeTestContext } from '~/test/test-utils';

describe('organisation service', () => {
  test('returns organisation', async ({ db }) => {
    const ctx = makeTestContext({ db, user: 'admin' });

    const data = await organisationService.getOrganisation(
      ctx,
      globalThis.testData.organisation.id
    );

    expect(data).toBeDefined();
    const id = data?.id;
    expect(id).toEqual(globalThis.testData.organisation.id);
  });
});
