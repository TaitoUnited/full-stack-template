-- Deploy server_template:posts to pg
-- requires: schema

BEGIN;

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at timestamp with time zone DEFAULT current_timestamp
);

COMMIT;
