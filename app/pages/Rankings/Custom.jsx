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
import {SUBNATIONAL_COUNTRIES} from 'helpers/consts';
import VbDownload from 'components/VbDownload';
import {DATASETS, SUBNATIONAL_DATASETS} from 'helpers/rankings';
import {subnationalData, yearsNational} from 'helpers/rankings';

class Custom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// New variables
			NATIONAL_AVAILABLE: null,
			SUBNATIONAL_AVAILABLE: null,
			isCountry: true,
			isNational: true,
			isSingleyear: true,
			isChangeInitialYear: true,
			subnationalCountry: null,
			subnationalCountryDepth: null,
			subnationalProductDepth: null,
			productDepth: null,
			productRevision: null,
			productBasecube: null,
			productCube: null,
			yearInitial: null,
			yearFinal: null,
			yearRange: null,
			countryExpThreshold: null,
			populationThreshold: null,
			productExpThreshold: null,
			subnationalGeoThreshold: null,
			subnationalRCAThreshold: null,
			// Old variables
			// Not Boolean Values
			yearValue: null,
			yearRangeInitial: null,
			yearRangeFinal: null,
			data: null,
			dataDownload: null,
			columns: null,
			// Loaders
			location: null,
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
		this.createTable = this.createTable.bind(this);
	}

	// Set default variables after the first run of code
	componentDidMount() {
		const NATIONAL_AVAILABLE = DATASETS.filter(d => d.available === true);
		const NATIONAL_DEFAULT = NATIONAL_AVAILABLE[0];
		const SUBNATIONAL_AVAILABLE = SUBNATIONAL_COUNTRIES.filter(d => d.available === true).sort((a, b) => (a.name).localeCompare(b.name));
		const SUBNATIONAL_DEFAULT = SUBNATIONAL_AVAILABLE[0];

		const defaultSubnationalCountry = SUBNATIONAL_DEFAULT.code;
		const defaultSubnationalCountryDepth = SUBNATIONAL_DEFAULT.geoLevels[0].level;
		const defaultSubnationalProductDepth = SUBNATIONAL_DATASETS[defaultSubnationalCountry].defaultDepth;
		const defaultDepth = NATIONAL_DEFAULT.defaultDepth;
		const defaultRevision = NATIONAL_DEFAULT.name;
		const defaultBasecube = NATIONAL_DEFAULT.basecube;
		const defaultYearRange = NATIONAL_DEFAULT.yearsRange;
		const defaultYearFinal = defaultYearRange.slice().reverse()[0];

		const defaultCountryThreshold = 1000000000;
		const defaultPopulationThreshold = 1000000;
		const defaultProductThreshold = 500000000;
		const defaultSubnationalGeoThreshold = 100000000;
		const defaultSubnationalRCAThreshold = 10;

		this.setState({
			NATIONAL_AVAILABLE,
			SUBNATIONAL_AVAILABLE,
			subnationalCountry: defaultSubnationalCountry,
			subnationalCountryDepth: defaultSubnationalCountryDepth,
			subnationalProductDepth: defaultSubnationalProductDepth,
			productDepth: defaultDepth,
			productRevision: defaultRevision,
			productBasecube: defaultBasecube,
			yearRange: defaultYearRange,
			yearInitial: defaultYearFinal - 1,
			yearFinal: defaultYearFinal,
			countryExpThreshold: defaultCountryThreshold,
			populationThreshold: defaultPopulationThreshold,
			productExpThreshold: defaultProductThreshold,
			subnationalGeoThreshold: defaultSubnationalGeoThreshold,
			subnationalRCAThreshold: defaultSubnationalRCAThreshold,
			_ready: true,
			// Old values
			yearValue: yearsNational[defaultRevision].final,
			yearRangeInitial: yearsNational[defaultRevision].final - 1,
			yearRangeFinal: yearsNational[defaultRevision].final
		});
		this.setState({location: window.location});
	}

	// Execute props for checking if it's a pro user
	componentWillMount() {
		this.props.isAuthenticated();
	}

	// Returns new year range and validates the year selected in the new range
	yearValidation = (array, initialyear, finalyear) => {
		const range = array.yearsRange;
		const initial = range.includes(initialyear) ? initialyear : initialyear < range[0] ? range[0] : range.slice().reverse()[0];
		const final = range.includes(finalyear) ? finalyear : finalyear < range[0] ? range[0] : range.slice().reverse()[0];
		return {
			yearRange: range,
			initialYear: initial,
			finalYear: final
		};
	}

	/* BUILDER ORIENTED FUNCTIONS */

	// Handle the Category Switch
	handleCategorySwitch(key, value) {
		this.setState({[key]: value});
	}

	// Handle the Country Switch
	handleCountrySwitch(key, value) {
		const {NATIONAL_AVAILABLE, subnationalCountry, productRevision, yearInitial, yearFinal} = this.state;
		const DATASET = value ? NATIONAL_AVAILABLE.find(d => d.name === productRevision) : SUBNATIONAL_DATASETS[subnationalCountry];
		const YEARS = this.yearValidation(DATASET, yearInitial, yearFinal);
		console.log(YEARS);

		this.setState({
			[key]: value,
			yearRange: YEARS['yearRange'],
			yearInitial: YEARS['initialYear'],
			yearFinal: YEARS['finalYear']
		});
	}

	// Handle the Country Select
	handleCountrySelect(key, value) {
		const {SUBNATIONAL_AVAILABLE, subnationalCountryDepth, productDepth, yearInitial, yearFinal} = this.state;

		const DATASET = SUBNATIONAL_DATASETS[value];
		const YEARS = this.yearValidation(DATASET, yearInitial, yearFinal);

		const SUBNATIONAL_DATASET = SUBNATIONAL_AVAILABLE.find(d => d.code === value);
		const subnationalCountryDepths = SUBNATIONAL_DATASET.geoLevels.map(d => d.level).reverse();
		const newSubnationalCountryDepth = subnationalCountryDepths.includes(subnationalCountryDepth) ? subnationalCountryDepth : subnationalCountryDepths[0];
		const newSubnationalProductDepth = DATASET.productDepth.includes(productDepth) ? productDepth : SUBNATIONAL_DATASETS[value].productDepth[0];

		this.setState({
			[key]: value,
			subnationalCountryDepth: newSubnationalCountryDepth,
			subnationalProductDepth: newSubnationalProductDepth,
			yearRange: YEARS['yearRange'],
			yearInitial: YEARS['initialYear'],
			yearFinal: YEARS['finalYear']
		});
	}

	// Handle the Product Button
	handleProductButtons(key, value, basecube) {
		const {NATIONAL_AVAILABLE, productRevision, yearInitial, yearFinal} = this.state;
		if (key === 'productDepth') {
			const BASECUBE = NATIONAL_AVAILABLE.filter(d => d.basecube === basecube).find(d => d.name === productRevision);
			const DATASET = BASECUBE ? BASECUBE : NATIONAL_AVAILABLE.filter(d => d.basecube === basecube)[0];
			const YEARS = this.yearValidation(DATASET, yearInitial, yearFinal);

			const newProductRevision = DATASET.name;

			this.setState({
				[key]: value,
				productRevision: newProductRevision,
				productBasecube: basecube,
				yearRange: YEARS['yearRange'],
				yearInitial: YEARS['initialYear'],
				yearFinal: YEARS['finalYear']
			});
		} else {
			this.setState({
				[key]: value
			});
		}
	}

	// Handle the Product Select
	handleProductSelect(key, value) {
		const {yearInitial, yearFinal} = this.state;
		if (key === 'productRevision') {
			const DATASET = DATASETS.find(d => d.name === value);
			const YEARS = this.yearValidation(DATASET, yearInitial, yearFinal);

			this.setState({
				[key]: value,
				yearRange: YEARS['yearRange'],
				yearInitial: YEARS['initialYear'],
				yearFinal: YEARS['finalYear']
			});
		} else {
			this.setState({
				[key]: value
			});
		}
	}

	// Handle the Period Year Switch
	handlePeriodYearSwitch(key, value) {
		const {yearFinal, yearRange} = this.state;
		if (value) {
			this.setState({
				[key]: value,
				isChangeInitialYear: true
			});
		} else {
			const newYearFinal = yearFinal === yearRange[0] ? yearRange[1] : yearFinal;
			this.setState({
				[key]: value,
				yearInitial: newYearFinal - 1,
				yearFinal: newYearFinal
			});
		}
	}

	// Handle the Period Switch for change initial and final year
	handlePeriodRangeSwitch(key, value) {
		this.setState({[key]: value});
	}

	// Handle the Period Year Buttons
	handlePeriodYearButtons(singleyear, initialyear, key, value) {
		const {yearInitial, yearFinal} = this.state;
		if (singleyear) {
			this.setState({yearInitial: value - 1, [key]: value});
		} else {
			if (initialyear) {
				if (value < yearFinal) {
					this.setState({yearInitial: value});
				}
			} else {
				if (value > yearInitial) {
					this.setState({yearFinal: value});
				}
			}
		}
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

	// Function that reads the entry parameters and export the data to the page
	createTable = async () => {
		const {
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
			countryExpThreshold,
			populationThreshold,
			productExpThreshold,
			subnationalGeoThreshold,
			subnationalRCAThreshold
		} = this.state;

		this.setState({
			_loading: true
		});

		const INDEX = isCountry ? 'eci' : 'pci';
		// Country, HS4, HS6
		const measure = isCountry ? isNational ? 'Country' : subnationalCountryDepth : isNational ? productDepth : subnationalProductDepth;

		// Creates the range of years for the data call
		const pathYearRange = range(isSingleyear ? yearFinal : yearInitial, yearFinal);

		const data = await this.fetchData(INDEX, pathYearRange);
		const filteredData = await this.filteredData(INDEX, measure, pathYearRange, data);
		console.log(filteredData);
		const columns = await this.createColumns(INDEX, measure, productRevision, pathYearRange);

		this.setState({
			data: filteredData['data'],
			dataDownload: filteredData['dataDownload'],
			columns,
			_loading: false
		});
	}

	pathYearValidator = (range, year) => {
		const {isNational} = this.state;
		const maxYearRight = 2018;
		const maxPopulationYear = 2018;
		const populationYear = year > maxPopulationYear ? maxPopulationYear : year;
		let pathYear = null;
		let yearRight = null;
		let thresholdAggregator = null;

		if (year === range[0]) {
			pathYear = `${year}`;
			yearRight = isNational ? null : year > 2018 ? `${maxYearRight}` : pathYear;
			thresholdAggregator = 1;
		} else if (year - 1 === range[0]) {
			pathYear = `${year - 1},${year}`;
			yearRight = isNational ? null : year > 2018 ? `${maxYearRight - 1},${maxYearRight}` : pathYear;
			thresholdAggregator = 2;
		} else {
			pathYear = `${year - 2},${year - 1},${year}`;
			yearRight = isNational ? null : year > 2018 ? `${maxYearRight - 2},${maxYearRight - 1},${maxYearRight}` : pathYear;
			thresholdAggregator = 3;
		}

		return {
			pathYear,
			populationYear: `${populationYear}`,
			yearRight,
			thresholdAggregator
		}
	}

	// Function that creates the paths for the data requested
	fetchData = async (INDEX, range) => {
		const {
			NATIONAL_AVAILABLE,
			SUBNATIONAL_AVAILABLE,
			isNational,
			subnationalCountry,
			subnationalCountryDepth,
			subnationalProductDepth,
			productDepth,
			productRevision,
			yearRange,
			countryExpThreshold,
			populationThreshold,
			productExpThreshold,
			subnationalGeoThreshold,
			subnationalRCAThreshold
		} = this.state;
		const DATASET = isNational ? NATIONAL_AVAILABLE.find(d => d.name === productRevision) : SUBNATIONAL_AVAILABLE.find(d => d.code === subnationalCountry);
		const dataset = [];

		for (const i in range) {
			const yearValidator = this.pathYearValidator(yearRange, range[i]);
			let params = null;

			if (isNational) {
				params = {
					cube: DATASET.cube,
					rca: `Exporter Country,${productDepth},Trade Value`,
					alias: `Country,${productDepth}`,
					Year: yearValidator['pathYear'],
					ranking: true,
					threshold: `Country:${countryExpThreshold * yearValidator['thresholdAggregator']},${productDepth}:${productExpThreshold * yearValidator['thresholdAggregator']},Population:${populationThreshold}`,
					YearPopulation: yearValidator['populationYear'],
					debug: true
				};
			} else {
				params = {
					cube: DATASET.cube,
					rca: `${subnationalCountryDepth},${subnationalProductDepth},Trade Value`,
					Year: yearValidator['pathYear'],
					ranking: true,
					method: 'subnational',
					cubeRight: 'trade_i_baci_a_92',
					rcaRight: `Exporter Country,${subnationalProductDepth},Trade Value`,
					YearRight: yearValidator['yearRight'],
					aliasRight: `Country,${subnationalProductDepth}`,
					'Trade Flow': 2,
					threshold: `CountryRight:${countryExpThreshold * yearValidator['thresholdAggregator']},${subnationalProductDepth}Right:${productExpThreshold * yearValidator['thresholdAggregator']},PopulationRight:${populationThreshold},Subnat Geography:${subnationalGeoThreshold * yearValidator['thresholdAggregator']}`,
					YearPopulation: yearValidator['populationYear'],
					eciThreshold: `Subnat Geography:${subnationalRCAThreshold}`,
					debug: true
				};
			}

			const data = await axios.get(`/api/stats/${INDEX}`, {params}).then(resp => {
				resp.data.data.forEach(d => {
					d[`${INDEX.toUpperCase()}`] = d[`Trade Value ${INDEX.toUpperCase()}`];
					d[`${INDEX.toUpperCase()} Rank`] = d[`Trade Value ${INDEX.toUpperCase()} Ranking`];
					d['Year'] = range[i];
					delete d[`Trade Value ${INDEX.toUpperCase()}`];
					delete d[`Trade Value ${INDEX.toUpperCase()} Ranking`];
				});
				return resp.data.data
			});
			dataset.push(data);
		}

		return dataset.flat();
	}

	filteredData = (type, measure, range, rawdata) => {
		// Get list of unique countries/products
		const unique = [...new Set(rawdata.map(m => m[`${measure} ID`]))];
		const maxYear = Math.max(...range);
		const minYear = Math.min(...range);

		// Used for setting the rankings fon countries that don't have in max year
		const maxYearDataLength = rawdata.filter(f => f.Year === maxYear).length;
		let flag = 1;

		const data = [];
		const dataDownload = [];

		for (const index in unique) {
			const rowData = rawdata.filter(f => f[`${measure} ID`] === unique[index]);
			// Creates first two values of the array with country/product name and id
			const row = {};
			const rowDownload = {};
			row[measure] = rowData[0][measure];
			row[`${measure} ID`] = unique[index];
			// Aggregates the values for the years that we have on the cube
			rowData.forEach(d => {
				const values = {};
				values[`${d.Year} ${`${type.toUpperCase()}`}`] = d[`${type}`.toUpperCase()];
				values[`${d.Year} Ranking`] = d[`${`${type}`.toUpperCase()} Rank`];
				row[`${d.Year}`] = values;
				rowDownload[`${d.Year}`] = d[`${type}`.toUpperCase()];
			});
			// Add to the years that the data don't have values -1000 for a flag to don't show them and add's rankings for the ones that don't have on the final year
			range.forEach(d => {
				if (!row[d]) {
					if (d !== maxYear) {
						const values = {};
						values[`${d} ${`${type}`.toUpperCase()}`] = -1000;
						values[`${d} Ranking`] = null;
						row[`${d}`] = values;
						rowDownload[`${d}`] = null;
					}
					else {
						const values = {};
						values[`${d} ${`${type}`.toUpperCase()}`] = -1000;
						values[`${d} Ranking`] = maxYearDataLength + flag;
						row[`${d}`] = values;
						rowDownload[`${d}`] = null;
						flag += 1;
					}
				}
			});
			rowDownload[`${measure} ID`] = unique[index];
			rowDownload[measure] = rowData[0][measure];

			// Push the data for the country/product to the one with all the countries/products
			data.push(row);
			dataDownload.push(rowDownload);
		}

		data.sort((a, b) => a[maxYear][`${maxYear} Ranking`] - b[maxYear][`${maxYear} Ranking`]);

		return {data, dataDownload}
	}

	// Creates the columns for the tables
	createColumns = (type, depth, rev, range) => {
		const {isNational, subnationalCountry, subnationalCountryDepth} = this.state;
		// Column ID (1 to .....n)
		const columnID = {
			id: 'ranking',
			Header: '',
			className: 'col-id',
			Cell: props => props.index + 1,
			width: 40,
			sortable: false
		};

		// Set the columns name between Countries and Products
		let columnNAME = {};
		if (type === "eci") {
			const eciAccessor = isNational ? 'Country' : `${subnationalCountryDepth}`;
			console.log(isNational, eciAccessor, subnationalCountry);
			columnNAME = {
				id: 'category',
				accessor: d => d[eciAccessor],
				width: 240,
				Header: () =>
					<div className="header">
						<span className="year">{`${eciAccessor}`}</span>
						<div className="icons">
							<Icon icon={'caret-up'} iconSize={16} />
							<Icon icon={'caret-down'} iconSize={16} />
						</div>
					</div>,
				style: {whiteSpace: 'unset'},
				Cell: props =>
					<div className="category">
						<img
							src={`/images/icons/country/country_${
								isNational ? props.original['Country ID'].substr(props.original['Country ID'].length - 3) : subnationalCountry
								}.png`}
							alt="icon"
							className="icon"
						/>
						<a
							href={isNational
								? `/en/profile/country/${props.original['Country ID'].substr(props.original['Country ID'].length - 3)}`
								: `/en/profile/subnational_${subnationalCountry}/${normalizeString(props.original[eciAccessor]).replace(/ /g, '-').replace(',', '').replace('.', '')}`
							}
							/*
													href={`/en/profile/subnational_${subnationalData[subnationalValue].profile}/${normalizeString(props.original[subnationalData[subnationalValue].geo]
																.replace(/ /g, '-')
																.replace(',', '')
																.toLowerCase()
														)}`}
							*/
							className="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="name">{props.original[eciAccessor]}</div>
							<Icon icon={'chevron-right'} iconSize={14} />
						</a>
					</div>

			};
		}
		else {
			if (depth !== 'SITC') {
				columnNAME = {
					id: 'category',
					accessor: d => d[`${depth.toUpperCase()}`],
					width: 400,
					Header: () =>
						<div className="header">
							<span className="year">{'Product'}</span>
							<div className="icons">
								<Icon icon={'caret-up'} iconSize={16} />
								<Icon icon={'caret-down'} iconSize={16} />
							</div>
						</div>,
					style: {whiteSpace: 'unset'},
					Cell: props =>
						<div className="category">
							<img
								src={`/images/icons/hs/hs_${props.original[`${depth.toUpperCase()} ID`]
									.toString()
									.substr(
										0,
										props.original[`${depth.toUpperCase()} ID`].toString().length * 1 -
										depth.substr(2) * 1
									)}.svg`}
								alt="icon"
								className="icon"
							/>
							{rev.toUpperCase() === 'HS92'
								? <a
									href={`/en/profile/${rev}/${props.original[
										`${depth.toUpperCase()} ID`
									]}`}
									className="link"
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className="name">{props.original[`${depth.toUpperCase()}`]}</div>
									<Icon icon={'chevron-right'} iconSize={14} />
								</a>
								: <div className="link">
									<div className="name">{props.original[`${depth.toUpperCase()}`]}</div>
								</div>
							}
						</div>

				};
			}
		}

		let columnCODE = null;
		let HSDigits = null;
		if (type === 'pci') {
			HSDigits = depth.slice(-1);
			columnCODE = {
				id: 'category',
				accessor: d => d[`${depth.toUpperCase()} ID`],
				width: 100,
				Header: () =>
					<div className="header">
						<span className="year">{'Product ID'}</span>
						<div className="icons">
							<Icon icon={'caret-up'} iconSize={16} />
							<Icon icon={'caret-down'} iconSize={16} />
						</div>
					</div>,
				Cell: props =>
					<div className="category">
						{rev.toUpperCase() === 'HS92'
							? <a
								href={`/en/profile/${rev}/${props.original[
									`${depth.toUpperCase()} ID`
								]}`}
								className="link"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="name">{props.original[`${depth.toUpperCase()} ID`].toString().slice(-HSDigits)}</div>
								<Icon icon={'chevron-right'} iconSize={14} />
							</a>
							: <div className="link">
								<div className="name">{props.original[`${depth.toUpperCase()} ID`]}</div>
							</div>
						}
					</div>
			};
		};

		// Set the name for the columns for each year
		const measure = type.toUpperCase();
		const YEARS = range;
		YEARS.reverse();
		const columnYEARS = YEARS.map((year, index, {length}) => ({
			id: index === 0 ? 'lastyear' : `${year}`,
			Header: () =>
				<div className="header">
					<span className="year">{year}</span>
					<div className="icons">
						<Icon icon={'caret-up'} iconSize={16} />
						<Icon icon={'caret-down'} iconSize={16} />
					</div>
				</div>,
			accessor: d => d[`${year}`][`${year} ${measure}`],
			Cell: props => {
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
			},
			className: 'year'
		}));

		const columns = type === 'eci' ? [columnID, columnNAME, ...columnYEARS] : [columnID, columnNAME, columnCODE, ...columnYEARS];

		return columns.filter(f => f !== null);
	};

	render() {
		const {
			NATIONAL_AVAILABLE,
			SUBNATIONAL_AVAILABLE,
			isCountry,
			isNational,
			isSingleyear,
			isChangeInitialYear,
			productDepth,
			productRevision,
			productBasecube,
			subnationalCountry,
			subnationalCountryDepth,
			subnationalProductDepth,
			yearInitial,
			yearFinal,
			yearRange,
			countryExpThreshold,
			populationThreshold,
			productExpThreshold,
			subnationalGeoThreshold,
			subnationalRCAThreshold,
			// Old Variables
			yearValue,
			yearRangeInitial,
			yearRangeFinal,
			data,
			dataDownload,
			columns,
			location,
			_ready,
			_loading
		} = this.state;

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
							NATIONAL_AVAILABLE,
							SUBNATIONAL_AVAILABLE,
							// New Variables
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
						createTable={this.createTable}
					/>



					{_loading ? <Loading /> : data &&
						<div className='custom-table'>
							<div className="download">
								<VbDownload
									data={dataDownload}
									location={location}
									title={`custom_rankings_download}`}
									customAPI={null}
									saveViz={false}
									buttonTitle={'Download Table'}
								/>
							</div>
							<RankingTable data={data} columns={columns} country={isCountry} />
						</div>
					}
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
