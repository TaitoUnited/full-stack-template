-- Revert server_template:fileCollection.alter from pg

BEGIN;

ALTER TABLE example_file DROP COLUMN collection;

COMMIT;
