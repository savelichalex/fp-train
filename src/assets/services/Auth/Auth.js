'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {LoginView} from './views/LoginView';

const container = <div id="auth"></div>;

export class Auth extends BaseComponent {

	slots() {
		return [
			SIGNALS.SHOW_AUTH,
			SIGNALS.AUTH_FAILED
		];
	}

	main(showAuth$, authFailed$) {
		const showedAuth$ =
			      es.flatMap(
				      showAuth$,
				      Auth.renderAuthForm
			      );

		const authAfterFailed$ =
			      es.flatMap(
				      authFailed$,
				      Auth.renderAuthForm
			      );

		return {
			[ SIGNALS.CHECK_AUTH ]: es.merge(showedAuth$, authAfterFailed$)
		};
	}

	static renderAuthForm(data = {}) {
		let wrapper = document.getElementById('auth');
		if(!wrapper) {
			wrapper = ReactDOM.render(
				container,
				document.getElementById('main')
			);
		}
		const auth$ = es.EventStream();

		ReactDOM.render(
			<LoginView auth$={auth$} data={data}/>,
			wrapper
		);

		es.subscribe(auth$, val => console.log(val));

		return auth$;
	}
}