'use strict';

import React, {Component} from 'react';
import {EventStream as es} from 'event-streams';

import Avatar from 'material-ui/lib/avatar';
import ListItem from 'material-ui/lib/lists/list-item';
import Colors from 'material-ui/lib/styles/colors';

export class ContentItem extends Component {

	render() {
		return (
			<ListItem
				primaryText={this.props.header}
				leftAvatar={
					<Avatar color={Colors.pinkA100} backgroundColor={Colors.transparent}>{this.props.index}</Avatar>
					}
			    onClick={() => es.push(this.props.contents$, this.props.id)}
			>
			</ListItem>
		);
	}
}