'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import bcrypt from 'bcrypt';

import {SIGNALS, connection} from '../index';

export class Auth extends BaseComponent {
	slots() {
		return [
			SIGNALS.CHECK_SIGNIN
		];
	}

	main(signin$) {
		const checkSignin$ =
			es.flatMap(
				signin$,
				Auth.checkSignin
			);

		const signinSuccess$ =
			es.filter(
				checkSignin$,
				({data}) => data !== void 0
			);

		const signinFailed$ =
			es.map(
				es.filter(
					checkSignin$,
					({data}) => data === void 0
				),
				({res}) => {
					return {
						data: {
							username: true,
							password: true
						},
						res
					}
				}
			);

		return {
			[ SIGNALS.SIGNIN_SUCCESS ]: signinSuccess$,
			[ SIGNALS.SIGNIN_FAILED ]: signinFailed$
		};
	}

	static checkSignin({req, res}) {
		const fromDb$ = es.EventStream();
		const {username, password} = req.body;

		pg.connect(connection, (err, client, done) => {
			if (err) {
				es.throwError(fromDb$, err);
			} else {
				client.query(
					'SELECT * FROM users WHERE username=$1',
					[username],
					(err, result) => {
						done();

						if (err) {
							es.throwError(fromDb$, err);
						} else {
							bcrypt.compare(password, result.rows[0].password, (err, r) => {
								if(err) {
									es.throwError(fromDb$, err);
								} else {
									if(r) {
										es.push(
											fromDb$,
											{
												data: result.rows[0],
												req,
												res
											}
										);
									} else {
										es.push(
											fromDb$,
											{
												data: void 0,
												req,
												res
											}
										);
									}
								}
							});
						}
					});
			}
		});

		return fromDb$;
	}
}