'use strict';

import React, { Component } from 'react';
import { EventStream as es } from 'event-streams';

export class LoginView extends Component {

	render() {
		const username =
			this.props.data.username ?
				<input type="text" placeholder="Username" ref="username" style={{border: '1px solid red'}}/> :
				<input type="text" placeholder="Username" ref="username"/>;

		const password =
			this.props.data.password ?
				<input type="text" placeholder="Password" ref="password" style={{border: '1px solid red'}}/> :
				<input type="text" placeholder="Password" ref="password"/>;

		return (
			<div>
				<h2>Log in</h2>
				{username}
				{password}
				<button onClick={() => this.collectData()}>OK</button>
			</div>
		);
	}

	collectData() {
		es.push(this.props.auth$, {
			username: this.refs.username.value,
			password: this.refs.password.value
		});
	}

}