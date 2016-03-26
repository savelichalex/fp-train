'use strict';

import React, {Component} from 'react';
import List from 'material-ui/lib/lists/list';
import {ContentItem} from './ContentItem';

export class ContentsList extends Component {

	render() {
		const data = this.props.data.map(
			({index, header, id, type}, key) => <ContentItem key={key} header={header} index={index} id={id} type={type} />
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