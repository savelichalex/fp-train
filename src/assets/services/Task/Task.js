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
			SIGNALS.SHOW_TASK,
			SIGNALS.TASK_TEST_SUCCESS,
			SIGNALS.TASK_TEST_ERROR
		];
	}

	main(tasks$, testSuccess$, testErrors$) {
		const codeCheck$ =
			es.flatMap(
				tasks$,
				Task.renderTask
			);

		es.subscribe(
			Task.withLast(
				testSuccess$,
				tasks$
			),
			([, task]) => Task.renderTaskOnSuccess(task)
		);

		const codeCheckAfterError$ =
			es.flatMap(
				Task.withLast(
					testErrors$,
					tasks$
				),
				([errors, task]) => Task.renderTask(task, errors)
			);

		return {
			[SIGNALS.CHECK_TASK]: es.merge(codeCheck$, codeCheckAfterError$)
		};
	}

	static renderTask(data, error) {
		const check$ = es.EventStream();

		ReactDOM.render(
			<TaskView
				data={data}
				check$={check$}
				error={error} />,
			document.getElementById('main')
		);

		return check$;
	}

	static renderTaskOnSuccess(data) {
		ReactDOM.render(
			<TaskView
				data={data}
				success={true} />,
			document.getElementById('main')
		);
	}
	
	static withLast(stream1, stream2) {
		es.subscribe(
			stream2,
			data => stream2._prev = data
		);

		return es.map(
			stream1,
			data => [data, stream2._prev]
		);
	}
}