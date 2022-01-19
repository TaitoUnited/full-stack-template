DELETE FROM post;
---------------------------------------------------------------------

INSERT INTO post (id, created_at, updated_at, subject, content, author) values
('00a67f95-5ea9-41b8-a4f8-110f53c54727', now(), now(), 'subject', 'content', 'author'),
('ade5ddaa-adcb-474e-83ff-e5bcd11b9122', now(), now(), 'subject', 'content', 'author'),
('9b549a9b-aa8d-45d5-9e57-abe7ae0fe05b', now(), now(), 'subject', 'content', 'author');
