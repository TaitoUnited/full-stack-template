-- Revert full-stack-template:user from pg

BEGIN;

DROP TABLE app_user;

COMMIT;
