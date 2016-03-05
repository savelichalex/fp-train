'use strict';

require('longjohn');

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import express from 'express';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

//services
import { Auth } from './services/Auth';
import { Contents } from './services/Contents';
import { Lecture } from './services/Lecture';
import { Task } from './services/Task';

const app = express();

app.use(bodyParser.json());
app.use(cookieSession({
	keys: [ 'key' ]
}));

app.use(express.static(__dirname + '/static'));

export const connection = 'postgres://savelichalex:119911@localhost/fp_teach';

export const SIGNALS = {
	CHECK_SIGNIN: 'signin',
	SIGNIN_SUCCESS: 'signinSuccess',
	SIGNIN_FAILED: 'signinFailed',
	GET_CONTENTS: 'getContents',
	SEND_CONTENTS: 'sendContents',
	GET_LECTURE: 'getLecture',
	SEND_LECTURE: 'sendLecture',
	GET_TASK: 'getTask',
	SEND_TASK: 'sendTask'
};

class App extends BaseComponent {
	slots() {
		return [
			SIGNALS.SEND_CONTENTS,
			SIGNALS.SEND_LECTURE,
			SIGNALS.SEND_TASK,
			SIGNALS.SIGNIN_SUCCESS,
			SIGNALS.SIGNIN_FAILED
		];
	}

	main(contents$, articles$, tasks$, signinSuccess$, signinFailed$) {
		es.subscribe(
			contents$,
			({data, res}) => {
				res.json(data);
			}
		);

		es.subscribe(
			articles$,
			({data, res}) => {
				res.json(data);
			}
		);

		es.subscribe(
			tasks$,
			({data, res}) => {
				res.json(data);
			}
		);

		const index$ = App.indexStream();

		const authSuccess$ =
			      es.filter(
				      index$,
				      ({req}) => req.session.authorized
			      );

		const api$ =
			      es.filter(
				      authSuccess$,
				      ({req}) => /^\/api\//.test(req.url)
			      );

		const notApi$ =
			      es.filter(
				      authSuccess$,
				      ({req}) => !/^\/api\//.test(req.url)
			      );

		es.subscribe(
			api$,
			({next}) => next()
		);

		const authFailed$ =
			      es.filter(
				      index$,
				      ({req}) => !req.session.authorized
			      );

		const signin$ =
			      es.filter(
				      authFailed$,
				      ({req}) => req.url === '/signin'
			      );

		const notSignin$ =
			      es.filter(
				      authFailed$,
				      ({req}) => req.url !== '/signin'
			      );

		es.subscribe(
			notSignin$,
			({res}) => res.redirect('/signin')
		);

		es.subscribe(
			es.flatMap(
				es.merge(
					notApi$,
					signin$
				),
				App.getIndex
			),
			({res, file}) => res.send(file)
		);

		es.subscribe(
			signinSuccess$,
			({data, req, res}) => {
				req.session.authorized = true;
				req.session.username = data.username;
				res.json(data);
			}
		);

		es.subscribe(
			signinFailed$,
			({data, res}) => res.json(data)
		);

		return {
			[ SIGNALS.GET_CONTENTS ]: App.contentsStream(),
			[ SIGNALS.GET_LECTURE ]: App.articleStream(),
			[ SIGNALS.GET_TASK ]: App.taskStream(),
			[ SIGNALS.CHECK_SIGNIN ]: App.signinStream()
		};
	}

	static indexStream() {
		const index$ = es.EventStream();

		app.get('*', (req, res, next) => {
			es.push(
				index$,
				{
					req,
					res,
					next
				}
			);
		});

		return index$
	}

	static signinStream() {
		const auth$ = es.EventStream();

		app.post('/api/signin', (req, res) => es.push(
			auth$,
			{
				req,
				res
			}
		));

		return auth$;
	}

	static contentsStream() {
		const contents$ = es.EventStream();

		app.get('/api/contents', (req, res) => es.push(
			contents$,
			{
				req,
				res
			}
		));

		return contents$;
	}

	static articleStream() {
		const articles$ = es.EventStream();

		app.get('/api/lecture/:id(\\d+)/', (req, res) => es.push(
			articles$,
			{
				id: req.params.id,
				req,
				res
			}
		));

		return articles$;
	}

	static taskStream() {
		const tasks$ = es.EventStream();

		app.get('/api/task/:id(\\d+)/', (req, res) => es.push(
			tasks$,
			{
				id: req.params.id,
				req,
				res
			}
		));

		return tasks$;
	}

	static getIndex({req, res}) {
		const file$ = es.EventStream();

		fs.readFile(__dirname + path.sep + path.join('web', 'index.html'), 'utf8', (err, file) => es.push(
			file$,
			{
				req,
				res,
				file
			}
		));

		return file$;
	}
}

new App();
new Auth();
new Contents();
new Lecture();
new Task();

app.listen(3000, () => console.log('Listen in 3000'));