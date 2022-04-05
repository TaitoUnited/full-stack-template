-- Deploy full-stack-template:lifecycle_status_enum to pg

BEGIN;

CREATE TYPE lifecycle_status AS ENUM (
  'INITIALIZED',
  'CREATED',
  'DELETED'
);

COMMIT;
