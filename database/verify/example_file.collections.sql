-- Verify server_template:example_file.collections on pg

BEGIN;

SELECT collection FROM example_file WHERE FALSE;

ROLLBACK;
