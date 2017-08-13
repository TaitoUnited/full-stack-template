-- Verify server_template:user.table on pg

BEGIN;

SELECT id FROM example_user WHERE FALSE;

ROLLBACK;
