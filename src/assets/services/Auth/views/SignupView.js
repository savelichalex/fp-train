'use strict';

import React, {Component} from 'react';
import es from 'event-streams';

import Card from 'material-ui/lib/card/card';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

export class SignupView extends Component {

	render() {
		const {
			username,
			password,
			firstName,
			lastName
		} = this.props;
		const usernameBlock =
			username ?
				<TextField hintText="Username" errorText={username} ref="username"></TextField> :
				<TextField hintText="Username" ref="username"></TextField>;

		const passwordBlock =
			password ?
				<TextField hintText="Password" errorText={password} type="password" ref="password"></TextField> :
				<TextField hintText="Password" type="password" ref="password"></TextField>;


		const firstNameBlock =
			firstName ?
				<TextField hintText="First name" errorText={firstName} type="text" ref="firstName"></TextField> :
				<TextField hintText="First name" type="text" ref="firstName"></TextField>;

		const lastNameBlock =
			lastName ?
				<TextField hintText="Last name" errorText={lastName} type="text" ref="firstName"></TextField> :
				<TextField hintText="Last name" type="text" ref="firstName"></TextField>;

		const captchaBlock =
			<TextField type="hidden" ref="captcha"></TextField>

		return (
			<Card id="auth">
				<h2>Sign up</h2>
				{usernameBlock}
				{passwordBlock}
				{firstNameBlock}
				{lastNameBlock}
				{captchaBlock}
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