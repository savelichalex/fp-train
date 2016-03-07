'use strict';

import { BaseComponent } from 'base-components';
import es from 'event-streams';
import path from 'path';
import { fromFile, selectOneFromDb } from '../util/util';

import { SIGNALS } from '../index';

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
		const taskFromDb$ = Task.getDataFromDb(id);

		return es.map(
			es.zip(
				taskFromDb$,
				es.zip(
					es.flatMap(
						taskFromDb$,
						Task.getTaskDescription
					),
					es.zip(
						es.flatMap(
							taskFromDb$,
							Task.getTaskBlank
						),
						es.flatMap(
							taskFromDb$,
							Task.getTaskTest
						)
					)
				)
			),
			([{next_id, previous_id, header}, [description, [blank, test]]]) => {
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
				if(header) {
					Object.assign(data, {
						header
					});
				}
				Object.assign(data, {
					description,
					blank,
					test
				});

				return {
					data,
					res
				};
			}
		);
	}

	static getDataFromDb(id) {
		return selectOneFromDb('SELECT * FROM tasks, contents WHERE tasks.id=$1::int AND contents.id=$1::int', [ id ]);
	}

	static getTaskDescription({description_file}) {
		return fromFile(path.resolve(__dirname, `../static/markdown/${description_file.trim()}`));
	}

	static getTaskBlank({blank_file}) {
		return fromFile(path.resolve(__dirname, `../static/code/${blank_file.trim()}`));
	}

	static getTaskTest({test_file}) {
		return fromFile(path.resolve(__dirname, `../static/code/${test_file.trim()}`));
	}
}