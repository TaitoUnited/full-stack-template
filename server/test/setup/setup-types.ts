export type TestUser = {
  id: string;
  email: string;
  sessionId: string;
};

export type TestData = {
  organisation: {
    id: string;
  };
  users: {
    admin: TestUser;
    manager: TestUser;
    viewer: TestUser;
    unassigned: TestUser;
  };
};

declare module 'vitest' {
  // oxlint-disable-next-line typescript/consistent-type-definitions
  export interface ProvidedContext {
    testData: TestData;
  }
}
