'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

import {SIGNALS, connection} from '../index';

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
		const lectureFromDb$ = Lecture.getDataFromDb(id);

		return es.map(
			es.zip(
				lectureFromDb$,
				es.map(
					es.zip(
						es.flatMap(
							lectureFromDb$,
							Lecture.getLecture
						),
						es.flatMap(
							lectureFromDb$,
							Lecture.getExamples
						)
					),
					Lecture.zipLectureData
				)
			),
			([{next_id, previous_id, header}, lecture]) => {
				const data = {};
				if(next_id) {
					Object.assign(data, {
						nextId: nextId
					});
				}
				if(previous_id) {
					Object.assign(data, {
						previousId: previous_id
					});
				}
				if(lecture) {
					Object.assign(data, {
						lecture
					});
				}
				if(header) {
					Object.assign(data, {
						header
					});
				}

				return {
					data,
					res
				};
			}
		);
	}

	static getDataFromDb(id) {
		const fromDb$ = es.EventStream();

		pg.connect(connection, (err, client, done) => {
			if(err) {
				es.throwError(fromDb$, err);
			} else {
				client.query('SELECT * FROM lectures, contents WHERE lectures.id=$1::int AND contents.id=$1::int', [id], (err, result) => {
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

	static getLecture({lecture_file}) {
		const fromFile$ = es.EventStream();

		fs.readFile(path.resolve(__dirname, `../static/markdown/${lecture_file.trim()}`), 'utf8', (err, file) => {
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

	static getExamples({examples_file}) {
		const fromFile$ = es.EventStream();

		fs.readFile(path.resolve(__dirname, `../static/markdown/${examples_file.trim()}`), 'utf8', (err, file) => {
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

	static zipLectureData([lecture, examples]) {
		const lectureParts = lecture.split(';;;');
		const examplesParts = examples.split(';;;');

		return lectureParts.reduce((prev, cur, index) => {
			const exPart = examplesParts[index];
			prev.push({
				text: cur,
				example: exPart
			});
			return prev;
		}, []);
	}
}