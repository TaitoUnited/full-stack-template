-- Revert server_template:example_file from pg

BEGIN;

DROP TABLE example_file;

COMMIT;
