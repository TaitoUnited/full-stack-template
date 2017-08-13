-- Verify server_template:file-collection.alter on pg

BEGIN;

SELECT collection FROM example_file WHERE FALSE;

ROLLBACK;
