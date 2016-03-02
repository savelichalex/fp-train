'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => fs.readFile(__dirname + path.sep + path.join('web', 'index.html'), 'utf8', (err, file) => res.send(file)));

const connection = 'postgres://savelichalex:119911@localhost/fp_teach';

const SIGNALS = {
	GET_CONTENTS: 'getContents',
	SEND_CONTENTS: 'sendContents',
	GET_ARTICLE: 'getArticle',
	SEND_ARTICLE: 'sendArticle',
	GET_TASK: 'getTask',
	SEND_TASK: 'sendTask'
};

class App extends BaseComponent {
	slots() {
		return [
			SIGNALS.SEND_CONTENTS,
			SIGNALS.SEND_ARTICLE,
			SIGNALS.SEND_TASK
		];
	}

	main(contents$, articles$, tasks$) {
		es.subscribe(
			contents$,
			({data, res}) => {
				res.json(data);
			}
		);

		es.subscribe(
			articles$,
			({data, res}) => {
				res.json(data);
			}
		);

		es.subscribe(
			tasks$,
			({data, res}) => {
				res.json(data);
			}
		);

		return {
			[ SIGNALS.GET_CONTENTS ]: App.contentsStream(),
			[ SIGNALS.GET_ARTICLE ]: App.articleStream(),
			[ SIGNALS.GET_TASK ]: App.taskStream()
		};
	}

	static contentsStream() {
		const contents$ = es.EventStream();

		app.get('/api/contents', (req, res) => es.push(
			contents$,
			{
				req,
				res
			}
		));

		return contents$;
	}

	static articleStream() {
		const articles$ = es.EventStream();

		app.get('/api/article/:id(\\d+)/', (req, res) => es.push(
			articles$,
			{
				id: req.params.id,
				req,
				res
			}
		));

		return articles$;
	}

	static taskStream() {
		const tasks$ = es.EventStream();

		app.get('/api/task/:id(\\d+)/', (req, res) => es.push(
			tasks$,
			{
				id: req.params.id,
				req,
				res
			}
		));

		return tasks$;
	}
}

class Contents extends BaseComponent {
	slots() {
		return [
			SIGNALS.GET_CONTENTS
		];
	}

	main(contents$) {
		const contentsData$ =
			es.flatMap(
				contents$,
				Contents.getData
			);

		return {
			[ SIGNALS.SEND_CONTENTS ]: contentsData$
		}
	}

	static getData({res}) {
		const data$ = es.EventStream();

		pg.connect(connection, (err, client, done) => {
			if(err) {
				es.throwError(data$, err);
			} else {
				client.query('SELECT * FROM contents', (err, result) => {
					done();

					if(err) {
						es.throwError(data$, err);
					} else {
						es.push(
							data$,
							{
								data: result.rows,
								res
							}
						);
					}
				});
			}
		});

		return data$;
	}
}

class Article extends BaseComponent {
	slots() {
		return [
			SIGNALS.GET_ARTICLE
		];
	}

	main(articles$) {
		const articleMainData$ =
			es.flatMap(
				articles$,
				Article.getData
			);

		return {
			[ SIGNALS.SEND_ARTICLE ]: articleMainData$
		}
	}

	static getData({id, res}) {
		return es.map(
			es.zip(
				Article.getDataFromDb(id),
				Article.getDataFromFile(id)
			),
			([{examples, nextId, previousId}, text]) => {
				const data = {};
				if(examples) {
					Object.assign(data, {
						examples
					});
				}
				if(nextId) {
					Object.assign(data, {
						nextId: nextId
					});
				}
				if(previousId) {
					Object.assign(data, {
						previousId: previousId
					});
				}
				if(text) {
					Object.assign(data, {
						text
					});
				}

				return {
					data,
					res
				};
			}
		)
	}

	static getDataFromDb(id) {
		const fromDb$ = es.EventStream();

		pg.connect(connection, (err, client, done) => {
			if(err) {
				es.throwError(fromDb$, err);
			} else {
				client.query('SELECT * FROM articles WHERE id=$1::int', [id], (err, result) => {
					done();

					if(err) {
						es.throwError(fromDb$, err);
					} else {
						es.push(
							fromDb$,
							result.rows[0]
						);
					}
				});
			}
		});

		return fromDb$;
	}

	static getDataFromFile(id) {
		const fromFile$ = es.EventStream();

		fs.readFile(__dirname + '/static/markdown/article' + id + '.md', 'utf8', (err, file) => {
			if(err) {
				es.throwError(fromFile$, err);
			} else {
				es.push(
					fromFile$,
					file
				);
			}
		});

		return fromFile$;
	}
}

class Task extends BaseComponent {
	slots() {
		return [
			SIGNALS.GET_TASK
		];
	}

	main(tasks$) {
		const taskData$ =
			es.flatMap(
				tasks$,
				Task.getData
			);

		return {
			[ SIGNALS.SEND_TASK ]: taskData$
		};
	}

	static getData({id, res}) {
		return es.map(
			es.zip(
				Task.getDataFromDb(id),
				Task.getDataFromFile(id)
			),
			([{tasks, next_id, previous_id}], text) => {
				const data = {};
				if(tasks) {
					Object.assign(data, {
						tasks
					});
				}
				if(next_id) {
					Object.assign(data, {
						nextId: next_id
					});
				}
				if(previous_id) {
					Object.assign(data, {
						previousId: previous_id
					});
				}
				if(text) {
					Object.assign(data, {
						text
					});
				}

				return {
					data,
					res
				};
			}
		)
	}

	static getDataFromDb(id) {
		const fromDb$ = es.EventStream();

		pg.connect(connection, (err, client, done) => {
			if(err) {
				es.throwError(fromDb$, err);
			} else {
				client.query('SELECT * FROM tasks WHERE $1::int', [id], (err, result) => {
					done();

					if(err) {
						es.throwError(fromDb$, err);
					} else {
						es.push(
							fromDb$,
							result.rows[0]
						);
					}
				});
			}
		});

		return fromDb$;
	}

	static getDataFromFile(id) {
		const fromFile$ = es.EventStream();

		fs.readFile('./static/markdown/task' + id + '.md', 'utf8', (err, file) => {
			if(err) {
				es.throwError(fromFile$, err);
			} else {
				es.push(
					fromFile$,
					file
				);
			}
		});

		return fromFile$;
	}
}

new App();
new Contents();
new Article();
new Task();

app.listen(3000, () => console.log('Listen in 3000'));