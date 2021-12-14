-- Deploy full-stack-template:user to pg

BEGIN;

CREATE TABLE app_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,

  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  status status NOT NULL,
  language text,

  external_ids text[]
);

CREATE TRIGGER app_user_updated_at
BEFORE UPDATE ON app_user
FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();

COMMIT;
