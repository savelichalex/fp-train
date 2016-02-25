'use strict';

import React, {Component} from 'react';
import { EventStream as es } from 'event-streams';

export class LectureView extends Component {
	render() {
		return (
			<div>
				<h2>{this.props.data.header}</h2>
				{this.props.data.mainText.map((text, i) => <p key={i}>{text}</p> )}
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