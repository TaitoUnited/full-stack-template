import { request, initGraphQL } from './common/test.utils';
const { sdk } = initGraphQL();

describe('posts', () => {
  beforeAll(async () => {
    // Nothing to do. Just an example.
    expect(true).toBe(true);
  });

  afterAll(async () => {
    // Nothing to do. Just an example.
    expect(true).toBe(true);
  });

  beforeEach(async () => {
    // Nothing to do. Just an example.
    expect(true).toBe(true);
  });

  it('mutation "createPost" creates a new post', async () => {
    const post = {
      subject: 'test subject',
      content: 'test content',
      author: 'test author',
    };

    const response = await sdk.createPost(post);
    expect({ ...response.createPost, id: undefined }).toEqual(post);

    const response2 = await sdk.getPost({ id: response.createPost.id });
    expect({ ...response2.posts[0], id: undefined }).toEqual(post);
  });

  it('query "posts" returns some posts', async () => {
    const response = await sdk.getPosts();
    const posts = response.posts;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it('GET /posts returns some posts', async () => {
    const response = await request.get('/posts');
    expect(response.status).toBe(200);

    const posts = response.data.data;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });
});
