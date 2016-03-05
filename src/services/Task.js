'use strict';

import { BaseComponent } from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import fs from 'fs';

import { SIGNALS, connection } from '../index';

export class Task extends BaseComponent {
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
				client.query('SELECT * FROM tasks WHERE $1::int', [ id ], (err, result) => {
					done();

					if(err) {
						es.throwError(fromDb$, err);
					} else {
						es.push(
							fromDb$,
							result.rows[ 0 ]
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