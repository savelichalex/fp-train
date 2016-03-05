'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import md5 from 'md5';

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
			if(err) {
				es.throwError(fromDb$, err);
			} else {
				client.query(
					'SELECT * FROM users WHERE username=$1 AND password=$2',
					[username, md5(password)],
					(err, result) => {
						done();

						if(err) {
							es.throwError(fromDb$, err);
						} else {
							es.push(
								fromDb$,
								{
									data: result.rows[0],
									req,
									res
								}
							);
						}
					});
			}
		});

		return fromDb$;
	}
}