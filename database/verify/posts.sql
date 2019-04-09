-- Verify server-template:posts on pg

BEGIN;

SELECT id, created_at, updated_at, subject, content, author
FROM posts;

ROLLBACK;
