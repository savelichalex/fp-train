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
		return (
			<div>
				<AppBar
					title={this.props.header}
					iconElementLeft={
				        <IconButton onClick={() => history.push({pathname:'/'})}>
				            <List />
				        </IconButton>
				    }
				/>
				<div className="text-area">
					<ReactMarkdown source={this.props.data.text}/>
					{(() => {
						if(this.props.first) {
							return <RaisedButton
								backgroundColor={Colors.lightGreenA100}
								onClick={() => this.onNext()}
							>Previous</RaisedButton>
						} else {
							return <RaisedButton
								onClick={() => this.onNext()}
							>Previous part</RaisedButton>
						}
					})()}
					{(() => {
						if(this.props.last) {
							return <RaisedButton
								backgroundColor={Colors.lightGreenA100}
								onClick={() => this.onPrevious()}
							>Next</RaisedButton>
						} else {
							return <RaisedButton
								onClick={() => this.onPrevious()}
							>Next part</RaisedButton>
						}
					})()}
				</div>
				<div className="editor-area">
					<CodeMirror
						value={this.props.data.example.trim()}
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