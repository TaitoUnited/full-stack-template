import { test as base, expect } from '@playwright/test';

/**
 * How to pass needed variables by fixtures
 */
const test = base.extend<{ organisation: { id: string; name: string } }>({
  organisation: async ({ request }, use) => {
    const res = await request.get('http://localhost:9999/api/organisations');

    const orgs = await res.json();

    await use(orgs[0]);
  },
});

test.describe('Posts', () => {
  test('should submit new post', async ({ request, page, organisation }) => {
    await page.goto('/blog');
    const random = Math.floor(Math.random() * 100000000);

    await page.getByRole('button', { name: 'New post' }).click();

    await page.getByLabel('Title').fill(`subject-${random}`);
    await page.getByLabel('Content').fill(`content-${random}`);
    await page.getByTestId('submit-post').click();

    // Assert that new post has appeared
    await expect(page.getByTestId('post-list')).toContainText(
      `subject-${random}`
    );

    // Assert: API call example
    // TODO: Add GraphQL example and fix graphql cors
    // TODO: Move org id to extraHTTPHeaders if possible
    const req = await request.get('/api/posts?offset=0&limit=20', {
      headers: {
        'x-organisation-id': organisation.id,
      },
    });
    const res = await req.json();
    // TODO: fragile if two browsers manage to submit posts right after each other
    const post = res.at(0);
    expect(post).toHaveProperty('title', `subject-${random}`);
    expect(post).toHaveProperty('content', `content-${random}`);

    // TODO: delete post or wipe db
  });
});
