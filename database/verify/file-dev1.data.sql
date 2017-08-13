-- Verify server_template:file-dev1.data on pg

BEGIN;

CREATE FUNCTION pg_temp.execenv(_env text)
  RETURNS INTEGER AS
$func$
DECLARE
  foo INTEGER;
BEGIN
  IF _env IN ('local', 'dev', 'test') THEN

    -- NOTE: Add your changes here
    SELECT INTO foo 1/COUNT(*) FROM example_file where collection = 'dev1';

  END IF;
  RETURN foo;
END
$func$ LANGUAGE plpgsql;

SELECT * FROM pg_temp.execenv(:env);
DROP FUNCTION pg_temp.execenv(text);

ROLLBACK;
