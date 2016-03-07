CREATE SEQUENCE contents_ids;
CREATE SEQUENCE user_ids;
CREATE TABLE users (id INTEGER PRIMARY KEY DEFAULT NEXTVAL('user_ids'), login CHAR(64) NOT NULL, password CHAR(32) NOT NULL);
CREATE TABLE contents (id INTEGER PRIMARY KEY DEFAULT NEXTVAL('contents_ids'), index CHAR(4), header CHAR(255) NOT NULL, type SMALLINT NOT NULL);
CREATE TABLE lectures (id INTEGER PRIMARY KEY, lecture_file CHAR(32) NOT NULL, examples_file CHAR(32) NOT NULL, next_id INTEGER, previous_id INTEGER);
CREATE TABLE tasks (id INTEGER PRIMARY KEY, description_file CHAR(32) NOT NULL, blank_file CHAR(32) NOT NULL, test_file CHAR(32) NOT NULL, next_id INTEGER, previous_id INTEGER);