'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {LectureView} from './views/LectureView';

export class Lecture extends BaseComponent {

	slots() {
		return [
			SIGNALS.SHOW_LECTURE
		];
	}

	main(lectures$) {
		const chooseLecture$ =
			es.flatMap(
				lectures$,
				Lecture.renderLecture
			);

		return {
			[ SIGNALS.CHOOSE_CONTENT ]: chooseLecture$
		}
	}

	static renderLecture({header, lecture, nextId, previousId}) {
		const showAnother$ = es.EventStream();
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
					nextId={nextId}
					prevId={previousId}
					last={last}
					index={index}
				/>,
				document.getElementById('main')
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
				} else {
					es.push(
						showAnother$,
						previousId
					);
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
				} else {
					es.push(
						showAnother$,
						nextId
					);
				}
			}
		);

		return showAnother$;
	}

}