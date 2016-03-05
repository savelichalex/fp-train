'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';

import {SIGNALS} from '../../consts/Signals';

import {StateModel} from './models/StateModel';

import { history } from '../Router/Router';

export class State extends BaseComponent {

	slots() {
		return [
			SIGNALS.CHECK_AUTH,
			SIGNALS.GET_CONTENTS,
			SIGNALS.CHOOSE_LECTURE
		];
	}

	main(auth$, getContents$, chooseLecture$) {
		const contents$ = State.getAfterAuth(getContents$);
		const {authFailed$, authSuccess$} = State.auth(auth$);

		const lectures$ =
			      es.flatMap(
				      chooseLecture$,
				      StateModel.getLecture
			      );

		return {
			[ SIGNALS.AUTH_FAILED ]: authFailed$,
			[ SIGNALS.AUTH_SUCCESS ]: authSuccess$,
			[ SIGNALS.SHOW_LECTURE ]: lectures$,
			[ SIGNALS.SHOW_CONTENTS ]: contents$
		};
	}

	static auth(auth$) {
		const isAuth$ =
			      es.flatMap(
				      auth$,
				      StateModel.checkAuthorizedData
			      );

		const authFailed$ =
			      es.map(
				      es.filter(
					      isAuth$,
					      val => !val.status
				      ),
				      val => val.errorCode
			      );

		const authSuccess$ =
			      es.map(
				      es.filter(
					      isAuth$,
					      val => !!val.status
				      ),
				      val => val.userData
			      );

		es.subscribe(
			authSuccess$,
			() => history.push({
				pathname: '/'
			})
		);

		return {
			authFailed$,
			authSuccess$
		};
	}

	static getAfterAuth(userData$) {
		return es.flatMap(
			userData$,
			StateModel.getContents
		);
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