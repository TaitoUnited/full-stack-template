-- Verify full-stack-template:post on pg

BEGIN;

SELECT id, created_at, updated_at, subject, content, author
FROM post;

ROLLBACK;
