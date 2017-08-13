-- Verify server_template:file.table on pg

BEGIN;

SELECT id FROM example_file WHERE FALSE;

ROLLBACK;
