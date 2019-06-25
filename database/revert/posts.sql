-- Revert full-stack-template:posts from pg

BEGIN;

DROP TABLE posts;

COMMIT;
