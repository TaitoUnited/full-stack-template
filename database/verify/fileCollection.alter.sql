-- Verify server_template:fileCollection.alter on pg

BEGIN;

SELECT collection FROM example_file WHERE FALSE;

ROLLBACK;
