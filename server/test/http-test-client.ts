/* oxlint-disable node/no-process-env */

import ky from 'ky';

import { config } from '~/src/utils/config';

const baseUrl = process.env.TEST_BASE_URL
  ? `${process.env.TEST_BASE_URL}/api`
  : `http://${config.API_BINDADDR}:${config.API_PORT}`;

export const client = ky.create({ baseUrl });
