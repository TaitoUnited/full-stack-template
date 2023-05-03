-- Verify full-stack-template:attachment on pg

BEGIN;

SELECT
  id, created_at, updated_at
FROM attachment
LIMIT 1;

ROLLBACK;
