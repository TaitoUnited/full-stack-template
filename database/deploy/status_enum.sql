-- Deploy full-stack-template:status_enum to pg

BEGIN;

CREATE TYPE status AS ENUM (
  'created',
  'deleted'
);

COMMIT;
