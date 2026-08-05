/* oxlint-disable typescript/consistent-type-definitions */

import 'lucia';

declare module 'lucia' {
  interface Register {
    DatabaseUserAttributes: {
      id: string;
    };
  }
}
