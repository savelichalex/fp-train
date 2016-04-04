'use strict';

import { BaseComponent } from 'base-components';
import es from 'event-streams';
import pg from 'pg';

import { selectManyFromDb } from '../util/util';

import { SIGNALS } from '../index';

const LECTURE_TYPE = 1;
const TASK_TYPE = 2;

export class Contents extends BaseComponent {
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
		const contents$ =
			selectManyFromDb(
				'SELECT * FROM contents LEFT JOIN tasks_completed ON contents.id = tasks_completed.task_id ORDER BY contents.id');
		
		return es.map(
			es.map(
				contents$,
				c => c.map(({id, index, header, type, user_id, task_id}) => {
					const item = {
						id,
						index,
						header,
						type
					};
					if(type === TASK_TYPE) {
						return Object.assign(item, {
							completed: user_id !== null && task_id !== null
						});
					} else {
						return item;
					}
				})
			),
			data => ({
				data,
				res
			})
		);
	}
}