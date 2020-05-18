import React, {Component} from 'react';
import Helmet from 'react-helmet';
import axios from 'axios';
import numeral from 'numeral';
import {hot} from 'react-hot-loader/root';
import {isAuthenticated} from '@datawheel/canon-core';
import {connect} from 'react-redux';
import {withNamespaces} from 'react-i18next';
import {formatAbbreviate} from 'd3plus-format';
import {Icon} from '@blueprintjs/core';

import OECNavbar from 'components/OECNavbar';
import Footer from 'components/Footer';
import Loading from 'components/Loading';
import RankingText from 'components/RankingText';
import RankingBuilder from 'components/RankingBuilder';
import RankingTable from 'components/RankingTable';

import {range, normalizeString} from 'helpers/utils';
import {subnationalCountries, subnationalData, yearsNational} from 'helpers/rankingsyears';
import {SUBNATIONAL_COUNTRIES} from 'helpers/consts';

class Custom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			country: true,
			subnational: false,
			subnationalValue: null,
			productDepth: null,
			productRevision: null,
			singleyear: true,
			yearValue: null,
			rangeChangeInitial: true,
			yearRangeInitial: null,
			yearRangeFinal: null,
			countryExpThreshold: null,
			populationThreshold: null,
			productExpThreshold: null,
			subnationalGeoThreshold: null,
			subnationalRCAThreshold: null,
			data: null,
			columns: null,
			_ready: false,
			_loading: false
		};
		this.handleCategorySwitch = this.handleCategorySwitch.bind(this);
		this.handleCountrySwitch = this.handleCountrySwitch.bind(this);
		this.handleCountrySelect = this.handleCountrySelect.bind(this);
		this.handleProductButtons = this.handleProductButtons.bind(this);
		this.handleProductSelect = this.handleProductSelect.bind(this);
		this.handlePeriodYearSwitch = this.handlePeriodYearSwitch.bind(this);
		this.handlePeriodYearButtons = this.handlePeriodYearButtons.bind(this);
		this.handlePeriodRangeSwitch = this.handlePeriodRangeSwitch.bind(this);
		this.handleThresholdSlider = this.handleThresholdSlider.bind(this);
		this.renderThresholdSlider = this.renderThresholdSlider.bind(this);
		this.renderMoneyThresholdSlider = this.renderMoneyThresholdSlider.bind(this);
		this.apiGetData = this.apiGetData.bind(this);
	}

	// Set default variables after the first run of code
	componentDidMount() {
		const defaultDepth = 'HS4';
		const defaultRevision = 'HS92';
		const defaultCountryThreshold = 1000000000;
		const defaultPopulationThreshold = 1000000;
		const defaultProductThreshold = 500000000;
		const defaultSubnationalGeoThreshold = 100000000;
		const defaultSubnationalRCAThreshold = 10;

		this.setState({
			subnationalValue: subnationalCountries[0],
			productDepth: defaultDepth,
			productRevision: defaultRevision,
			yearValue: yearsNational[defaultRevision].final,
			yearRangeInitial: yearsNational[defaultRevision].final - 1,
			yearRangeFinal: yearsNational[defaultRevision].final,
			countryExpThreshold: defaultCountryThreshold,
			populationThreshold: defaultPopulationThreshold,
			productExpThreshold: defaultProductThreshold,
			subnationalGeoThreshold: defaultSubnationalGeoThreshold,
			subnationalRCAThreshold: defaultSubnationalRCAThreshold,
			_ready: true
		});
	}

	// Execute props for checking if it's a pro user
	componentWillMount() {
		this.props.isAuthenticated();
	}

	/* BUILDER ORIENTED FUNCTIONS */
	// Handle the Category Switch
	handleCategorySwitch(key, value) {
		this.setState({[key]: value});
	}

	// Handle the Country Switch
	handleCountrySwitch(key, value) {
		const {subnational, subnationalValue, productRevision} = this.state;
		if (subnational) {
			this.setState({
				[key]: value,
				productDepth: 'HS4',
				productRevision: 'HS92',
				yearValue: yearsNational[productRevision].final,
				yearRangeInitial: yearsNational[productRevision].final - 1,
				yearRangeFinal: yearsNational[productRevision].final
			});
		} else {
			this.setState({
				[key]: value,
				productDepth: 'HS4',
				productRevision: 'HS92',
				yearValue: subnationalData[subnationalValue].final,
				yearRangeInitial: subnationalData[subnationalValue].final - 1,
				yearRangeFinal: subnationalData[subnationalValue].final
			});
		}
	}

	// Handle the Country Select
	handleCountrySelect(key, value) {
		this.setState({
			[key]: value,
			productDepth: 'HS4',
			yearValue: subnationalData[value].final,
			yearRangeInitial: subnationalData[value].final - 1,
			yearRangeFinal: subnationalData[value].final
		});
	}

	// Handle the Product Button
	handleProductButtons(key, value) {
		const {productRevision} = this.state;
		if (this.state[key] !== 'SITC' && value === 'SITC') {
			this.setState({
				[key]: value,
				productRevision: 'Category',
				yearValue: yearsNational[productRevision].final,
				yearRangeInitial: yearsNational[productRevision].final - 1,
				yearRangeFinal: yearsNational[productRevision].final
			});
		} else if (this.state[key] === 'SITC' && value !== 'SITC') {
			this.setState({
				[key]: value,
				productRevision: 'HS92',
				yearValue: yearsNational[productRevision].final,
				yearRangeInitial: yearsNational[productRevision].final - 1,
				yearRangeFinal: yearsNational[productRevision].final
			});
		} else {
			this.setState({[key]: value});
		}
	}

	// Handle the Product Select
	handleProductSelect(key, value) {
		const {productRevision} = this.state;
		this.setState({
			[key]: value,
			yearValue: yearsNational[productRevision].final,
			yearRangeInitial: yearsNational[productRevision].final - 1,
			yearRangeFinal: yearsNational[productRevision].final
		});
	}

	// Handle the Period Year Switch
	handlePeriodYearSwitch(key, value) {
		this.setState({[key]: value});
	}

	// Handle the Period Year Buttons
	handlePeriodYearButtons(key, value) {
		const {singleyear, productRevision, rangeChangeInitial, yearRangeInitial, yearRangeFinal} = this.state;
		if (singleyear) {
			this.setState({[key]: value});
		} else {
			if (rangeChangeInitial) {
				if (value === yearsNational[productRevision].final) {
					this.setState({yearRangeInitial: value - 1, yearRangeFinal: value});
				} else if (value < yearRangeInitial) {
					this.setState({yearRangeInitial: value});
				} else if (yearRangeInitial < value && value < yearRangeFinal) {
					if (range(value, yearRangeFinal).length >= 2) {
						this.setState({yearRangeInitial: value});
					}
				} else if (yearRangeFinal < value) {
					this.setState({yearRangeInitial: value, yearRangeFinal: value + 1});
				}
			} else {
				if (value === yearsNational[productRevision].initial) {
					this.setState({yearRangeInitial: value, yearRangeFinal: value + 1});
				} else if (value < yearRangeInitial) {
					this.setState({yearRangeInitial: value - 1, yearRangeFinal: value});
				} else if (yearRangeInitial < value && value < yearRangeFinal) {
					if (range(yearRangeInitial, value).length >= 2) {
						this.setState({yearRangeFinal: value});
					}
				} else if (yearRangeFinal < value) {
					this.setState({yearRangeFinal: value});
				}
			}
		}
	}

	// Handle the Period Switch for change initial and final year
	handlePeriodRangeSwitch(key, value) {
		this.setState({[key]: value});
	}

	// Handle the Thresholds Sliders
	handleThresholdSlider(key) {
		return (value) => this.setState({[key]: value});
	}

	// Render the Threshold values in Slider for normal values
	renderThresholdSlider(val) {
		return `${formatAbbreviate(val)}`;
	}

	// Handle the Threshold values in Slider for money values
	renderMoneyThresholdSlider(val) {
		return `$${formatAbbreviate(val)}`;
	}

	/* TABLE ORIENTED FUNCTIONS*/
	/* NEW LOGIC*/


	/* OLD LOGIC*/
	// Aggregate years for the rest of functions
	yearAggregation(year, initial) {
		if (year === initial) {
			return [year];
		} else if (year === initial + 1) {
			return [year - 1, year];
		} else {
			return [year - 2, year - 1, year];
		}
	}

	// Create the path of the data required
	pathCreator(years) {
		const {
			country,
			subnational,
			subnationalValue,
			productDepth,
			productRevision,
			countryExpThreshold,
			populationThreshold,
			productExpThreshold,
			subnationalGeoThreshold,
			subnationalRCAThreshold
		} = this.state;
		const index = country ? 'eci' : 'pci';
		const populationYear = years[2] < 2018 ? years[2] : 2018;

		let pathYears = null;
		let pathMultiplicatorThreshold = null;

		if (years.length === 1) {
			pathYears = `${years[0]}`;
			pathMultiplicatorThreshold = 1;
		} else if (years.length === 2) {
			pathYears = `${years[0]},${years[1]}`;
			pathMultiplicatorThreshold = 2;
		} else {
			pathYears = `${years[0]},${years[1]},${years[2]}`;
			pathMultiplicatorThreshold = 3;
		}

		if (!subnational) {
			if (productDepth !== 'SITC') {
				return `/api/stats/${index}?cube=trade_i_baci_a_${productRevision.substr(
					2
				)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYears}&ranking=true
				&threshold=Country:${countryExpThreshold * pathMultiplicatorThreshold},${productDepth}:${productExpThreshold * pathMultiplicatorThreshold},Population:${populationThreshold}&YearPopulation=${populationYear}`;
			} else {
				return `/api/stats/${index}?cube=trade_i_oec_a_sitc2&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYears}&ranking=true
				&threshold=Country:${countryExpThreshold * pathMultiplicatorThreshold},${productDepth}:${productExpThreshold * pathMultiplicatorThreshold},Population:${populationThreshold}&YearPopulation=${populationYear}`;
			}
		} else {
			const basecube = subnationalData[subnationalValue].basecube;
			let yearRight = null;
			let yearPopulationRight = null;

			if (years.length === 1) {
				yearRight = years[0] > 2018 ? '2018' : `${years[0]}`;
			} else if (years.length === 2) {
				yearRight = years[1] > 2018 ? '2017,2018' : `${years[0]},${years[1]}`;
			} else {
				yearRight = years[2] > 2018 ? `2016,2017,2018` : `${years[0]},${years[1]},${years[2]}`;
			}

			if (basecube === 'HS') {
				return `/api/stats/${index}?cube=trade_s_${subnationalData[subnationalValue]
					.cube}&rca=${subnationalData[subnationalValue]
						.geo},${productDepth},Trade+Value&Year=${pathYears}&ranking=true&method=subnational&cubeRight=trade_i_baci_a_92&rcaRight=Exporter+Country,${productDepth},Trade+Value&YearRight=${yearRight}&aliasRight=Country,${productDepth}&Trade+Flow=2
						&threshold=CountryRight:${countryExpThreshold * pathMultiplicatorThreshold},${productDepth}Right:${productExpThreshold * pathMultiplicatorThreshold},PopulationRight:${populationThreshold},Subnat+Geography:${subnationalGeoThreshold * pathMultiplicatorThreshold}&YearPopulation=${populationYear}${index === "eci" ? `&eciThreshold=Subnat+Geography:${subnationalRCAThreshold}` : ''}`;
			} else if (basecube === 'SITC') {
				return `/api/stats/${index}?cube=trade_s_${subnationalData[subnationalValue]
					.cube}&rca=${subnationalData[subnationalValue]
						.geo},${productDepth},Trade+Value&Year=${pathYears}&ranking=true&method=subnational&cubeRight=trade_i_comtrade_a_sitc2_new&rcaRight=Reporter+Country,${productDepth},Trade+Value&YearRight=${yearRight}&aliasRight=Country,${productDepth}&Trade+Flow=2
						&threshold=CountryRight:${countryExpThreshold * pathMultiplicatorThreshold},${productDepth}Right:${productExpThreshold * pathMultiplicatorThreshold},PopulationRight:${populationThreshold},Subnat+Geography:${subnationalGeoThreshold * pathMultiplicatorThreshold}&YearPopulation=${populationYear}${index === "eci" ? `&eciThreshold=Subnat+Geography:${subnationalRCAThreshold}` : ''}
						`;
			}
		}
	}

	// Build the data request from the server
	apiGetData() {
		this.setState({_loading: true});
		const {
			singleyear,
			subnational,
			subnationalValue,
			productRevision,
			yearValue,
			yearRangeInitial,
			yearRangeFinal
		} = this.state;

		if (singleyear) {
			const aggregatedYears = subnational
				? this.yearAggregation(yearValue, subnationalData[subnationalValue].initial)
				: this.yearAggregation(yearValue, yearsNational[productRevision].initial);
			const path = this.pathCreator(aggregatedYears);
			this.fetchSingleyearData(path);
		} else {
			const dataInitial = subnational
				? subnationalData[subnationalValue].initial
				: yearsNational[productRevision].initial;
			const dataFinal = subnational
				? subnationalData[subnationalValue].final
				: yearsNational[productRevision].final;
			const dataLength = range(dataInitial, dataFinal).length;
			if (dataLength === 1) {
				const aggregatedYears = subnational
					? this.yearAggregation(yearValue, subnationalData[subnationalValue].initial)
					: this.yearAggregation(yearValue, yearsNational[productRevision].initial);
				const path = this.pathCreator(aggregatedYears);
				this.fetchSingleyearData(path);
			} else {
				const pathArray = [];
				range(yearRangeInitial, yearRangeFinal).map((d) => {
					const aggregatedYears = subnational
						? this.yearAggregation(d, subnationalData[subnationalValue].initial)
						: this.yearAggregation(d, yearsNational[productRevision].initial);
					const path = this.pathCreator(aggregatedYears);
					pathArray.push({year: d, path});
				});

				this.fetchMultiyearData(pathArray);
			}
		}
	}

	// Get name of selector for the returned data
	getSelector = (country) => {
		const {subnational, subnationalValue, productDepth, productRevision} = this.state;

		let selector = null;

		if (!subnational) {
			if (country) {
				selector = 'Country';
			} else {
				if (productDepth !== 'SITC') {
					selector = `${productDepth}`;
				} else {
					selector = `${productRevision}`;
				}
			}
		} else {
			if (country) {
				selector = subnationalData[subnationalValue].geo;
			} else {
				const basecube = subnationalData[subnationalValue].basecube;
				if (basecube === 'HS') {
					selector = `${productDepth}`;
				} else if (basecube === 'SITC') {
					selector = `${productDepth}`;
				}
			}
		}

		return selector;
	};

	// Calls the data from the server for a singleyear
	fetchSingleyearData = (path) => {
		const {country, singleyear, yearValue} = this.state;
		axios.all([axios.get(path)]).then(
			axios.spread((resp) => {
				const array = resp.data.data;
				const measure = country ? 'ECI' : 'PCI';
				const selector = this.getSelector(country);

				let data = {};
				for (const index in array) {
					let row = {};
					row[selector] = array[index][selector];
					row[selector + ' ID'] = array[index][selector + ' ID'];
					let values = {};
					values[yearValue + ' ' + measure] = array[index]['Trade Value ' + measure];
					values[yearValue + ' Ranking'] = array[index]['Trade Value ' + measure + ' Ranking'];
					data[row[selector + ' ID']] = row;
					data[row[selector + ' ID']][yearValue] = values;
				}
				const finalData = Object.values(data);

				finalData.sort(
					(a, b) => a[yearValue][`${yearValue} Ranking`] - b[`${yearValue}`][`${yearValue} Ranking`]
				);

				const columns = this.createColumns(singleyear, yearValue);

				this.setState({
					data: finalData,
					columns,
					_loading: false
				});
			})
		);
	};

	// Calls the data from the server for multiyears
	fetchMultiyearData = async (paths) => {
		const {singleyear, yearRangeInitial, yearRangeFinal} = this.state;

		const finalData = await this.groupData(paths);

		const columns = await this.createColumns(singleyear, [yearRangeInitial, yearRangeFinal]);

		this.setState({
			data: finalData,
			columns,
			_loading: false
		});
	};

	// Functions for grouping data
	// Transform data into one array
	groupData = async (array) => {
		const {country, yearRangeInitial, yearRangeFinal} = this.state;

		const measure = country ? 'ECI' : 'PCI';

		const selector = this.getSelector(country);

		let data = {};
		let dataLength = {};

		for (const path of array) {
			const pathData = await axios.get(path.path).then((resp) => resp.data.data);

			// Appends the data in "data"
			for (const index in pathData) {
				let row = {};
				row[selector] = pathData[index][selector];
				row[selector + ' ID'] = pathData[index][selector + ' ID'];
				let values = {};
				values[path.year + ' ' + measure] = pathData[index]['Trade Value ' + measure];
				values[path.year + ' Ranking'] = pathData[index]['Trade Value ' + measure + ' Ranking'];

				if (!data[pathData[index][selector + ' ID']]) {
					data[row[selector + ' ID']] = row;
					data[row[selector + ' ID']][path.year] = values;
				} else {
					data[row[selector + ' ID']][path.year] = values;
				}
			}

			if (path.year === yearRangeFinal) {
				dataLength = pathData.length;
			}
		}

		let flag = 1;
		const finalData = Object.values(data).map((m) => {
			range(yearRangeInitial, yearRangeFinal).map((year) => {
				if (year === yearRangeFinal) {
					if (!Object.keys(m).includes(year.toString())) {
						m[year] = {};
						m[year][`${year} ${measure}`] = -1000;
						m[year][`${year} Ranking`] = dataLength + flag;
						flag = flag + 1;
					}
				} else {
					if (!Object.keys(m).includes(year.toString())) {
						m[year] = {};
						m[year][`${year} ${measure}`] = -1000;
					}
				}
			});
			return m;
		});

		finalData.sort(
			(a, b) =>
				a[yearRangeFinal][`${yearRangeFinal} Ranking`] - b[`${yearRangeFinal}`][`${yearRangeFinal} Ranking`]
		);

		return finalData;
	};

	// Creates the columns for the tables
	createColumns(type, array) {
		const {country, subnational, subnationalValue, productDepth, productRevision} = this.state;
		let years = null;
		const dataInitial = subnational
			? subnationalData[subnationalValue].initial
			: yearsNational[productRevision].initial;
		const dataFinal = subnational ? subnationalData[subnationalValue].final : yearsNational[productRevision].final;
		const dataLength = range(dataInitial, dataFinal).length;
		if (dataLength === 1) {
			years = [array, array];
		} else {
			years = type ? [array, array] : array;
		}

		const columnID = {
			id: 'ranking',
			Header: '',
			className: 'col-id',
			Cell: (props) => props.index + 1,
			width: 40,
			sortable: false
		};

		let columnNAME = {};
		if (!subnational) {
			// National Columns
			if (country) {
				columnNAME = {
					id: 'category',
					accessor: (d) => d.Country,
					width: 400,
					Header: () => (
						<div className="header">
							<span className="year">{'Country'}</span>
							<div className="icons">
								<Icon icon={'caret-up'} iconSize={16} />
								<Icon icon={'caret-down'} iconSize={16} />
							</div>
						</div>
					),
					style: {whiteSpace: 'unset'},
					Cell: (props) => (
						<div className="category">
							<img
								src={`/images/icons/country/country_${props.original['Country ID'].substr(
									props.original['Country ID'].length - 3
								)}.png`}
								alt="icon"
								className="icon"
							/>
							<a
								href={`/en/profile/country/${props.original['Country ID'].substr(
									props.original['Country ID'].length - 3
								)}`}
								className="link"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="name">{props.original.Country}</div>
								<Icon icon={'chevron-right'} iconSize={14} />
							</a>
						</div>
					)
				};
			} else {
				if (productDepth !== 'SITC') {
					columnNAME = {
						id: 'category',
						accessor: (d) => d[`${productDepth}`],
						width: 400,
						Header: () => (
							<div className="header">
								<span className="year">{'Product'}</span>
								<div className="icons">
									<Icon icon={'caret-up'} iconSize={16} />
									<Icon icon={'caret-down'} iconSize={16} />
								</div>
							</div>
						),
						style: {whiteSpace: 'unset'},
						Cell: (props) => (
							<div className="category">
								<img
									src={`/images/icons/hs/hs_${props.original[`${productDepth} ID`]
										.toString()
										.substr(
											0,
											props.original[`${productDepth} ID`].toString().length * 1 -
											productDepth.substr(2) * 1
										)}.svg`}
									alt="icon"
									className="icon"
								/>
								{productRevision === 'HS92' ? (
									<a
										href={`/en/profile/${productRevision.toLowerCase()}/${props.original[
											`${productDepth} ID`
										]}`}
										className="link"
										target="_blank"
										rel="noopener noreferrer"
									>
										<div className="name">{props.original[`${productDepth}`]}</div>
										<Icon icon={'chevron-right'} iconSize={14} />
									</a>
								) : (
										<div className="link">
											<div className="name">{props.original[`${productDepth}`]}</div>
										</div>
									)}
							</div>
						)
					};
				} else {
					columnNAME = {
						id: 'category',
						accessor: (d) => d[`${productRevision}`],
						width: 400,
						Header: () => (
							<div className="header">
								<span className="year">{'Product'}</span>
								<div className="icons">
									<Icon icon={'caret-up'} iconSize={16} />
									<Icon icon={'caret-down'} iconSize={16} />
								</div>
							</div>
						),
						style: {whiteSpace: 'unset'},
						Cell: (props) => (
							<div className="category">
								<img
									src={`/images/icons/sitc/sitc_${props.original[`${productRevision} ID`]
										.toString()
										.charAt(0)}.svg`}
									alt="icon"
									className="icon"
								/>
								<div className="link">
									<div className="name">{props.original[`${productRevision}`]}</div>
								</div>
							</div>
						)
					};
				}
			}
		} else {
			// Subnational Columns
			if (country) {
				columnNAME = {
					id: 'category',
					accessor: (d) => d[subnationalData[subnationalValue].geo],
					width: 400,
					Header: () => (
						<div className="header">
							<span className="year">{subnationalData[subnationalValue].geo}</span>
							<div className="icons">
								<Icon icon={'caret-up'} iconSize={16} />
								<Icon icon={'caret-down'} iconSize={16} />
							</div>
						</div>
					),
					style: {whiteSpace: 'unset'},
					Cell: (props) => (
						<div className="category">
							<img
								src={`/images/icons/country/country_${subnationalData[subnationalValue].flag}.png`}
								alt="icon"
								className="icon"
							/>
							<a
								href={`/en/profile/subnational_${subnationalData[subnationalValue]
									.profile}/${normalizeString(
										props.original[subnationalData[subnationalValue].geo]
											.replace(/ /g, '-')
											.replace(',', '')
											.toLowerCase()
									)}`}
								className="link"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="name">{props.original[subnationalData[subnationalValue].geo]}</div>
								<Icon icon={'chevron-right'} iconSize={14} />
							</a>
						</div>
					)
				};
			} else {
				const basecube = subnationalData[subnationalValue].basecube;
				if (basecube === 'HS') {
					columnNAME = {
						id: 'category',
						accessor: (d) => d[`${productDepth}`],
						width: 400,
						Header: () => (
							<div className="header">
								<span className="year">{'Product'}</span>
								<div className="icons">
									<Icon icon={'caret-up'} iconSize={16} />
									<Icon icon={'caret-down'} iconSize={16} />
								</div>
							</div>
						),
						style: {whiteSpace: 'unset'},
						Cell: (props) => (
							<div className="category">
								<img
									src={`/images/icons/hs/hs_${productDepth === 'Section'
										? props.original[`${productDepth} ID`]
										: props.original[`${productDepth} ID`]
											.toString()
											.substr(
												0,
												props.original[`${productDepth} ID`].toString().length * 1 -
												productDepth.substr(2) * 1
											)}.svg`}
									alt="icon"
									className="icon"
								/>
								<a
									href={`/en/profile/hs92/${props.original[`${productDepth} ID`]}`}
									className="link"
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className="name">{props.original[`${productDepth}`]}</div>
									<Icon icon={'chevron-right'} iconSize={14} />
								</a>
							</div>
						)
					};
				} else if (basecube === 'SITC') {
				}
			}
		}

		const measure = country ? 'ECI' : 'PCI';
		const YEARS = range(years[0], years[1]);
		YEARS.reverse()
		const columnYEARS = YEARS.map((year, index, {length}) => ({
			id: index === 0 ? 'lastyear' : `${year}`,
			Header: () => (
				<div className="header">
					<span className="year">{year}</span>
					<div className="icons">
						<Icon icon={'caret-up'} iconSize={16} />
						<Icon icon={'caret-down'} iconSize={16} />
					</div>
				</div>
			),
			accessor: (d) => d[`${year}`][`${year} ${measure}`],
			Cell: (props) => {
				if (type) {
					return (
						<div className="value">
							<span>{`${numeral(props.original[`${year}`][`${year} ${measure}`]).format('0.00')}`}</span>
						</div>
					);
				} else {
					if (props.original[`${year}`][`${year} ${measure}`] !== -1000) {
						return (
							<div className="value">
								<span>{`${numeral(props.original[`${year}`][`${year} ${measure}`]).format(
									'0.00'
								)} `}</span>
								<span>({numeral(props.original[`${year}`][`${year} Ranking`]).format('0o')})</span>
							</div>
						);
					}
					return <span />;
				}
			},
			className: 'year'
		}));

		const columns = [columnID, columnNAME, ...columnYEARS];

		return columns.filter((f) => f !== null);
	}

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
			data,
			columns,
			_ready,
			_loading
		} = this.state;
		console.log("here:", SUBNATIONAL_COUNTRIES);
		console.log("filtered:", SUBNATIONAL_COUNTRIES.filter(f => f.available === true));

		const _authUser = this.props.auth.msg === 'LOGIN_SUCCESS' ? true : false;

		if (!_ready) {
			return (
				<div className="rankings-page">
					<OECNavbar />
					<div className="rankings-content">
						<RankingText type={'dynamic'} />

						<Loading />
					</div>
					<Footer />
				</div>
			);
		}

		return (
			<div className="rankings-page">
				<div className="rankings-content">
					<Helmet title="Custom Rankings" />

					<RankingText type={'dynamic'} />

					<RankingBuilder
						variables={{
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
						}}
						handleCategorySwitch={this.handleCategorySwitch}
						handleCountrySwitch={this.handleCountrySwitch}
						handleCountrySelect={this.handleCountrySelect}
						handleProductButtons={this.handleProductButtons}
						handleProductSelect={this.handleProductSelect}
						handlePeriodYearSwitch={this.handlePeriodYearSwitch}
						handlePeriodYearButtons={this.handlePeriodYearButtons}
						handlePeriodRangeSwitch={this.handlePeriodRangeSwitch}
						handleThresholdSlider={this.handleThresholdSlider}
						renderThresholdSlider={this.renderThresholdSlider}
						renderMoneyThresholdSlider={this.renderMoneyThresholdSlider}
						apiGetData={this.apiGetData}
					/>

					{_loading ? <Loading /> : data && <RankingTable data={data} columns={columns} country={country} />}
				</div>
			</div>
		);
	}
}

export default hot(
	withNamespaces()(
		connect(
			(state) => ({
				auth: state.auth,
				formatters: state.data.formatters,
				locale: state.i18n.locale,
				env: state.env
			}),
			(dispatch) => ({
				isAuthenticated: () => {
					dispatch(isAuthenticated());
				}
			})
		)(Custom)
	)
);
