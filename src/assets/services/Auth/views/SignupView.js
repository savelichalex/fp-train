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
			lastName,
			validated,
			validate$,
			send$
		} = this.props;
		const validationHandler = () => this.validateData(validate$);
		const usernameBlock =
			username ?
				<TextField hintText="Username" errorText={username} ref="username" onChange={validationHandler}></TextField> :
				<TextField hintText="Username" ref="username" onChange={validationHandler}></TextField>;

		const passwordBlock =
			password ?
				<TextField hintText="Password" errorText={password} type="password" ref="password" onChange={validationHandler}></TextField> :
				<TextField hintText="Password" type="password" ref="password" onChange={validationHandler}></TextField>;


		const firstNameBlock =
			firstName ?
				<TextField hintText="First name" errorText={firstName} type="text" ref="firstName" onChange={validationHandler}></TextField> :
				<TextField hintText="First name" type="text" ref="firstName" onChange={validationHandler}></TextField>;

		const lastNameBlock =
			lastName ?
				<TextField hintText="Last name" errorText={lastName} type="text" ref="lastName" onChange={validationHandler}></TextField> :
				<TextField hintText="Last name" type="text" ref="lastName" onChange={validationHandler}></TextField>;

		const captchaBlock =
			<input type="hidden" ref="captcha"></input>;

		const okButton =
			validated ?
				<RaisedButton onClick={() => this.sendData(send$)}>OK</RaisedButton> :
				<RaisedButton onClick={() => false} disabled={true}>OK</RaisedButton>;

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

	sendData(send$) {
		es.push(send$, this.collectData());
	}

}