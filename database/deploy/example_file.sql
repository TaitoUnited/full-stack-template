-- Deploy server_template:example_file to pg
-- requires: schema

BEGIN;

CREATE TABLE example_file (
  created               TIMESTAMP  WITHOUT TIME ZONE NOT NULL DEFAULT (now() at time zone 'utc'),
  modified              TIMESTAMP  WITHOUT TIME ZONE NOT NULL DEFAULT (now() at time zone 'utc'),
  id                    UUID       NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT       NOT NULL,
  description           TEXT       NOT NULL
);

COMMIT;
