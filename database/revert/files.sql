-- Revert server-template:files from pg

BEGIN;

DROP TABLE files;

COMMIT;
