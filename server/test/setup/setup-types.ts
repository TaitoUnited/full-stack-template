import { Role } from '~/src/utils/authorisation';

export type TestUser = {
  id: string;
  email: string;
  password: string;
  sessionId: string;
  role: Role;
};

export type TestData = {
  organisation: {
    id: string;
  };
  users: {
    admin: TestUser;
    manager: TestUser;
    viewer: TestUser;
  };
};

declare module 'vitest' {
  export interface ProvidedContext {
    testData: TestData;
  }
}
