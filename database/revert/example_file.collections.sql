-- Revert server_template:example_file.collections from pg

BEGIN;

ALTER TABLE example_file DROP COLUMN collection;

COMMIT;
