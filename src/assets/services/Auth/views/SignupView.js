'use strict';

import React, {Component} from 'react';
import es from 'event-streams';

import Card from 'material-ui/lib/card/card';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';

export class SignupView extends Component {

	render() {
		const {
			data: {
				username,
				password,
				firstName,
				lastName,
				validated
			},
			validate$
		} = this.props;
		const usernameBlock =
			username ?
				<TextField hintText="Username" errorText={username} ref="username" onEnterKeyDown={() => this.validateData(validate$)} /> :
				<TextField hintText="Username" ref="username" onEnterKeyDown={() => this.validateData(validate$)} />;

		const passwordBlock =
			password ?
				<TextField hintText="Password" errorText={password} type="password" ref="password" onEnterKeyDown={() => this.validateData(validate$)} /> :
				<TextField hintText="Password" type="password" ref="password" onEnterKeyDown={() => this.validateData(validate$)} />;


		const firstNameBlock =
			firstName ?
				<TextField hintText="First name" errorText={firstName} type="text" ref="firstName" onEnterKeyDown={() => this.validateData(validate$)} /> :
				<TextField hintText="First name" type="text" ref="firstName" onEnterKeyDown={() => this.validateData(validate$)} />;

		const lastNameBlock =
			lastName ?
				<TextField hintText="Last name" errorText={lastName} type="text" ref="lastName" onEnterKeyDown={() => this.validateData(validate$)} /> :
				<TextField hintText="Last name" type="text" ref="lastName" onEnterKeyDown={() => this.validateData(validate$)} />;

		const captchaBlock =
			<input type="hidden" ref="captcha"></input>;

		const okButton =
			validated ?
				<CircularProgress size={0.5}/> :
				<RaisedButton onClick={() => this.validateData(validate$)}>OK</RaisedButton>;

		return (
			<Card id="auth">
				<h2>Sign up</h2>
				{usernameBlock}
				{passwordBlock}
				{firstNameBlock}
				{lastNameBlock}
				{captchaBlock}
				{okButton}
			</Card>
		);
	}

	collectData() {
		return {
			username: this.refs.username.getValue(),
			password: this.refs.password.getValue(),
			firstName: this.refs.firstName.getValue(),
			lastName: this.refs.lastName.getValue(),
			captcha: this.refs.captcha.value
		};
	}

	validateData(validate$) {
		es.push(validate$, this.collectData());
	}
}