/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable quotes */
import React, {Component} from 'react';
import {Button, ButtonGroup, HTMLSelect, Slider, Switch} from '@blueprintjs/core';

import SimpleSelect from "components/SimpleSelect";

import {range} from 'helpers/utils';
import {SUBNATIONAL_COUNTRIES} from 'helpers/consts';
import {DATASETS, DATASETS_DEPTH, DATASETS_REV_HS} from 'helpers/rankingsyears';

import {subnationalData, yearsNational} from 'helpers/rankingsyears';

import './RankingBuilder.css';

class RankingsBuilder extends Component {
	render() {
		const {
			isCountry,
			isNational,
			subnationalCountry,
			subnationalDepth,
			yearInitial,
			yearFinal,
			yearRange,
			// Old Variables
			productDepth,
			productRevision,
			singleyear,
			yearValue,
			rangeChangeInitial,
			yearRangeInitial,
			yearRangeFinal,
			countryExpThreshold,
			populationThreshold,
			productExpThreshold,
			subnationalGeoThreshold,
			subnationalRCAThreshold,
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
			renderMoneyThresholdSlider,
			apiGetData
		} = this.props;

		// Set the values for the options of the custom rankings
		const SUBNATIONAL_AVAILABLE = SUBNATIONAL_COUNTRIES.filter(d => d.available === true).sort((a, b) => (a.name).localeCompare(b.name));
		const OPTIONS_SUBNATIONAL = SUBNATIONAL_AVAILABLE.map(d => ({title: d.name, value: d.code}));
		const SUBNATIONAL_DEPTH = SUBNATIONAL_AVAILABLE.find(d => d.code === subnationalCountry).geoLevels.map(d => ({title: d.name, value: d.level}));

		// Set those options in the selectors
		const OPTIONS_DEPTH = isNational ? DATASETS_DEPTH : [{title: "HS4", value: "HS4"}];
		const OPTIONS_REV = isNational ? DATASETS_REV_HS : SUBNATIONAL_DEPTH;

		console.log("subnational:", SUBNATIONAL_COUNTRIES);
		console.log("dataset", DATASETS);
		console.log(DATASETS_REV_HS, OPTIONS_SUBNATIONAL);
		console.log("subnational depth:", subnationalDepth);
		console.log('yearRange', yearRange);

		const initialYear = isNational
			? yearsNational[productRevision].initial
			: subnationalData[subnationalCountry].initial;
		const finalYear = isNational ? yearsNational[productRevision].final : subnationalData[subnationalCountry].final;

		return (
			<div className="builder columns">

				<div className="column-1-4">
					<div className="section is-first">
						<div className="setting category">
							<h3 className="first">Category</h3>
							<div className="switch">
								<span>Country</span>
								<Switch
									onChange={event => handleCategorySwitch('isCountry', !event.currentTarget.checked)}
								/>
								<span>Product</span>
							</div>
						</div>
						{_authUser &&
							<div className="setting country-depth">
								<h3 className="is-pro">Country Depth</h3>
								<div className="switch">
									<span>National</span>
									<Switch
										onChange={event => handleCountrySwitch('isNational', !event.currentTarget.checked)}
									/>
									<span>Subnational</span>
								</div>
								<SimpleSelect
									items={OPTIONS_SUBNATIONAL}
									title={undefined}
									state={"subnationalCountry"}
									selectedItem={OPTIONS_SUBNATIONAL.find(d => d.value === subnationalCountry) || {}}
									callback={(key, value) => handleCountrySelect(key, value.value)}
									disabled={isNational}
								/>
							</div>
						}
						<div className="setting product-depth last">
							<h3>
								{isNational
									? 'Product Depth and Revision'
									: 'Product Depth and Subnational Depth'
								}
							</h3>
							<ButtonGroup fill={true}>
								{OPTIONS_DEPTH.map((d, k) =>
									<Button
										key={k}
										onClick={() => handleProductButtons('productDepth', d.title)}
										className={productDepth === d.title && 'active'}
									>
										{d.title}
									</Button>
								)}
							</ButtonGroup>
							<SimpleSelect
								items={OPTIONS_REV}
								title={undefined}
								state={isNational ? 'productRevision' : 'subnationalDepth'}
								selectedItem={OPTIONS_REV.find(d => d.value === productRevision) || {}}
								callback={(key, value) => handleProductSelect(key, value.value)}
							/>
						</div>
					</div>
				</div>

				<div className="column-1-4">
					<div className="section">
						<div className="setting last">
							<h3 className="first">Period</h3>
							<div className="switch">
								<span>Single-year</span>
								<Switch
									onChange={event => handlePeriodYearSwitch('singleyear', !event.currentTarget.checked)}
								// checked={range(initialYear, finalYear).length === 1 ? false : null}
								/>
								<span>Multi-year</span>
							</div>
							{!singleyear &&
								<div className="switch last">
									<span>Initial Year</span>
									<Switch
										onChange={event =>
											handlePeriodRangeSwitch('rangeChangeInitial', !event.currentTarget.checked)}
									/>
									<span>Final Year</span>
								</div>
							}
							<div className="year-selector">
								{
									<ButtonGroup fill={true}>
										{yearRange.map((d, k) =>
											<Button
												key={k}
												onClick={() => handlePeriodYearButtons('yearValue', d)}
												className={
													singleyear
														? yearValue === d && 'active'
														: range(yearRangeInitial, yearRangeFinal).map(
															j => j === d && 'range'
														)
												}
											>
												{d}
											</Button>
										)}
									</ButtonGroup>
								}
							</div>
						</div>
					</div>
				</div>

				<div className="column-1-2">
					<div className="section">
						<div className="setting no-padding">
							<h3 className="first">
								{isNational
									? 'Country Export Value Threshold'
									: 'Country Export Value Threshold (for Basecube)'
								}
							</h3>
							<Slider
								min={0}
								max={10000000000}
								stepSize={500000000}
								labelStepSize={1000000000}
								onChange={handleThresholdSlider('countryExpThreshold')}
								labelRenderer={renderMoneyThresholdSlider}
								value={countryExpThreshold}
							/>
						</div>
						<div className="setting no-padding">
							<h3>
								{isNational
									? 'Country Population Value Threshold'
									: 'Country Population Value Threshold (for Basecube)'
								}
							</h3>
							<Slider
								min={0}
								max={5000000}
								stepSize={200000}
								labelStepSize={1000000}
								onChange={handleThresholdSlider('populationThreshold')}
								labelRenderer={renderThresholdSlider}
								value={populationThreshold}
							/>
						</div>
						<div className="setting no-padding">
							<h3>
								{isNational
									? 'Product Export Value Threshold'
									: 'Product Export Value Threshold (for Basecube)'
								}
							</h3>
							<Slider
								min={0}
								max={2000000000}
								stepSize={250000000}
								labelStepSize={500000000}
								onChange={handleThresholdSlider('productExpThreshold')}
								labelRenderer={renderMoneyThresholdSlider}
								value={productExpThreshold}
							/>
						</div>
						{!isNational && (
							<div className="setting no-padding">
								<h3>Subnational Geography Export Value Threshold</h3>
								<Slider
									min={0}
									max={500000000}
									stepSize={25000000}
									labelStepSize={100000000}
									onChange={handleThresholdSlider('subnationalGeoThreshold')}
									labelRenderer={renderMoneyThresholdSlider}
									value={subnationalGeoThreshold}
								// disabled={subnational}
								/>
							</div>
						)}
						{!isNational && (
							<div className="setting no-padding">
								<h3>Products with RCA > 1 in in Subnational Geography Threshold</h3>
								<Slider
									min={0}
									max={30}
									stepSize={5}
									labelStepSize={5}
									onChange={handleThresholdSlider('subnationalRCAThreshold')}
									labelRenderer={renderThresholdSlider}
									value={subnationalRCAThreshold}
								// disabled={subnational}
								/>
							</div>
						)}
						<div className="setting last">
							<div className="build-button">
								<Button onClick={() => apiGetData()}>Build Table</Button>
							</div>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default RankingsBuilder;
