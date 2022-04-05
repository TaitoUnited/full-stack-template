import axios from 'axios';
import { AttachmentUploadRequestDetails } from '../common/sdk';
import {
  initGraphQL,
  setUser,
  downloadFromStorage,
  uploadToStorage,
} from '../common/test.utils';
import { postId } from './data';

const { api, sdk } = initGraphQL();
const request = axios.create();

beforeAll(async () => {
  await setUser(api);
});

let createdAttachment: AttachmentUploadRequestDetails | null = null;

describe('postAttachment mutations', () => {
  beforeEach(async () => {
    // Create a new post attachment before each test
    const createResponse = await sdk.createPostAttachment({
      input: {
        postId,
        contentType: 'image/jpeg',
        filename: 'test.jpg',
        title: 'This is title',
        description: 'This is description',
      },
    });
    createdAttachment = createResponse.createPostAttachment;
    // Also finalize it to make it visible
    const finalizeResponse = await sdk.finalizePostAttachment({
      input: { id: createdAttachment!.id, postId },
    });
  });

  afterEach(async () => {
    // Delete created post attachment after each test
    if (createdAttachment?.id) {
      await sdk.deletePostAttachment({
        input: { id: createdAttachment!.id, postId },
      });
    }
  });

  it('post attachment file upload and download works ok', async () => {
    // Upload file content directly to storage bucket with HTTP PUT
    // using the url and headers given by the server.
    const uploadResponse = await uploadToStorage(
      createdAttachment!.url,
      createdAttachment!.headers,
      './test/common/test.jpg'
    );
    expect(uploadResponse.status).toBe(200);

    // Notify server that the upload was successful.
    const finalizeResponse = await sdk.finalizePostAttachment({
      input: { id: createdAttachment!.id, postId },
    });

    // Read attachment details to get the download url
    const readResponse = await sdk.postAttachment({
      input: {
        id: createdAttachment!.id,
        postId,
      },
    });

    // Check that download works ok
    const downloadResponse = await downloadFromStorage(
      readResponse.postAttachment!.fileUrl!
    );
    expect(downloadResponse.status).toBe(200);
  });

  it('mutation "update" works ok', async () => {
    // Update attachment details
    const updateResponse = await sdk.updatePostAttachment({
      input: {
        id: createdAttachment!.id,
        postId,
        title: 'New title',
        description: 'New description',
      },
    });

    // Check that attachment details have been updated
    const readResponse = await sdk.postAttachment({
      input: {
        id: createdAttachment!.id,
        postId,
      },
    });
    expect(readResponse.postAttachment).toMatchObject({
      title: 'New title',
      description: 'New description',
    });
  });
});
