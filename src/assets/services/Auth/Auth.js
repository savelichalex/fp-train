'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {LoginView} from './views/LoginView';
import { SignupView } from './views/SignupView';

export class Auth extends BaseComponent {

	slots() {
		return [
			SIGNALS.SHOW_AUTH,
			SIGNALS.AUTH_FAILED,
			SIGNALS.SHOW_SIGNUP
		];
	}

	main(showAuth$, authFailed$, showSignup$) {
		const showedAuth$ =
			      es.flatMap(
				      showAuth$,
				      Auth.renderAuthForm
			      );

		const showedSignup$ =
			es.flatMap(
				showSignup$,
				Auth.renderSignupForm
			);

		const authAfterFailed$ =
			      es.flatMap(
				      authFailed$,
				      Auth.renderAuthForm
			      );

		return {
			[ SIGNALS.CHECK_AUTH ]: es.merge(showedAuth$, authAfterFailed$),
			[ SIGNALS.CHECK_SIGNUP ]: showedSignup$
		};
	}

	static renderAuthForm(data = {}) {
		const auth$ = es.EventStream();

		ReactDOM.render(
			<LoginView auth$={auth$} data={data}/>,
			document.getElementById('main')
		);

		return auth$;
	}

	static renderSignupForm(data = {}) {
		const send$ = es.EventStream();
		const validate$ = es.EventStream();

		ReactDOM.render(
			<SignupView validate$={validate$} send$={send$} data={data} />,
			document.getElementById('main')
		);

		es.subscribe(
			validate$,
			d => {
				const data = Auth.validate(d);
				if(!data.validated) {
					ReactDOM.render(
						<SignupView validate$={validate$} data={data}/>,
						document.getElementById('main')
					);
				} else {
					es.push(
						send$,
						d
					);
				}
			}
		);
		
		return send$;
	}

	static validate({username, password, firstName, lastName}) {
		if(username.length < 3) {
			return {
				username: 'Too short'
			};
		} else if(password.length < 6) {
			return {
				password: 'Password must be at least 6 symbols'
			};
		} else if(firstName.length === 0) {
			return {
				firstName: 'Should not be empty'
			};
		} else if(lastName.length === 0) {
			return {
				lastName: 'Should not be empty'
			};
		} else {
			return {
				validated: true
			};
		}
	}
}