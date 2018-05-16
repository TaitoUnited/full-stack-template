-- Revert server_template:example_user from pg

BEGIN;

DROP TABLE example_user;

COMMIT;
