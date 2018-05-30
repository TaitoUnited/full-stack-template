-- Deploy server-template:images to pg

BEGIN;

CREATE TABLE images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at timestamp with time zone DEFAULT current_timestamp
);

COMMIT;
