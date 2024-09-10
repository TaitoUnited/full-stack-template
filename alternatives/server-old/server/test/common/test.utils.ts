import { promises as fs } from 'fs';
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './sdk';

export const request = axios.create({
  baseURL: `${process.env.TEST_API_URL}`,
  responseType: 'json',
});

export function createTestClient() {
  return new GraphQLClient(
    process.env.TEST_API_URL || `http://localhost:9999/api`
  );
}

export function initGraphQL() {
  const api = createTestClient();
  const sdk = getSdk(api);

  return { api, sdk };
}

export async function setUser(
  client: GraphQLClient,
  user: string | null = 'USER1'
) {
  // TODO
}

const axiosStorageParams = (
  url: string,
  headers: { key: string; value: string }[]
) => {
  // When running tests locally on Docker Compose, we need to
  // replace the localhost on upload url.
  if (process.env.TEST_ENV_REMOTE === 'false') {
    url = url.replace(
      'http://localhost:9999/',
      'http://full-stack-template-ingress:80/'
    );
    headers = headers.concat({
      key: 'Host',
      value: 'localhost:9999',
    });
  }

  return {
    url,
    headers: headers.reduce((headers, header) => {
      headers[header.key] = header.value;
      return headers;
    }, {} as Record<string, string>),
  };
};

export const downloadFromStorage = async (url: string) => {
  return await request({
    method: 'get',
    ...axiosStorageParams(url, []),
  });
};

export const uploadToStorage = async (
  url: string,
  headers: { key: string; value: string }[],
  filePath: string
) => {
  const data = await fs.readFile(filePath);
  return await request({
    method: 'put',
    data,
    ...axiosStorageParams(url, headers),
  });
};
