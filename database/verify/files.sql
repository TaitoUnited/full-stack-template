-- Verify server-template:files on pg

BEGIN;

SELECT id FROM files WHERE FALSE;

ROLLBACK;
