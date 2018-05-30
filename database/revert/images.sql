-- Revert server-template:images from pg

BEGIN;

DROP TABLE images;

COMMIT;
