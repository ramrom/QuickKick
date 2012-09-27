BEGIN;

CREATE SCHEMA enovagames;

CREATE TABLE enovagames.quickkick (
id 		serial 		PRIMARY KEY,
first_name 	varchar(15),
last_name 	varchar(15),
email 		varchar(30)     NOT NULL,
score		integer
);

CREATE USER enovagameuser LOGIN;

GRANT USAGE ON SCHEMA enovagames TO enovagameuser;
GRANT ALL ON TABLE enovagames.quickkick TO enovagameuser;

COMMIT;
