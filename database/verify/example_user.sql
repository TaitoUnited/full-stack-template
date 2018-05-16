-- Verify server_template:example_user on pg

BEGIN;

SELECT id FROM example_user WHERE FALSE;

ROLLBACK;
