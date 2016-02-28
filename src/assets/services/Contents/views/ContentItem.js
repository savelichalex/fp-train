'use strict';

import React, {Component} from 'react';

import Avatar from 'material-ui/lib/avatar';
import ListItem from 'material-ui/lib/lists/list-item';
import Colors from 'material-ui/lib/styles/colors';

export class ContentItem extends Component {

	render() {
		return (
			<ListItem
				primaryText={this.props.header}
				leftAvatar={
					<Avatar color={Colors.blueGrey200} backgroundColor={Colors.transparent}>{this.props.index}</Avatar>
					}
			>
			</ListItem>
		);
	}
}