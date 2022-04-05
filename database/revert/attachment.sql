-- Revert bronto-cloud:attachment from pg

BEGIN;

DROP TABLE attachment;

COMMIT;
