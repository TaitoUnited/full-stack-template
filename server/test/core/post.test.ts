import { Order } from '../../src/common/types/search';
import { initGraphQL, setUser } from '../common/test.utils';

const { api, sdk } = initGraphQL();

const defaultUuid = '00a67f95-5ea9-41b8-a4f8-110f53c54727';

beforeAll(async () => {
  await setUser(api);
});

describe('post/queries', () => {
  it('query "posts" returns some posts', async () => {
    const { posts } = await sdk.posts({
      pagination: { offset: 0, limit: 10 },
      filterGroups: [],
      order: { field: 'createdAt' },
      search: '',
    });
    expect(posts.data.length).toBeGreaterThan(0);

    const id = posts.data[0].id;
    const { post } = await sdk.post({
      id,
    });
    expect(post?.id).toEqual(id);
  });
});

let id = '';
const postValues = {
  subject: 'subject',
  content: 'content',
  author: 'author',
};

const createPostParams = {
  ...postValues,
};

describe('post/mutations', () => {
  beforeEach(async () => {
    const createResponse = await sdk.createPost({
      input: createPostParams,
    });
    id = createResponse.createPost.id;
  });

  afterEach(async () => {
    if (id) {
      await sdk.deletePost({
        input: { id },
      });
    }
  });

  it('mutation "create" works ok', async () => {
    const { post } = await sdk.post({
      id,
    });
    expect(post).toMatchObject(postValues);
  });

  it('mutation "update" works ok', async () => {
    const updatePostParams = {
      id,
      subject: 'subject2',
      content: 'content2',
      author: 'author2',
    };

    await sdk.updatePost({
      input: updatePostParams,
    });
    const { post } = await sdk.post({
      id,
    });

    expect(post).toMatchObject(updatePostParams);
  });

  it('mutations "delete" works ok', async () => {
    const { deletePost } = await sdk.deletePost({
      input: { id },
    });
    expect(deletePost.id).toEqual(id);

    expect(async () => {
      await sdk.post({ id });
    }).toThrowError(`Post not found with id ${id}`);

    id = '';
  });
});
