-- Verify full-stack-template:user on pg

BEGIN;

SELECT id, created_at, updated_at
FROM app_user;

ROLLBACK;
