-- Revert server_template:file-dev1.data from pg

BEGIN;

CREATE FUNCTION pg_temp.execenv(_env text)
  RETURNS void AS
$func$
BEGIN
  IF _env IN ('local', 'dev', 'test') THEN

    -- NOTE: Add your changes here
    DELETE FROM example_file WHERE collection = 'dev1';

  END IF;
END
$func$ LANGUAGE plpgsql;

SELECT pg_temp.execenv(:env);
DROP FUNCTION pg_temp.execenv(text);

COMMIT;
