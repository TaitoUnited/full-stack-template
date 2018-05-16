-- Deploy server_template:example_file.collections to pg
-- requires: file

BEGIN;

ALTER TABLE example_file ADD COLUMN collection TEXT;

COMMIT;
