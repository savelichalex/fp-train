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
			SIGNALS.CHOOSE_LECTURE,
			SIGNALS.CHOOSE_TASK,
			SIGNALS.DONE_TASK
		];
	}

	main(auth$, getContents$, chooseLecture$, chooseTask$, doneTask$) {
		const contents$ = State.getAfterAuth(getContents$);
		const {authFailed$, authSuccess$} = State.auth(auth$);
		
		es.subscribe(
			doneTask$,
			State.doneTask
		);

		const lectures$ =
			es.flatMap(
				chooseLecture$,
				StateModel.getLecture
			);

		const tasks$ =
			es.flatMap(
				chooseTask$,
				StateModel.getTask
			);

		return {
			[ SIGNALS.AUTH_FAILED ]: authFailed$,
			[ SIGNALS.AUTH_SUCCESS ]: authSuccess$,
			[ SIGNALS.SHOW_CONTENTS ]: contents$,
			[ SIGNALS.SHOW_LECTURE ]: lectures$,
			[ SIGNALS.SHOW_TASK ]: tasks$
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
	
	static doneTask({currentId, nextId}) {
		const result$ = StateModel.saveTaskDone(currentId);
		
		es.subscribe(
			result$,
			res => {
				if(res === 'Ok') {
					//TODO: save it to contents list
				} else {
					//TODO: correct error handling
				}
				history.push({pathname: `/${nextId || ''}`});
			}
		);
	}
}