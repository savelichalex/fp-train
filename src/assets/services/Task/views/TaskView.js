'use strict';

import React, {Component} from 'react';
import es from 'event-streams';

import ReactMarkdown from 'react-markdown';
import CodeMirror from 'react-codemirror';
import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import List from 'material-ui/lib/svg-icons/action/list';
import Colors from 'material-ui/lib/styles/colors';

import {history} from '../../Router/Router';

import {ErrorView} from './TaskErrorView';

export class TaskView extends Component {

	render() {
		const editorOpts = {
			mode: 'clojure',
			lineNumbers: true
		};
		const {
			data: {
				header,
				description,
				blank,
				test,
				nextId
			},
			error,
			success,
			check$
		} = this.props;
		const errorBlock = error ?
			<ErrorView error={error} /> :
			void 0;
		return (
			<div>
				<AppBar
					title={header}
					iconElementLeft={
				        <IconButton onClick={() => history.push({pathname:'/'})}>
				            <List />
				        </IconButton>
				    }
					iconElementRight={
				        this.renderCheckButton(error, success, test, nextId, check$)
				    }
				/>
				<div className="text-area">
					<ReactMarkdown source={description}/>
				</div>
				<div className="editor-area">
					<CodeMirror
						value={blank}
						options={editorOpts}
						ref="code"
					/>
				</div>
				{errorBlock}
			</div>
		)
	}

	renderCheckButton(error, success, test, nextId, check$) {
		return !error && !success ?
			<RaisedButton backgroundColor={Colors.lightGreenA100}
			              onClick={() => this.checkCode(test, check$)}>
				Check
			</RaisedButton> :
			error ?
				<RaisedButton backgroundColor={Colors.redA100}
				              onClick={() => this.checkCode(test, check$)}>
					Try again
				</RaisedButton> :
				<RaisedButton backgroundColor={Colors.lightGreenA100}
				              onClick={() => history.push({pathname:`/${nextId || ''}`})}>
					{nextId !== void 0 ? 'Next' : 'Done'}
				</RaisedButton>;
	}

	checkCode(test, check$) {
		this.refs.code.getCodeMirror().save();
		es.push(
			check$,
			{
				test,
				code: this.refs.code.getCodeMirror().getTextArea().value
			}
		);
	}

}