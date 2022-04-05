-- Revert full-stack-template:attachment from pg

BEGIN;

DROP TABLE attachment;

COMMIT;
