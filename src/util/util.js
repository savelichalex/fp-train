'use strict';

import es from 'event-streams';
import pg from 'pg';
import fs from 'fs';
import {connection} from '../index';

export function fromFile(file) {
	const fromFile$ = es.EventStream();

	fs.readFile(file, 'utf8', (err, file) => {
		if(err) {
			es.throwError(fromFile$, err);
		} else {
			es.push(
				fromFile$,
				file
			);
		}
	});

	return fromFile$;
}

export function selectOneFromDb(query, args) {
	const fromDb$ = es.EventStream();

	pg.connect(connection, (err, client, done) => {
		if(err) {
			es.throwError(fromDb$, err);
		} else {
			client.query(query, args, (err, result) => {
				done();

				if(err) {
					es.throwError(fromDb$, err);
				} else {
					es.push(
						fromDb$,
						result.rows[ 0 ]
					);
				}
			});
		}
	});

	return fromDb$;
}