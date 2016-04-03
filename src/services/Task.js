'use strict';

import { BaseComponent } from 'base-components';
import es from 'event-streams';
import path from 'path';
import { fromFile, selectOneFromDb, insertOneToDb, checkIsExistInDb } from '../util/util';

import { SIGNALS } from '../index';

export class Task extends BaseComponent {
	slots() {
		return [
			SIGNALS.GET_TASK,
			SIGNALS.DONE_TASK
		];
	}

	main(tasks$, doneTasks$) {
		const taskData$ =
			es.flatMap(
				tasks$,
				Task.getData
			);

		const saveTaskDone$ =
			es.flatMap(
				doneTasks$,
				Task.saveTaskCompletion
			);

		return {
			[ SIGNALS.SEND_TASK ]: taskData$,
			[ SIGNALS.SAVE_DONE_TASK ]: saveTaskDone$
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
						nextId: next_id
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

	static saveTaskCompletion({user_id, task_id, res}) {
		const check$ = checkIsExistInDb('SELECT * FROM tasks_completed WHERE user_id=$1 AND task_id=$2', [user_id, task_id]);

		const save$ =
			es.map(
				es.flatMap(
					es.filter(
						check$,
						isExist => !isExist
					),
					insertOneToDb('INSERT INTO tasks_completed (user_id, task_id) VALUES ($1, $2)', [user_id, task_id])
				),
				() => ({
					status: 200,
					message: 'Ok',
					res
				})
			);

		const exist$ =
			es.map(
				es.filter(
					check$,
					isExist => isExist
				),
				() => ({
					status: 422,
					message: 'Task is competed yet',
					res
				})
			);
		
		return es.merge(save$, exist$);
	}
}