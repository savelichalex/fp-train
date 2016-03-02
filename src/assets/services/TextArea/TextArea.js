'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import { LectureView } from './views/LectureView';

const container = <div id="text-area"></div>;

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

		return {
			[ SIGNALS.COMPLETE_LECTURE ]: chooseLecture$
		}
	}

	static renderLecture(data) {
		let wrapper = document.getElementById('text-area');
		if(!wrapper) {
			wrapper = ReactDOM.render(
				container,
				document.getElementById('main')
			);
		}
		const previous$ = es.EventStream();
		const next$ = es.EventStream();

		ReactDOM.render(
			<LectureView
				data={data}
				previous$={previous$}
				next$={next$} />,
			wrapper
		);

		return es.merge(previous$, next$);
	}

	static renderTask(data) {

	}

}