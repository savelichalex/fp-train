'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {LectureView} from './views/LectureView';

const container = <div id="lecture"></div>;

export class TextArea extends BaseComponent {

	slots() {
		return [
			SIGNALS.SHOW_LECTURE,
			SIGNALS.SHOW_TASK
		];
	}

	main(lectures$, tasks$) {
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

	static renderLecture({header, lecture, nextId, previousId}) {
		let wrapper = document.getElementById('lecture');
		if(!wrapper) {
			wrapper = ReactDOM.render(
				container,
				document.getElementById('main')
			);
		}
		const previousPart$ = es.EventStream();
		const nextPart$ = es.EventStream();
		const lectureLength = lecture.length - 1;

		function lectureLoop(header, data, previous$, next$, first, last, index) {
			ReactDOM.render(
				<LectureView
					header={header}
					data={data}
					previous$={previous$}
					next$={next$}
					first={first}
					last={last}
					index={index}
				/>,
				wrapper
			);
		}
		lectureLoop(header, lecture[0], previousPart$, nextPart$, true, false, 0);

		es.subscribe(
			previousPart$,
			index => {
				if(index === 0) {
					lectureLoop(header, lecture[index], previousPart$, nextPart$, true, false, index);
				} else if(index > 0) {
					lectureLoop(header, lecture[index], previousPart$, nextPart$, false, false, index);
				}
			}
		);

		es.subscribe(
			nextPart$,
			index => {
				if(index === lectureLength) {
					lectureLoop(header, lecture[index], previousPart$, nextPart$, false, true, index);
				} else if(index < lectureLength) {
					lectureLoop(header, lecture[index], previousPart$, nextPart$, false, false, index);
				}
			}
		);

		return es.merge(
			es.map(
				es.filter(
					es.filter(
						previousPart$,
						index => index < 0
					),
					() => previousId !== null
				),
				() => previousId
			),
			es.map(
				es.filter(
					es.filter(
						nextPart$,
						index => index > lectureLength
					),
					() => nextId !== null
				),
				() => nextId
			)
		);
	}

	static renderTask(data) {

	}

}