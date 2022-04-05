-- Verify bronto-cloud:lifecycle_status_enum on pg

BEGIN;

SELECT 1/COUNT(*) FROM pg_type WHERE typname = 'lifecycle_status';

ROLLBACK;
