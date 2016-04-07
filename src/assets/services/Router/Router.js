'use strict';

import { BaseComponent } from 'base-components';
import { createHistory } from 'history';
import es from 'event-streams';
import { SIGNALS } from '../../consts/Signals';

export const history = createHistory();

export class Router extends BaseComponent {
	constructor() {
		super();

		history.listen(location => {
			Router.routes.forEach((val, index) => {
				if(index % 2 === 0) {
					const result = val.exec(location.pathname);
					if(result) {
						this._emitter.emit(Router.routes[index + 1], result[1]);
					}
				}
			});
		});
	}

	static get routes() {
		return [
			/^\/lecture\/(\d+)/, SIGNALS.CHOOSE_LECTURE,
			/^\/task\/(\d+)/, SIGNALS.CHOOSE_TASK,
			/^\/signin/, SIGNALS.SHOW_AUTH,
			/^\/signup/, SIGNALS.SHOW_SIGNUP,
			/^\/$/, SIGNALS.GET_CONTENTS,
			/^\//, SIGNALS.NOT_FOUND
		];
	}

	slots() {
		return [];
	}

	main() {

		return {};
	}
}