'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views
import {ContentsList} from './views/ContentsList';

export class Contents extends BaseComponent {
	slots() {
		return [
			SIGNALS.SHOW_CONTENTS
		];
	}

	main(contents$) {
		es.subscribe(
			contents$,
			Contents.renderContents
		);

		return {};
	}

	static renderContents(data) {
		ReactDOM.render(
			<ContentsList data={data} />,
			document.getElementById('main')
		);
	}
}