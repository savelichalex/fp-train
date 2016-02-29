'use strict';

import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import { EventStream as es } from 'event-streams';

export class LectureView extends Component {

	componentWillMount() {
	}

	render() {
		return (
			<div>
				<h2>{this.props.data.header}</h2>
				<ReactMarkdown source={this.props.data.text} />
				{(() => {
					if(this.props.data.previousId) {
						return <button
							onClick={() => es.push(this.props.previous$, this.props.data.previousId)}
						>Previous</button>
					}
				})()}
				{(() => {
					if(this.props.data.nextId) {
						return <button
							onClick={() => es.push(this.props.next$, this.props.data.nextId)}
						>Next</button>
					}
				})()}
			</div>
		);
	}
}