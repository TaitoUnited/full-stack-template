-- Revert server_template:file.table from pg

BEGIN;

DROP TABLE example_file;

COMMIT;
