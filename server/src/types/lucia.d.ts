import 'lucia';

declare module 'lucia' {
  interface Register {
    DatabaseUserAttributes: {
      id: string;
    };
  }
}
