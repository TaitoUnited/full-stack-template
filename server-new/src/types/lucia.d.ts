import { Lucia } from 'lucia';

declare module 'lucia' {
  interface Register {
    Lucia: Lucia<DatabaseSessionAttributes, DatabaseUserAttributes>;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface DatabaseSessionAttributes {
    organisationId: string;
  }
  interface DatabaseUserAttributes {
    id: string;
  }
}
