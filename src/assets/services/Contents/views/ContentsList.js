'use strict';

import React, {Component} from 'react';
import List from 'material-ui/lib/lists/list';
import {ContentItem} from './ContentItem';

export class ContentsList extends Component {

	render() {
		const data = this.props.data.map(
			(data, key) => <ContentItem key={key} {...data} />
		);

		return (
			<div className="contents">
				<div className="contents__wrapper">
					<List style={{paddingTop: 0, paddingBottom: 0}}>
						{data}
					</List>
				</div>
			</div>
		);
	}

}