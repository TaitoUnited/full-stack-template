-- Verify full-stack-template:status_enum on pg

BEGIN;

SELECT 1/COUNT(*) FROM pg_type WHERE typname = 'status';

ROLLBACK;
