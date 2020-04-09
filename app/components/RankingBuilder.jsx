import React, { Component } from 'react';
import { Button, ButtonGroup, HTMLSelect, Slider, Switch } from '@blueprintjs/core';
import { range } from 'helpers/utils';

import { subnationalCountries, subnationalData, yearsNational } from 'helpers/rankingsyears';

import './RankingBuilder.css';

class RankingsBuilder extends Component {
	render() {
		const {
			country,
			subnational,
			subnationalValue,
			productDepth,
			productRevision,
			singleyear,
			yearValue,
			rangeChangeInitial,
			yearRangeInitial,
			yearRangeFinal,
			countryExpThreshold,
			productExpThreshold,
			_authUser
		} = this.props.variables;
		const {
			handleCategorySwitch,
			handleCountrySwitch,
			handleCountrySelect,
			handleProductButtons,
			handleProductSelect,
			handlePeriodYearSwitch,
			handlePeriodYearButtons,
			handlePeriodRangeSwitch,
			handleThresholdSlider,
			renderThresholdSlider,
			apiGetData
		} = this.props;
		const PROD_DEPTH_OPTIONS = [ 'SITC', 'HS4', 'HS6' ];
		const REVISION_OPTIONS_SITC = [ 'Category', 'Section', 'Division', 'Group', 'Subgroup' ];
		const REVISION_OPTIONS_HS = [ 'HS92 - 1992', 'HS96 - 1996', 'HS02 - 2002', 'HS07 - 2007', 'HS12 - 2012' ];
		const initialYear = subnational
			? subnationalData[subnationalValue].initial
			: yearsNational[productRevision].initial;
		const finalYear = subnational ? subnationalData[subnationalValue].final : yearsNational[productRevision].final;

		console.log(
			'Country Profile:',
			country,
			'National Profile:',
			!subnational,
			'Subnational Country:',
			subnationalValue,
			'Product Depth',
			productDepth,
			'Product Revision',
			productRevision,
			'Singleyear',
			singleyear,
			'Country Threshold',
			countryExpThreshold,
			'Product Threshold',
			productExpThreshold
		);

		return (
			<div className="builder">
				<div className="section is-quarter">
					<div className="setting category">
						<h3 className="first">Category</h3>
						<div className="switch">
							<span>Country</span>
							<Switch
								onChange={(event) => handleCategorySwitch('country', !event.currentTarget.checked)}
							/>
							<span>Product</span>
						</div>
					</div>
					{_authUser && (
						<div className="setting country-depth">
							<h3 className="is-pro">Country Depth</h3>
							<div className="switch">
								<span>National</span>
								<Switch
									onChange={(event) =>
										handleCountrySwitch('subnational', event.currentTarget.checked)}
								/>
								<span>Subnational</span>
							</div>
							<HTMLSelect
								options={subnationalCountries}
								onChange={(event) =>
									handleCountrySelect(
										'subnationalValue',
										event.currentTarget.selectedOptions[0].label
									)}
								disabled={subnational === false ? true : false}
							/>
						</div>
					)}
					{!subnational && (
						<div className="setting product-depth last">
							<h3>Product Depth and Revision</h3>
							<ButtonGroup fill={true}>
								{PROD_DEPTH_OPTIONS.map((d, k) => (
									<Button
										key={k}
										onClick={() => handleProductButtons('productDepth', d)}
										className={productDepth === d && 'active'}
									>
										{d}
									</Button>
								))}
							</ButtonGroup>
							<HTMLSelect
								options={productDepth === 'SITC' ? REVISION_OPTIONS_SITC : REVISION_OPTIONS_HS}
								onChange={(event) =>
									handleProductSelect(
										'productRevision',
										productDepth === 'SITC'
											? event.currentTarget.selectedOptions[0].label
											: event.currentTarget.selectedOptions[0].label.split(' ')[0]
									)}
							/>
						</div>
					)}
					{subnational && (
						<div className="setting product-depth last">
							<h3>Product Depth</h3>
							<ButtonGroup fill={true}>
								{subnationalData[subnationalValue].productDepth.map((d, k) => (
									<Button
										key={k}
										onClick={() => handleProductButtons('productDepth', d)}
										className={productDepth === d && 'active'}
									>
										{d}
									</Button>
								))}
							</ButtonGroup>
						</div>
					)}
				</div>
				<div className="section is-quarter">
					<div className="setting last">
						<h3 className="first">Period</h3>
						<div className="switch">
							<span>Single-year</span>
							<Switch
								onChange={(event) => handlePeriodYearSwitch('singleyear', !event.currentTarget.checked)}
								// checked={range(initialYear, finalYear).length === 1 ? false : null}
							/>
							<span>Multi-year</span>
						</div>
						{!singleyear && (
							<div className="switch last">
								<span>Initial Year</span>
								<Switch
									onChange={(event) =>
										handlePeriodRangeSwitch('rangeChangeInitial', !event.currentTarget.checked)}
								/>
								<span>Final Year</span>
							</div>
						)}
						<div className="year-selector">
							{
								<ButtonGroup fill={true}>
									{range(initialYear, finalYear).map((d, k) => (
										<Button
											key={k}
											onClick={() => handlePeriodYearButtons('yearValue', d)}
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
						<h3 className="first">
							{!subnational ? (
								'Country Export Value Threshold'
							) : (
								'Subnational Geography Export Value Threshold'
							)}
						</h3>
						<Slider
							min={0}
							max={10000000000}
							stepSize={500000000}
							labelStepSize={1000000000}
							onChange={handleThresholdSlider('countryExpThreshold')}
							labelRenderer={renderThresholdSlider}
							value={countryExpThreshold}
						/>
					</div>
					<div className="setting">
						<h3>Product Export Value Threshold </h3>
						<Slider
							min={0}
							max={2000000000}
							stepSize={250000000}
							labelStepSize={500000000}
							onChange={handleThresholdSlider('productExpThreshold')}
							labelRenderer={renderThresholdSlider}
							value={productExpThreshold}
						/>
					</div>
					<div className="setting last">
						<div className="build-button">
							<Button onClick={() => apiGetData()}>Build Table</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default RankingsBuilder;
