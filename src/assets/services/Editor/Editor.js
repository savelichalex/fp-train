'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {CodeView} from './views/CodeView';

const container = document.getElementById('editor');

export class Editor extends BaseComponent {
	slots() {
		return [
			SIGNALS.AUTH_SUCCESS,
			SIGNALS.SHOW_LECTURE
		];
	}

	main(auth$, lectures$) {
		es.subscribe(
			auth$,
			() => { container.removeAttribute('style'); }
		);

		const codeChanges$ =
			es.flatMap(
				lectures$,
				Editor.renderInEditor
			);

		return {
			[ SIGNALS.CHECK_CODE ]: codeChanges$
		}
	}

	static renderInEditor({code = ''}) {
		const changes$ = es.EventStream();

		ReactDOM.render(
			<CodeView
				code={code}
				changes$={changes$} />,
			container
		);

		return changes$;
	}
}