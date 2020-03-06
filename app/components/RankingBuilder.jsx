import React, { Component } from 'react';
import classnames from 'classnames';
import { Button, ButtonGroup, HTMLSelect, Switch } from '@blueprintjs/core';

import './RankingBuilder.css';

class RankingsBuilder extends Component {
	render() {
		const { catValue, subnationalValue, depthValue } = this.props.variables;
		const { handleValueChange } = this.props;
		const PROD_DEPTH_OPTIONS = [ 'SITC', 'HS4', 'HS6' ];
		const REVISION_OPTIONS = [ 'HS92 - 1992', 'HS96 - 1996', 'HS02 - 2002', 'HS07 - 2007', 'HS12 - 2012' ];
		const FILTER_OPTIONS = [
			'Brazil',
			'Bolivia',
			'Canada',
			'Chile',
			'China',
			'Colombia',
			'France',
			'Germany',
			'India',
			'Japan',
			'Russia',
			'South Africa',
			'Spain',
			'Turkey',
			'United Kingdom',
			'United States',
			'Uruguay'
		];
		return (
			<div className="builder">
				<div className="section is-quarter">
					<div className="setting category">
						<h3>Category</h3>
						<div className="switch">
							<span>Country</span>
							<Switch onChange={(event) => handleValueChange('catValue', !event.currentTarget.checked)} />
							<span>Product</span>
						</div>
					</div>
					<div className="setting country-depth">
						<h3>Country Depth</h3>
						<div className="switch">
							<span>National</span>
							<Switch
								onChange={(event) => handleValueChange('subnationalValue', event.currentTarget.checked)}
							/>
							<span>Subnational</span>
						</div>
						<HTMLSelect options={FILTER_OPTIONS} disabled={subnationalValue === false ? true : false} />
					</div>
					<div className="setting product-depth last">
						<h3>Product Depth</h3>
						<ButtonGroup>
							{PROD_DEPTH_OPTIONS.map((d, k) => (
								<Button
									key={k}
									onClick={() => handleValueChange('depthValue', d)}
									className={depthValue === d && 'active'}
								>
									{d}
								</Button>
							))}
						</ButtonGroup>
						<h3>Revision</h3>
						<HTMLSelect options={REVISION_OPTIONS} />
					</div>
				</div>
				<div className="section is-quarter">
					<div className="setting">
						<h3>Period</h3>
					</div>
				</div>
				<div className="section is-half">
					<div className="setting">
						<h3>Thresholds</h3>
					</div>
				</div>
			</div>
		);
	}
}

export default RankingsBuilder;
