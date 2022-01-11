DELETE FROM post;
---------------------------------------------------------------------

INSERT INTO post (id, created_at, updated_at, subject, content, author)
values ('00a67f95-5ea9-41b8-a4f8-110f53c54727', now(), now(), 'subject', 'content', 'author');
