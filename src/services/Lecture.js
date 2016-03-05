'use strict';

import { BaseComponent } from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import fs from 'fs';

import { SIGNALS, connection } from '../index';

export class Lecture extends BaseComponent {
	slots() {
		return [
			SIGNALS.GET_LECTURE
		];
	}

	main(articles$) {
		const articleMainData$ =
			es.flatMap(
				articles$,
				Lecture.getData
			);

		return {
			[ SIGNALS.SEND_LECTURE ]: articleMainData$
		}
	}

	static getData({id, res}) {
		return es.map(
			es.zip(
				Lecture.getDataFromDb(id),
				Lecture.getDataFromFile(id)
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
				client.query('SELECT * FROM articles WHERE id=$1::int', [ id ], (err, result) => {
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

		fs.readFile(__dirname + '/../static/markdown/lecture' + id + '.md', 'utf8', (err, file) => {
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