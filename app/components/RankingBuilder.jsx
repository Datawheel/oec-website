import React, { Component } from 'react';
import { Switch } from '@blueprintjs/core';

import './RankingBuilder.css';

class RankingsBuilder extends Component {
	render() {
		return (
			<div className="builder">
				<div className="section is-quarter">
					<div className="setting category">
						<h3>Category</h3>
						<div className="country-switch">
							<span>Country</span>
							<Switch
								onChange={(event) => this.handleValueChange('catValue', !event.currentTarget.checked)}
							/>
							<span>Product</span>
						</div>
					</div>
					<div className="setting depth">
						<h3>Depth</h3>
					</div>
				</div>
				<div className="section is-quarter">Section 2</div>
				<div className="section is-half">Section 3</div>
			</div>
		);
	}
}

export default RankingsBuilder;
