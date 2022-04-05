-- Deploy full-stack-template:attachment_type_enum to pg

BEGIN;

CREATE TYPE attachment_type AS ENUM (
  'ATTACHMENT',
  'PHOTO',
  'CUSTOMER_SIGNATURE',
  'PART_PHOTO'
);

COMMIT;
