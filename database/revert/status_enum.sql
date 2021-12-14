-- Revert full-stack-template:status_enum from pg

BEGIN;

DROP TYPE status;

COMMIT;
