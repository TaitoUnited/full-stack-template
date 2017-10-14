-- Deploy server_template:fileDev1.data to pg
-- requires: file.table
-- requires: fileCollection.alter

BEGIN;

CREATE FUNCTION pg_temp.execenv(_env text)
  RETURNS void AS
$func$
BEGIN
  IF _env IN ('local', 'dev', 'test') THEN

    -- NOTE: Add your changes here
    INSERT INTO example_file (name, description, collection) VALUES ('house.jpg', 'Picture of a house', 'dev1');
    INSERT INTO example_file (name, description, collection) VALUES ('dog.jsp', 'Picture of a dog', 'dev1');

  END IF;
END
$func$ LANGUAGE plpgsql;

SELECT pg_temp.execenv(:env);
DROP FUNCTION pg_temp.execenv(text);

COMMIT;
