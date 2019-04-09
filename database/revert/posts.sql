-- Revert server-template:posts from pg

BEGIN;

DROP TABLE posts;

COMMIT;
