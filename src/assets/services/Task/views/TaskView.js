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
				test
			},
			check$
		} = this.props;
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
				        <RaisedButton
								backgroundColor={Colors.lightGreenA100}
								onClick={() =>
									!this.refs.code.getCodeMirror().save() &&
									es.push(
										check$,
										{
											test,
											code: this.refs.code.getCodeMirror().getTextArea().value
										})}
							>Check</RaisedButton>
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
			</div>
		)
	}

}