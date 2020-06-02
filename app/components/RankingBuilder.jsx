/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable quotes */
import React, {Component} from 'react';
import {Button, ButtonGroup, Slider, Switch} from '@blueprintjs/core';
import classNames from "classnames";

import SimpleSelect from "components/SimpleSelect";

import {range} from 'helpers/utils';
import {SUBNATIONAL_DATASETS, REVISION_OPTIONS} from 'helpers/rankings';

import './RankingBuilder.css';

class RankingsBuilder extends Component {
	render() {
		const {
			NATIONAL_AVAILABLE,
			SUBNATIONAL_AVAILABLE,
			isCountry,
			isNational,
			isSingleyear,
			isChangeInitialYear,
			subnationalCountry,
			subnationalCountryDepth,
			subnationalProductDepth,
			productDepth,
			productRevision,
			productBasecube,
			yearInitial,
			yearFinal,
			yearRange,
			// Old Variables
			yearValue,
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
			createTable,
			showVariables
		} = this.props;

		// Set the values for the options of the custom rankings
		const OPTIONS_SUBNATIONAL = SUBNATIONAL_AVAILABLE.map(d => ({title: d.name, value: d.code}));
		const SUBNATIONAL_PRODUCT_DEPTH = SUBNATIONAL_DATASETS[subnationalCountry].productDepth.map(d => ({title: d, value: d}));
		const SUBNATIONAL_DEPTH = SUBNATIONAL_AVAILABLE.find(d => d.code === subnationalCountry).geoLevels.slice().reverse().map(d => ({title: d.name, value: d.level}));
		const PRODUCT_DEPTH = REVISION_OPTIONS.filter(d => d.available === true).map(d => ({title: d.name, value: d.value, basecube: d.basecube}));
		const PRODUCT_REV = NATIONAL_AVAILABLE.filter(d => d.basecube === productBasecube).map(d => ({title: d.title, value: d.name}));

		// Set those options in the selectors
		const OPTIONS_DEPTH = isNational ? PRODUCT_DEPTH : SUBNATIONAL_PRODUCT_DEPTH;
		const OPTIONS_REV = isNational ? PRODUCT_REV : SUBNATIONAL_DEPTH;

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
										onClick={() => (
											isNational
												? handleProductButtons('productDepth', d.title, d.basecube)
												: handleProductButtons('subnationalProductDepth', d.title, null)
										)}
										className={
											isNational
												? productDepth === d.title && 'active'
												: subnationalProductDepth === d.title && 'active'
										}
									>
										{d.title}
									</Button>
								)}
							</ButtonGroup>
							<SimpleSelect
								items={OPTIONS_REV}
								title={undefined}
								state={isNational ? 'productRevision' : 'subnationalCountryDepth'}
								selectedItem={OPTIONS_REV.find(d => isNational ? d.value === productRevision : d.value === subnationalCountryDepth) || {}}
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
									onChange={event => handlePeriodYearSwitch('isSingleyear', !event.currentTarget.checked)}
								/>
								<span>Multi-year</span>
							</div>
							{!isSingleyear &&
								<div className="switch last">
									<span>Initial Year</span>
									<Switch
										onChange={event =>
											handlePeriodRangeSwitch('isChangeInitialYear', !event.currentTarget.checked)}
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
												onClick={() => handlePeriodYearButtons(
													isSingleyear,
													isChangeInitialYear,
													isSingleyear ? 'yearFinal' : isChangeInitialYear ? 'yearInitial' : 'yearFinal',
													d
												)}
												className={classNames(
													isSingleyear
														? yearFinal === d ? 'active' : null
														: range(yearInitial, yearFinal).includes(d) ? 'active' : null
												)}
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
								/>
							</div>
						)}
						<div className="setting last">
							<div className="build-button">
								<Button onClick={() => createTable()}>Build Table</Button>
							</div>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default RankingsBuilder;
