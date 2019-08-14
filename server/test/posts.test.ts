import requestBase from 'request-promise';

const request = requestBase.defaults({
  baseUrl: `${process.env.TEST_API_URL}`,
  json: true,
  simple: false,
  resolveWithFullResponse: true,
});

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

  it('GET /posts returns some posts', async () => {
    const response = await request.get('/posts');
    expect(response.statusCode).toBe(200);
    // TODO: We should add some posts first to make sure that there
    // are some posts to retrieve. Now we can only check that it returns
    // an array.
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
