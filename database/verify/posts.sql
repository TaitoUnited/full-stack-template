-- Verify server_template:posts on pg

BEGIN;

SELECT id FROM posts WHERE FALSE;

ROLLBACK;
