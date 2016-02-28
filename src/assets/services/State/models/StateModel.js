'use strict';

import ajax from 'ajax';
import {EventStream as es} from 'event-streams';

const LECTURE_TYPE = 1;
const TASK_TYPE = 2;

const Lectures = {
	1: {
		type: LECTURE_TYPE,
		header: 'Test lecture',
		mainText: [
			'sdfsdfsdfsdfsdfsdf'
		],
		code: '(defn test [] "test")',
		nextId: 2
	},
	2: {
		type: LECTURE_TYPE,
		header: 'Second test lecture',
		mainText: [
			'sdfsdfsdfsdfsdsdfsdfsdfsdfsdfsdf'
		],
		code: '(defn second-lecture [] "yeah")',
		previousId: 1,
		nextId: 3
	},
	3: {
		type: LECTURE_TYPE,
		header: 'Third test lecture',
		mainText: [
			'sdfsdfsdfsdf',
			'sdfsdfsdfsdf',
			'sdfsdfsdfsdf'
		],
		previousId: 2
	}
};

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
		return Lectures[id];
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