-- Revert server_template:posts from pg

BEGIN;

DROP TABLE posts;

COMMIT;
