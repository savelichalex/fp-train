'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import {interpretate} from 'lisp-on-js/interpretator';
import {setupEnvironment} from 'lisp-on-js/core';

import {SIGNALS} from '../../consts/Signals';

import assert from './clj/assert.clj';

import {toJs} from 'mori';

const SUCCESS = 'success';
const ERROR = 'error';

export class Interpreter extends BaseComponent {
	slots() {
		return [
			SIGNALS.CHECK_TASK
		];
	}

	main(checkTask$) {
		const afterRun$ =
			es.flatMap(
				checkTask$,
				Interpreter.runCode
			);

		const success$ =
			es.filter(
				afterRun$,
				results => results.filter(([,status]) => status === ERROR).length === 0
			);

		const error$ =
			es.filter(
				afterRun$,
				results => results.filter(([,status]) => status === ERROR).length !== 0
			);

		return {
			[SIGNALS.TASK_TEST_SUCCESS]: success$,
			[SIGNALS.TASK_TEST_ERROR]: error$
		};
	}

	static runCode({code, test}) {
		const interpretated$ = es.EventStream();

		setTimeout(() => {
			try {
				es.push(
					interpretated$,
					toJs(interpretate(assert + '\n\n' + code + '\n\n' + test, setupEnvironment()))
						.map(arr => [arr[0].value, arr[1].value])
				);
			} catch (e) {
				es.push(
					interpretated$,
					[e, ERROR]
				);
			}
		}, 0);

		return interpretated$;
	}
}