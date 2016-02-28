CREATE SEQUENCE contents_ids;
CREATE SEQUENCE user_ids;
CREATE TABLE users (id INTEGER PRIMARY KEY DEFAULT NEXTVAL('user_ids'), login CHAR(64), password CHAR(64));
CREATE TABLE contents (id INTEGER PRIMARY KEY DEFAULT NEXTVAL('contents_ids'), index INTEGER, header CHAR(255), type SMALLINT);
