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
			SIGNALS.CHECK_SIGNUP,
			SIGNALS.GET_CONTENTS,
			SIGNALS.CHOOSE_LECTURE,
			SIGNALS.CHOOSE_TASK,
			SIGNALS.DONE_TASK
		];
	}

	main(auth$, signup$, getContents$, chooseLecture$, chooseTask$, doneTask$) {
		const contents$ = State.getAfterAuth(getContents$);
		const {authFailed$, authSuccess$} = State.auth(auth$);
		const signupFailed$ = State.signup(signup$);
		
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
			[ SIGNALS.SHOW_TASK ]: tasks$,
			[ SIGNALS.SIGNIN_FAILED ]: signupFailed$
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
	
	static signup(signup$) {
		const failed$ = es.EventStream();
		
		es.subscribe(
			es.flatMap(
				signup$,
				StateModel.sendSignupData
			),
			res => {
				if(res === 'Ok') {
					history.push({pathname: '/'});
				} else {
					es.push(
						failed$,
						res
					);
				}
			}
		);
		
		return failed$;
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
					history.push({pathname: `/${nextId ? `task/${nextId}` : ''}`});
				} else {
					//TODO: correct error handling
				}
			}
		);
	}
}