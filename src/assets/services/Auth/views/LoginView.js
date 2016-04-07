'use strict';

import React, {Component} from 'react';
import es from 'event-streams';

import Card from 'material-ui/lib/card/card';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

export class LoginView extends Component {

	render() {
		const username =
			this.props.data.username ?
				<TextField hintText="Username" errorText="Incorrect username" ref="username"></TextField> :
				<TextField hintText="Username" ref="username"></TextField>;

		const password =
			this.props.data.password ?
				<TextField hintText="Password" errorText="Incorrect password" type="password" ref="password"></TextField> :
				<TextField hintText="Password" type="password" ref="password"></TextField>;

		return (
			<Card id="auth">
				<h2>Log in</h2>
				{username}
				{password}
				<RaisedButton onClick={() => this.collectData()}>OK</RaisedButton>
			</Card>
		);
	}

	collectData() {
		es.push(this.props.auth$, {
			username: this.refs.username.getValue(),
			password: this.refs.password.getValue()
		});
	}

}