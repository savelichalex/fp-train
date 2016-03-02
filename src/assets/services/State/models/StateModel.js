'use strict';

import ajax from 'ajax';
import es from 'event-streams';

const LECTURE_TYPE = 1;
const TASK_TYPE = 2;

export class StateModel {

	static checkAuthorizedData({username, password}) {
		if(username === '123' && password === '123') {
			return {
				status: true,
				userData: {
					username: username,
					currentStep: {
						id: 1,
						type: 1
					}
				}
			}
		}
		return {
			status: false,
			errorCode: {
				username: true,
				password: true
			}
		};
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

		ajax.get('/api/article/' + id, {}, data => {
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