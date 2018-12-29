# Server (API)

## Structure

Implementation is split in loosely coupled parts (content, management, ...)
and common functionality shared between them are placed in the `src/common`
directory. Furthermore, each of these may be further split into subparts that
share a common directory between them (`src/PART/common`).

For more info see the [code structure](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/b-code-structure.md) appendix of taito-cli tutorial.

## Responsibilities

Responsibilities of a route:
- Routes http request paths to correct service methods.
- Gets data from http request and gives it to service methods as parameters.
- Does some http response formatting if necessary.
- Http-based route can easily be replaced with a message-based implementation,
  that communicates through a message queue instead direct http connection.

Responsibilities of a service:
- Authorizes that the user has a right to execute the operation with the given
  parameters.
- Validates the given parameters in the context of the operation.
  NOTE: schema validation is usually implemented in middleware, not in service.
- Executes the operation with the help of fine-grained DAOs and other services.
- Should not operate on http request and http response directly
  (allowed only in special circumstances).
- Throws an exception in case of an error. Exceptions are converted to http
  status responses in middleware, not in service.

Responsibilities of a DAO (db):
- Executes a database operation with the given parameters.
- Executes the database operation in the context of current transaction
  if transaction is present.
- Provides a set of fine-grained methods that services use to execute
  database operations.
- Each DAO should be responsible for only a small set of database tables
  (e.g 1-3). Create separate DAOs for such cases that a large
  multitable join is required (e.g. for searching and reporting).
- Consider using an ORM if your application is write-heavy (complex
  transactions that write to a large set of tables during the same transaction).

> In a very small and simple implementation you may combine route, service
and dao responsibilities into one class, but most implementations are not that
small and simple.
