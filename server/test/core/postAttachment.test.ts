import axios from 'axios';
import { initGraphQL, setUser, upload } from '../common/test.utils';
import { postId } from './data';

const { api, sdk } = initGraphQL();
const request = axios.create();

beforeAll(async () => {
  await setUser(api);
});

describe('postAttachment mutations', () => {
  it('mutations "create" and "delete" work ok', async () => {
    // Create a new post attachment
    const createResponse = await sdk.createPostAttachment({
      input: {
        postId,
        contentType: 'image/jpeg',
        filename: 'test.jpg',
      },
    });
    const { id } = createResponse.createPostAttachment;

    // Upload file content directly to storage bucket with HTTP PUT
    // using the url and headers given by the server.
    let { url, headers } = createResponse.createPostAttachment;
    const response = await upload(url, headers, './test/common/test.jpg');
    expect(response.status).toBe(200);

    // Notify server that the upload was successful.
    const finalizeResponse = await sdk.finalizePostAttachment({
      input: { id, postId },
    });

    // Delete post attachment
    await sdk.deletePostAttachment({
      input: { id, postId },
    });
  });
});
