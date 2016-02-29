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
			SIGNALS.COMPLETE_TASK,
			SIGNALS.CHOOSE_LECTURE
		];
	}

	main(auth$, lectureComplete$, taskComplete$, chooseLecture$) {
		const {authFailed$, contents$, userData$} = State.auth(auth$);
		const {showNextLecture$, showNextTask$} = State.nextStep(lectureComplete$, taskComplete$);

		const lectures$ =
			es.flatMap(
				chooseLecture$,
				StateModel.getLecture
			);

		return {
			[ SIGNALS.AUTH_FAILED ]: authFailed$,
			[ SIGNALS.AUTH_SUCCESS ]: userData$,
			[ SIGNALS.SHOW_LECTURE ]: lectures$,
			[ SIGNALS.SHOW_TASK ]: showNextTask$,
			[ SIGNALS.SHOW_CONTENTS ]: contents$
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

		const contents$ = State.getAfterAuth(userData$);

		return {
			authFailed$,
			contents$,
			userData$
		};
	}

	static getAfterAuth(userData$) {
		return es.flatMap(
			userData$,
			StateModel.getContents
		);
	}

	static getAfterAuth2(userData$) {
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