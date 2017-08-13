-- Deploy server_template:user.table to pg
-- requires: app.schema

BEGIN;

CREATE TABLE example_user (
  created               TIMESTAMP  WITHOUT TIME ZONE NOT NULL DEFAULT (now() at time zone 'utc'),
  modified              TIMESTAMP  WITHOUT TIME ZONE NOT NULL DEFAULT (now() at time zone 'utc'),
  id                    UUID       NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  username              TEXT       NOT NULL,
  email                 TEXT       NOT NULL
);

COMMIT;
