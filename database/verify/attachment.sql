-- Verify bronto-cloud:attachment on pg

BEGIN;

SELECT id, created_at, updated_at
FROM attachment;

ROLLBACK;
