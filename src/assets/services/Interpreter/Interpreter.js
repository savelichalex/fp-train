'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import {interpretate} from 'lisp-on-js/interpretator';
import {setupEnvironment} from 'lisp-on-js/core';

import {SIGNALS} from '../../consts/Signals';

export class Interpreter extends BaseComponent {
	slots() {
		return [
			SIGNALS.CHECK_TASK
		];
	}

	main(checkTask$) {
		es.subscribe(
			checkTask$,
			code => console.log(Interpreter.runCode(code))
		);

		return {

		};
	}
	
	static runCode(code) {
		return interpretate(code, setupEnvironment());
	}
}