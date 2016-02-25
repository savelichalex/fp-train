'use strict';

import {BaseComponent} from 'base-components';
import {EventStream as es} from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import { LectureView } from './views/LectureView';

const container = document.getElementById('text-area');

export class TextArea extends BaseComponent {

	slots() {
		return [
			SIGNALS.SHOW_LECTURE,
			SIGNALS.SHOW_TASK,
			SIGNALS.AUTH_SUCCESS
		];
	}

	main(lectures$, tasks$, authSuccess$) {
		const chooseLecture$ =
			es.flatMap(
				lectures$,
				TextArea.renderLecture
			);

		const chooseTask$ =
			es.map(
				tasks$,
				TextArea.renderTask
			);

		es.subscribe(
			authSuccess$,
			() => { container.removeAttribute('style'); }
		);

		return {
			[ SIGNALS.COMPLETE_LECTURE ]: chooseLecture$
		}
	}

	static renderLecture(data) {
		const previous$ = es.EventStream();
		const next$ = es.EventStream();

		ReactDOM.render(
			<LectureView
				data={data}
				previous$={previous$}
				next$={next$} />,
			container
		);

		return es.merge(previous$, next$);
	}

	static renderTask(data) {

	}

}