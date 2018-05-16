-- Verify server_template:example_file on pg

BEGIN;

SELECT id FROM example_file WHERE FALSE;

ROLLBACK;
