import { test as base, expect } from '@playwright/test';

type Organisation = {
  id: string;
  name: string;
};

type Post = {
  content: string;
  title: string;
};

/**
 * How to pass needed variables by fixtures
 */
const test = base.extend<{ organisation: Organisation }>({
  organisation: async ({ request }, use) => {
    const res = await request.get('/api/organisations');

    const organisations: unknown = await res.json();
    const organisation = getFirstOrganisation(organisations);

    await use(organisation);
  },
});

test.describe('Posts', () => {
  test('should submit new post', async ({ request, page, organisation }) => {
    await page.goto('/');
    await page.getByTestId('navigate-to-blog').click();
    const random = Math.floor(Math.random() * 100000000);

    await page.getByTestId('post-create-link').click();

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
    const posts: unknown = await req.json();
    // TODO: fragile if two browsers manage to submit posts right after each other
    const post = getFirstPost(posts);
    expect(post).toHaveProperty('title', `subject-${random}`);
    expect(post).toHaveProperty('content', `content-${random}`);

    // TODO: delete post or wipe db
  });
});

function getFirstOrganisation(value: unknown): Organisation {
  const [organisation] = getArray(value, 'organisations');

  if (!isOrganisation(organisation)) {
    throw new Error('Organisations response does not contain an organisation.');
  }

  return organisation;
}

function getFirstPost(value: unknown): Post {
  const [post] = getArray(value, 'posts');

  if (!isPost(post)) {
    throw new Error('Posts response does not contain a post.');
  }

  return post;
}

function getArray(value: unknown, responseName: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${responseName} response is not an array.`);
  }

  return value;
}

function isOrganisation(value: unknown): value is Organisation {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  );
}

function isPost(value: unknown): value is Post {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.content === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
