'use strict';

import ajax from 'ajax';
import es from 'event-streams';

const LECTURE_TYPE = 1;
const TASK_TYPE = 2;

export class StateModel {

	static checkAuthorizedData(data) {
		const auth$ = es.EventStream();

		ajax.postJSON('/api/signin', data, (err, {id, username, password}) => {
			if(id) {
				es.push(
					auth$,
					{
						status: true,
						userData: {
							username
						}
					}
				);
			} else {
				es.push(
					auth$,
					{
						status: false,
						errorCode: {
							username,
							password
						}
					}
				)
			}
		});

		return auth$;
	}

	static getUserState({currentStep}) {
		return currentStep;
	}

	static isLectureType({type}) {
		return type === LECTURE_TYPE;
	}

	static isTaskType({type}) {
		return type === TASK_TYPE;
	}

	static showLecture(id) {

	}

	static getLecture(id) {
		const lecture$ = es.EventStream();

		ajax.get('/api/lecture/' + id, {}, data => {
			es.push(lecture$, data);
		});

		return lecture$;
	}

	static getTask(id) {

	}

	static getNextStep(id) {
		return Lectures[id];
	}

	static getContents() {
		const contents$ = es.EventStream();

		ajax.get('/api/contents', {}, data => {
			es.push(contents$, data);
		});

		return contents$;
	}
}