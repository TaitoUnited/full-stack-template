-- Verify bronto-cloud:attachment_type_enum on pg

BEGIN;

SELECT 1/COUNT(*) FROM pg_type WHERE typname = 'attachment_type';

ROLLBACK;
