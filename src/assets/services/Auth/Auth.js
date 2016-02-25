'use strict';

import {BaseComponent} from 'base-components';
import {EventStream as es} from 'event-streams';
import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {LoginView} from './views/LoginView';

const container = document.getElementById('auth');

export class Auth extends BaseComponent {

	slots() {
		return [
			SIGNALS.AUTH_FAILED,
			SIGNALS.AUTH_SUCCESS
		];
	}

	main(authFailed$, authSuccess$) {
		const authAfterFailed$ =
			es.flatMap(
				authFailed$,
				Auth.renderAuthForm
			);

		es.subscribe(
			authSuccess$,
			() => { container.style.display = 'none'; }
		);

		return {
			[ SIGNALS.CHECK_AUTH ]: es.merge(Auth.renderAuthForm(), authAfterFailed$)
		};
	}

	static renderAuthForm(data = {}) {
		const auth$ = es.EventStream();

		ReactDOM.render(
			<LoginView auth$={auth$} data={data} />,
			container
		);

		return auth$;
	}
}