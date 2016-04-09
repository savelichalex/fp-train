'use strict';

import ajax from 'ajax';
import es from 'event-streams';

const LECTURE_TYPE = 1;
const TASK_TYPE = 2;

let contents = [];

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

	static isLectureType(type) {
		return type === LECTURE_TYPE;
	}

	static isTaskType(type) {
		return type === TASK_TYPE;
	}

	static showLecture(id) {

	}

	static getLecture(id) {
		const lecture$ = es.EventStream();

		ajax.get(`/api/lecture/${id}`, {}, data => {
			es.push(lecture$, data);
		});

		return lecture$;
	}

	static getTask(id) {
		const task$ = es.EventStream();

		ajax.get(`/api/task/${id}`, {}, data => {
			es.push(
				task$,
				data
			);
		});

		return task$;
	}

	static getNextStep(id) {
		return Lectures[id];
	}

	static getContents() {
		const contents$ = es.EventStream();

		ajax.get('/api/contents', {}, data => {
			contents = StateModel.parseContents(data);
			es.push(contents$, contents);
		});

		return contents$;
	}

	static getContentTypeById(id) {
		if(contents.length !== 0) {
			const result$ = es.EventStream();

			setTimeout(() =>
				es.push(
					result$,
					StateModel.findContentById(contents, id)
				),
				0
			);

			return es.filter(
				result$,
				d => d !== void 0
			);
		} else {
			return es.filter(
				es.map(
					StateModel.getContents(),
					contents => StateModel.findContentById(contents, id)
				),
				d => d !== void 0
			);
		}
	}

	static findContentById(contents, cId) {
		const res = contents.filter(({id}) => id === cId);

		return res.length ? res[0] : void 0;
	}

	static parseContents(data) {
		const lastCompletedIndex = Math.max.apply(null, data.map(({completed}, index) => !!completed && index));
		const firstTaskAfterLastCompletedIndex =
			Math.min.apply(
				null, data.slice(lastCompletedIndex + 1).map(({type}, index) => type === TASK_TYPE && index)) + lastCompletedIndex + 1;
		return data.map((d, index) => {
			if(index > firstTaskAfterLastCompletedIndex) {
				return Object.assign({}, d, {disabled: true});
			} else {
				return Object.assign({}, d, {disabled: false});
			}
		});
	}

	static saveTaskDone(currentId) {
		const result$ = es.EventStream();

		ajax.post(`/api/task_done/${currentId}`, {}, res => {
			es.push(result$, res);
		});

		return result$;
	}

	static sendSignupData(data) {
		const result$ = es.EventStream();

		ajax.postJSON('/api/signup', data, (err, {data}) => {
			es.push(result$, data);
		});

		return result$;
	}
}