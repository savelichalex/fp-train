'use strict';

import {BaseComponent} from 'base-components';
import {EventStream as es} from 'event-streams';

import React from 'react';
import ReactDOM from 'react-dom';

import {SIGNALS} from '../../consts/Signals';

//views

import {ContentsList} from './views/ContentsList';

const container = <div id="contents"></div>;

export class Contents extends BaseComponent {
	slots() {
		return [
			SIGNALS.SHOW_CONTENTS
		];
	}

	main(contents$) {
		const contentsView$ =
			es.flatMap(
				contents$,
				Contents.renderContents
			);

		return {

		};
	}

	static renderContents(data) {
		let wrapper = document.getElementById('contents');
		if(!wrapper) {
			wrapper = ReactDOM.render(
				container,
				document.getElementById('main')
			);
		}

		const contents$ = es.EventStream();

		ReactDOM.render(
			<ContentsList data={data} contents$={contents$} />,
			document.getElementById('main')
		);

		return contents$;
	}
}