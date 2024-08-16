import { test, expect } from '@playwright/test';

test.describe('Posts', () => {
  test.beforeEach(async ({ request, page }) => {
    // REST API call example
    // TODO: Add GraphQL example
    const req = await request.post('/api/posts?offset=0&limit=1');

    const res = await req.json();

    // Do something with data res.data.at(0) == First post

    // TODO: This example was in cypress tests, might be possible in playwright too
    // Database call example
    // NOTE: Prefer API calls.
    // cy.task('sql', 'select * from post limit 1').then(data => {
    //   cy.log(JSON.stringify(data));
    // });

    // Navigate to posts and clear the form
    await page.goto('/');
    await page.getByTestId('navigate-to-blog').click();
    await page.getByTestId('navigate-to-create-post').click();
    await page.getByLabel('Subject').clear();
    await page.getByLabel('Author').clear();
    await page.getByLabel('Content').clear({ force: true });
  });

  test('Submits a new post', async ({ request, page }) => {
    const random = Math.floor(Math.random() * 100000000);

    await page.getByLabel('Subject').fill(`subject-${random}`);
    await page.getByLabel('Author').fill(`author-${random}`);
    await page.getByLabel('Content').fill(`content-${random}`);
    await page.getByTestId('submit-post').click();

    // Assert
    await expect(page.getByTestId('post-list')).toContainText(
      `subject-${random}`
    );

    // Assert: API call example
    // TODO: Add GraphQL example
    const req = await request.get('/api/posts?offset=0&limit=20');
    const res = await req.json();
    const post = res.data.at(0);
    expect(post).toHaveProperty('subject', `subject-${random}`);
    expect(post).toHaveProperty('author', `author-${random}`);
    expect(post).toHaveProperty('content', `content-${random}`);
  });
});
