'use strict';

import {BaseComponent} from 'base-components';
import {EventStream as es} from 'event-streams';

import {SIGNALS} from '../../consts/Signals';

import {StateModel} from './models/StateModel';

export class State extends BaseComponent {

	slots() {
		return [
			SIGNALS.CHECK_AUTH,
			SIGNALS.COMPLETE_LECTURE,
			SIGNALS.COMPLETE_TASK
		];
	}

	main(auth$, lectureComplete$, taskComplete$) {
		const {authFailed$, lectures$, tasks$, userData$} = State.auth(auth$);
		const {showNextLecture$, showNextTask$} = State.nextStep(lectureComplete$, taskComplete$);

		return {
			[ SIGNALS.AUTH_FAILED ]: authFailed$,
			[ SIGNALS.AUTH_SUCCESS ]: userData$,
			[ SIGNALS.SHOW_LECTURE ]: es.merge(lectures$, showNextLecture$),
			[ SIGNALS.SHOW_TASK ]: es.merge(tasks$, showNextTask$)
		};
	}

	static auth(auth$) {
		const isAuth$ =
			es.map(
				auth$,
				data => StateModel.checkAuthorizedData(data)
			);

		const authFailed$ =
			es.map(
				es.filter(
					isAuth$,
					val => !val.status
				),
				val => val.errorCode
			);

		const userData$ =
			es.map(
				es.filter(
					isAuth$,
					val => !!val.status
				),
				val => val.userData
			);

		const { lectures$, tasks$ } = State.getAfterAuth(userData$);

		return {
			authFailed$,
			lectures$,
			tasks$,
			userData$
		};
	}

	static getAfterAuth(userData$) {
		const userState$ =
			es.map(
				userData$,
				StateModel.getUserState
			);

		const lectures$ =
			es.map(
				es.filter(
					userState$,
					StateModel.isLectureType
				),
				({id}) => StateModel.getLecture(id)
			);

		const tasks$ =
			es.map(
				es.filter(
					userState$,
					StateModel.isTaskType
				),
				({id}) => StateModel.getTask(id)
			);

		return {
			lectures$,
			tasks$
		};
	}

	static nextStep(lectureComplete$, taskComplete$) {
		const nextStep$ =
			es.map(
				es.merge(lectureComplete$, taskComplete$),
				StateModel.getNextStep
			);

		const showNextLecture$ =
			es.filter(
				nextStep$,
				StateModel.isLectureType
			);

		const showNextTask$ =
			es.filter(
				nextStep$,
				StateModel.isTaskType
			);

		return {
			showNextLecture$,
			showNextTask$
		};
	}
}