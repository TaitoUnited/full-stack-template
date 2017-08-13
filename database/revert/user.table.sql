-- Revert server_template:user.table from pg

BEGIN;

DROP TABLE example_user;

COMMIT;
