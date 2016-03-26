'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {TaskView} from './views/TaskView';

export class Task extends BaseComponent {
	slots() {
		return [
			SIGNALS.SHOW_TASK
		];
	}

	main(tasks$) {
		const codeCheck$ =
			es.flatMap(
				tasks$,
				Task.renderTask
			);

		return {
			[SIGNALS.CHECK_TASK]: codeCheck$
		};
	}

	static renderTask(data) {
		const check$ = es.EventStream();

		ReactDOM.render(
			<TaskView
				data={data}
				check$={check$} />,
			document.getElementById('main')
		);

		return check$;
	}
}