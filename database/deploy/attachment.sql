-- Deploy full-stack-template:attachment to pg

BEGIN;

CREATE TABLE attachment (
  id uuid PRIMARY KEY DEFAULT public.gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT current_timestamp,
  updated_at timestamptz NOT NULL DEFAULT current_timestamp,
  -- attachments are kept in DELETED status until upload has finished
  lifecycle_status lifecycle_status NOT NULL DEFAULT 'DELETED',

  -- entity reference
  post_id uuid REFERENCES post (id),
  CONSTRAINT attachment_has_one_target CHECK (
    post_id IS NOT NULL
  ),

  attachment_type attachment_type NOT NULL DEFAULT 'ATTACHMENT',
  content_type text NOT NULL,
  filename text,
  title text,
  description text
);

CREATE TRIGGER attachment_updated_at
BEFORE UPDATE ON attachment
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_updated_at();

COMMIT;
