-- Revert server_template:file-collection.alter from pg

BEGIN;

ALTER TABLE example_file DROP COLUMN collection;

COMMIT;
