BEGIN;

CREATE SCHEMA enovagames;

CREATE TABLE enovagames.quickkick (
id 		serial 		PRIMARY KEY,
first_name 	varchar(15),
last_name 	varchar(15),
email 		varchar(30)     NOT NULL,
score		integer,
agree_to_terms  boolean
);

INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  
INSERT into enovagames.quickkick (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false);  

CREATE USER enovagameuser;

GRANT USAGE ON enovagames TO enovagameuser;
#GRANT ALL ON TABLE enovagames.quickkick TO enovagameuser;

COMMIT;
