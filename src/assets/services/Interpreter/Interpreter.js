'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import {interpretate} from 'lisp-on-js/interpretator';
import {setupEnvironment} from 'lisp-on-js/core';

import {SIGNALS} from '../../consts/Signals';

import assert from './clj/assert.clj';

import { toJs } from 'mori';

export class Interpreter extends BaseComponent {
	slots() {
		return [
			SIGNALS.CHECK_TASK
		];
	}

	main(checkTask$) {
		es.subscribe(
			checkTask$,
			({code, test}) => console.log(Interpreter.runCode(code, test))
		);

		return {

		};
	}
	
	static runCode(code, tests) {
		return toJs(interpretate(assert + '\n\n' + code + '\n\n' + tests, setupEnvironment()));
	}
}