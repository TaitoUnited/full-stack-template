-- Deploy server_template:schema to pg

BEGIN;

-- NOTE: In most cases you don't need to create a schema for application.
-- It's ok to create tables to public schema.

-- NOTE: Do not create any extension in sqitch scripts as creating them
-- requires superuser rights. Add extensions to /database/init/extensions.sql
-- file and ask devops personnel to run them on database clusters.

COMMIT;
