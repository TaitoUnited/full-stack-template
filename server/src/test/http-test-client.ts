import ky from 'ky';

import { config } from '~/utils/config';

const prefixUrl =
  process.env.TEST_API_URL ||
  `http://${config.API_BINDADDR}:${config.API_PORT}`;

export const client = ky.create({ prefixUrl });
