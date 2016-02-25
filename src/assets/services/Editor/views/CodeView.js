'use strict';

import React, { Component } from 'react';
import {EventStream as es} from 'event-streams';

export class CodeView extends Component {

	render() {
		return (
			<div>
				<textarea cols="30" rows="10" ref="code" value={this.props.code}></textarea>
				<button onClick={() => es.push(this.props.changes$, this.refs.code.value)}>Check code</button>
			</div>
		)
	}

}