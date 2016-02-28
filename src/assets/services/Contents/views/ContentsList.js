'use strict';

import React, {Component} from 'react';
import List from 'material-ui/lib/lists/list';
import {ContentItem} from './ContentItem';

export class ContentsList extends Component {

	render() {
		const data = this.props.data.map(
			(obj, index) => <ContentItem key={index} header={obj.header} index={obj.index} id={obj.id} />
		);

		return (
			<List>
				{data}
			</List>
		);
	}

}