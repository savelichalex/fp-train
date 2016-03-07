'use strict';

import React, {Component} from 'react';

import Avatar from 'material-ui/lib/avatar';
import ListItem from 'material-ui/lib/lists/list-item';
import Colors from 'material-ui/lib/styles/colors';

import { history } from '../../Router/Router';
import {StateModel} from '../../State/models/StateModel';

function checkAction(type, id) {
	if(StateModel.isLectureType(type)) {
		history.push({pathname:`/lecture/${id}`});
	} else if(StateModel.isTaskType(type)) {
		history.push({pathname:`/task/${id}`});
	}
}

export class ContentItem extends Component {

	render() {
		return (
			<ListItem
				primaryText={this.props.header}
				leftAvatar={
					<Avatar color={Colors.pinkA100} backgroundColor={Colors.transparent}>{this.props.index}</Avatar>
				}
			    //onClick={() => es.push(this.props.contents$, this.props.id)}
			    onClick={() => checkAction(this.props.type, this.props.id)}
			/>
		);
	}
}