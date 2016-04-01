'use strict';

import React from 'react';

function ErrorBlock({error}) {
	const isInternalError = typeof error !== 'string';
	const header = isInternalError ?
		`InterpretationError: ${error.message}` :
		'Assert error';
	const body = isInternalError ?
		(error.stack && error.stack) || '' :
		error;

	return (
		<div>
			<div className="editor-error-header">
				{header}
			</div>
			<div className="editor-error-body">
				{body}
			</div>
		</div>
	)
}

export function ErrorView({error}) {
	return (
		<div className="editor-error">
			{error.map((err, index) => <ErrorBlock key={index} error={err[0]} />)}
		</div>
	);
}