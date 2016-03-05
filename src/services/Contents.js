'use strict';

import { BaseComponent } from 'base-components';
import es from 'event-streams';
import pg from 'pg';

import { SIGNALS, connection } from '../index';

export class Contents extends BaseComponent {
	slots() {
		return [
			SIGNALS.GET_CONTENTS
		];
	}

	main(contents$) {
		const contentsData$ =
			es.flatMap(
				contents$,
				Contents.getData
			);

		return {
			[ SIGNALS.SEND_CONTENTS ]: contentsData$
		}
	}

	static getData({res}) {
		const data$ = es.EventStream();

		pg.connect(connection, (err, client, done) => {
			if(err) {
				es.throwError(data$, err);
			} else {
				client.query('SELECT * FROM contents', (err, result) => {
					done();

					if(err) {
						es.throwError(data$, err);
					} else {
						es.push(
							data$,
							{
								data: result.rows,
								res
							}
						);
					}
				});
			}
		});

		return data$;
	}
}