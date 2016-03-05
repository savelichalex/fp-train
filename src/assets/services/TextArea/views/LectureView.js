'use strict';

import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import CodeMirror from 'react-codemirror';
require('codemirror/mode/clojure/clojure');
import es from 'event-streams';

export class LectureView extends Component {

	render() {
		const codeMirrorOpts = {
			mode: 'clojure',
			lineNumbers: true,
			readOnly: true
		};
		return (
			<div>
				<div className="text-area">
					<ReactMarkdown source={this.props.data.text} />
					{(() => {
						if(this.props.first) {
							return <button
								onClick={() => this.onNext()}
							>Previous</button>
						} else {
							return <button
								onClick={() => this.onNext()}
							>Previous part</button>
						}
					})()}
					{(() => {
						if(this.props.last) {
							return <button
								onClick={() => this.onPrevious()}
							>Next</button>
						} else {
							return <button
								onClick={() => this.onPrevious()}
							>Next part</button>
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