-- Deploy server_template:file-collection.alter to pg
-- requires: file.table

BEGIN;

ALTER TABLE example_file ADD COLUMN collection TEXT;

COMMIT;
