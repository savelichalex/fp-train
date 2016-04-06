CREATE SEQUENCE contents_ids;
CREATE SEQUENCE user_ids;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY DEFAULT NEXTVAL('user_ids'), username CHAR(64) NOT NULL, password CHAR(32) NOT NULL);
CREATE TABLE IF NOT EXISTS contents (id INTEGER PRIMARY KEY DEFAULT NEXTVAL('contents_ids'), index CHAR(4), header CHAR(255) NOT NULL, type SMALLINT NOT NULL);
CREATE TABLE IF NOT EXISTS lectures (id INTEGER PRIMARY KEY, lecture_file CHAR(32) NOT NULL, examples_file CHAR(32) NOT NULL, next_id INTEGER, previous_id INTEGER);
CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, description_file CHAR(32) NOT NULL, blank_file CHAR(32) NOT NULL, test_file CHAR(32) NOT NULL, next_id INTEGER, previous_id INTEGER);
CREATE TABLE IF NOT EXISTS tasks_completed (user_id INTEGER, task_id INTEGER);
TRUNCATE TABLE users;
TRUNCATE TABLE contents;
TRUNCATE TABLE lectures;
TRUNCATE TABLE tasks;
TRUNCATE TABLE tasks_completed;
INSERT INTO users (username, password) VALUES ('admin', '202cb962ac59075b964b07152d234b70');
INSERT INTO contents (index, header, type) VALUES ('1', 'First lecture', 1);
INSERT INTO contents (index, header, type) VALUES ('1.1', 'Task for first lecture', 2);
INSERT INTO contents (index, header, type) VALUES ('1.2', 'Second task for first lecture', 2);
INSERT INTO lectures (id, lecture_file, examples_file, next_id) VALUES (1, 'lecture1.md', 'examples1.clj', 2);
INSERT INTO tasks (id, description_file, blank_file, test_file, next_id, previous_id) VALUES (3, 'task1.1.md', 'blank1.1.clj', 'test1.1.clj', 3, 1);
INSERT INTO tasks (id, description_file, blank_file, test_file, previous_id) VALUES (3, 'task1.2.md', 'blank1.2.clj', 'test1.2.clj', 2);