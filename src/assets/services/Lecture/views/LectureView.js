'use strict';

import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import CodeMirror from 'react-codemirror';
import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import List from 'material-ui/lib/svg-icons/action/list';
import Colors from 'material-ui/lib/styles/colors';
import es from 'event-streams';

import {history} from '../../Router/Router';

export class LectureView extends Component {

	render() {
		const codeMirrorOpts = {
			mode: 'clojure',
			lineNumbers: true,
			readOnly: true
		};
		const {
			header,
			data: {
				text,
				example
			},
			first,
			last,
			prevId,
			nextId
		} = this.props;
		const prevButton =
			first ?
				(prevId !== void 0 ?
					<RaisedButton
						backgroundColor={Colors.lightGreenA100}
						onClick={() => this.onNext()}>Previous</RaisedButton> :
					void 0) :
				<RaisedButton
					onClick={() => this.onNext()}>Previous part</RaisedButton>;
		const nextButton =
			last ?
				(nextId !== void 0 ?
					<RaisedButton
						backgroundColor={Colors.lightGreenA100}
						onClick={() => this.onPrevious()}>Next</RaisedButton> :
					void 0) :
				<RaisedButton
					onClick={() => this.onPrevious()}>Next part</RaisedButton>;
		return (
			<div>
				<AppBar
					title={header}
					iconElementLeft={
				        <IconButton onClick={() => history.push({pathname:'/'})}>
				            <List />
				        </IconButton>
				    }
				/>
				<div className="text-area">
					<ReactMarkdown source={text}/>
					{prevButton}
					{nextButton}
				</div>
				<div className="editor-area">
					<CodeMirror
						value={example.trim()}
						options={codeMirrorOpts}
					/>
				</div>
			</div>
		);
	}

	onNext() {
		es.push(this.props.previous$, this.props.index - 1);
	}

	onPrevious() {
		es.push(this.props.next$, this.props.index + 1)
	}
}