/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable quotes */
import React, {Component} from 'react';
import {Button, ButtonGroup, HTMLSelect, Slider, Switch} from '@blueprintjs/core';
import {range} from 'helpers/utils';
import SimpleSelect from "components/SimpleSelect";
import {subnationalCountries, subnationalData, yearsNational} from 'helpers/rankingsyears';

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
		// const PROD_DEPTH_OPTIONS = [ 'SITC', 'HS4', 'HS6' ];
		const PROD_DEPTH_OPTIONS = ['HS4', 'HS6'];
		const REVISION_OPTIONS_SITC = ['Category', 'Section', 'Division', 'Group', 'Subgroup'];
		const REVISION_OPTIONS_HS = ['HS92 - 1992', 'HS96 - 1996', 'HS02 - 2002', 'HS07 - 2007', 'HS12 - 2012'];
		const initialYear = subnational
			? subnationalData[subnationalValue].initial
			: yearsNational[productRevision].initial;
		const finalYear = subnational ? subnationalData[subnationalValue].final : yearsNational[productRevision].final;
		let revisionItems = productDepth === 'SITC' ? REVISION_OPTIONS_SITC : REVISION_OPTIONS_HS;
		revisionItems = revisionItems.map(d => ({value: d.split(" ")[0], title: d}));
		const subnationalItems = subnationalCountries.map(d => ({title: d, value: d}));
		return (
			<div className="builder columns">
				<div className="column-1-4">
					<div className="section is-first">
						<div className="setting category">
							<h3 className="first">Category</h3>
							<div className="switch">
								<span>Country</span>
								<Switch
									onChange={event => handleCategorySwitch('country', !event.currentTarget.checked)}
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
										onChange={event =>
											handleCountrySwitch('subnational', event.currentTarget.checked)}
										disabled={!_authUser}
									/>
									<span>Subnational</span>
								</div>
								<SimpleSelect
									items={subnationalItems}
									title={undefined}
									state={"subnationalValue"}
									selectedItem={subnationalItems.find(d => d.value === subnationalValue) || {}}
									callback={(key, value) => handleCountrySelect(key, value.value)}
									disabled={!subnational}
								/>
							</div>
						}
						{!subnational &&
							<div className="setting product-depth last">
								<h3>Product Depth and Revision</h3>
								<ButtonGroup fill={true}>
									{PROD_DEPTH_OPTIONS.map((d, k) =>
										<Button
											key={k}
											onClick={() => handleProductButtons('productDepth', d)}
											className={productDepth === d && 'active'}
										>
											{d}
										</Button>
									)}
								</ButtonGroup>
								<SimpleSelect
									items={revisionItems}
									title={undefined}
									state={"productRevision"}
									selectedItem={revisionItems.find(d => d.value === productRevision) || {}}
									callback={(key, value) => handleProductSelect(key, value.value)}
								/>
							</div>
						}
						{subnational &&
							<div className="setting product-depth last">
								<h3>Product Depth</h3>
								<ButtonGroup fill={true}>
									{subnationalData[subnationalValue].productDepth.map((d, k) =>
										<Button
											key={k}
											onClick={() => handleProductButtons('productDepth', d)}
											className={productDepth === d && 'active'}
										>
											{d}
										</Button>
									)}
								</ButtonGroup>
							</div>
						}
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
										{range(initialYear, finalYear).map((d, k) =>
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
								{!subnational
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
								{!subnational
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
								{!subnational
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
						{subnational && (
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
						{subnational && (
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
