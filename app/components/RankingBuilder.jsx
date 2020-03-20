import React, { Component } from 'react';
import classnames from 'classnames';
import { Button, ButtonGroup, HTMLSelect, Slider, Switch } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { range } from 'helpers/utils';

import './RankingBuilder.css';

class RankingsBuilder extends Component {
	render() {
		const {
			country,
			subnational,
			productDepth,
			productRevision,
			singleyear,
			initialYear,
			yearValue,
			rangeChangeInitial,
			yearRangeInitial,
			yearRangeFinal,
			countryExpThreshold,
			productExpThreshold
		} = this.props.variables;
		const {
			handleValueChange,
			resetValueChange,
			handleYearRangeChange,
			renderExportThresholdLabel,
			getChangeHandler,
			recalculateData
		} = this.props;
		const PROD_DEPTH_OPTIONS = [ 'SITC', 'HS4', 'HS6' ];
		const REVISION_OPTIONS_SITC = [ 'Tier 1 Product', 'Tier 2 Product', 'Tier 3 Product', 'Tier 4 Product' ];
		const REVISION_OPTIONS_HS = [ 'HS92 - 1992', 'HS96 - 1996', 'HS02 - 2002', 'HS07 - 2007', 'HS12 - 2012' ];
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
						<h3 className="first">Category</h3>
						<div className="switch">
							<span>Country</span>
							<Switch onChange={(event) => handleValueChange('country', !event.currentTarget.checked)} />
							<span>Product</span>
						</div>
					</div>
					<div className="setting country-depth">
						<h3>Country Depth</h3>
						<div className="switch">
							<span>National</span>
							<Switch
								onChange={(event) => handleValueChange('subnational', event.currentTarget.checked)}
							/>
							<span>Subnational</span>
						</div>
						<HTMLSelect
							options={FILTER_OPTIONS}
							onChange={(event) =>
								handleValueChange('subnationalValue', event.currentTarget.selectedOptions[0].label)}
							// disabled={subnational === false ? true : false}
							disabled={true}
						/>
					</div>
					<div className="setting product-depth last">
						<h3>Product Depth and Revision</h3>
						<ButtonGroup fill={true}>
							{PROD_DEPTH_OPTIONS.map((d, k) => (
								<Button
									key={k}
									onClick={() => resetValueChange('productDepth', d)}
									className={productDepth === d && 'active'}
								>
									{d}
								</Button>
							))}
						</ButtonGroup>
						<HTMLSelect
							options={productDepth === 'SITC' ? REVISION_OPTIONS_SITC : REVISION_OPTIONS_HS}
							onChange={(event) =>
								handleValueChange(
									'productRevision',
									productDepth === 'SITC'
										? event.currentTarget.selectedOptions[0].label
										: event.currentTarget.selectedOptions[0].label.split(' ')[0]
								)}
						/>
					</div>
				</div>
				<div className="section is-quarter">
					<div className="setting">
						<h3 className="first">Period</h3>
						<div className="switch">
							<span>Single-year</span>
							<Switch
								onChange={(event) => handleValueChange('singleyear', !event.currentTarget.checked)}
							/>
							<span>Multi-year</span>
						</div>
						{!singleyear && (
							<div className="switch last">
							<span>Initial Year</span>
							<Switch
								onChange={(event) => handleValueChange('rangeChangeInitial', !event.currentTarget.checked)}
							/>
							<span>Final Year</span>
						</div>
						)}
						<div className="year-selector">
							{
								<ButtonGroup fill={true}>
									{range(initialYear[productRevision], 2017).map((d, k) => (
										<Button
											key={k}
											onClick={() =>
												singleyear
													? resetValueChange('yearValue', d)
													: handleYearRangeChange(d)}
											className={
												singleyear ? (
													yearValue === d && 'active'
												) : (
													range(yearRangeInitial, yearRangeFinal).map(
														(j) => j === d && 'range'
													)
												)
											}
										>
											{d}
										</Button>
									))}
								</ButtonGroup>
							}
						</div>
					</div>
				</div>
				<div className="section is-half">
					<div className="setting">
						<h3 className="first">Country Export Value Threshold </h3>
						<Slider
							min={0}
							max={1000000000}
							stepSize={50000000}
							labelStepSize={100000000}
							onChange={getChangeHandler('countryExpThreshold')}
							labelRenderer={renderExportThresholdLabel}
							value={countryExpThreshold}
						/>
					</div>
					<div className="setting">
						<h3>Product Export Value Threshold </h3>
						<Slider
							min={0}
							max={1000000000}
							stepSize={50000000}
							labelStepSize={100000000}
							onChange={getChangeHandler('productExpThreshold')}
							labelRenderer={renderExportThresholdLabel}
							value={productExpThreshold}
						/>
					</div>
					<div className="setting last">
						<div className="build-button">
							<Button onClick={() => recalculateData()}>Build Table</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default RankingsBuilder;
