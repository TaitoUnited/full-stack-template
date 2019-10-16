-- Deploy full-stack-template:posts to pg

BEGIN;

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  subject text NOT NULL,
  content text NOT NULL,
  author text NOT NULL
);

CREATE TRIGGER posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();

COMMIT;
