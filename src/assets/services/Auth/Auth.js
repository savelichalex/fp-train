'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {LoginView} from './views/LoginView';

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
		const auth$ = es.EventStream();

		ReactDOM.render(
			<LoginView auth$={auth$} data={data}/>,
			document.getElementById('main')
		);

		return auth$;
	}
}