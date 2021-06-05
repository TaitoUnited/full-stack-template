-- Revert full-stack-template:post from pg

BEGIN;

DROP TABLE post;

COMMIT;
