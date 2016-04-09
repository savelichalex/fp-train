'use strict';

import {BaseComponent} from 'base-components';
import es from 'event-streams';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { checkIsExistInDb } from '../util/util';

import {SIGNALS, connection} from '../index';

export class Auth extends BaseComponent {
	slots() {
		return [
			SIGNALS.CHECK_SIGNIN,
			SIGNALS.SAVE_SIGNUP
		];
	}

	main(signin$, signup$) {
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

		const doneSignin$ =
			es.flatMap(
				signup$,
				Auth.saveSignup
			);

		return {
			[ SIGNALS.SIGNIN_SUCCESS ]: signinSuccess$,
			[ SIGNALS.SIGNIN_FAILED ]: signinFailed$,
			[ SIGNALS.SIGNUP_DONE ]: doneSignin$
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

	static saveSignup({req,  res}) {
		const {
			username,
			captcha
		} = req.body;

		const captchaError$ = es.EventStream();
		if(captcha !== '') {
			es.push(
				captchaError$,
				{
					status: 400,
					message: 'No one robot pass this!'
				}
			);
		}

		const check$ = checkIsExistInDb('SELECT * FROM users WHERE username=$1', [username]);

		const save$ =
			es.map(
				es.flatMap(
					es.filter(
						check$,
						isExist => !isExist
					),
					() => Auth.insertNewUser(req.body)
				),
				({id}) => ({
					status: 200,
					message: 'Ok',
					id,
					req,
					res
				})
			);

		const exist$ =
			es.map(
				es.filter(
					check$,
					isExist => isExist
				),
				() => ({
					status: 422,
					message: {username:'User with this username is exist'},
					res
				})
			);

		return es.merge(es.merge(save$, exist$), captchaError$);
	}

	static insertNewUser({username, password, firstName, lastName}) {
		const insert$ = es.EventStream();

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				pg.connect(connection, (err, client, done) => {
					if(err) {
						es.throwError(insert$, err);
					} else {
						client.query(
							'INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id',
							[username, hash, firstName, lastName],
							(err, result) => {
							done();
							if(err) {
								es.throwError(insert$, err);
							} else {
								es.push(
									insert$,
									result.rows[0]
								);
							}
						});
					}
				});
			});
		});

		return insert$;
	}
}