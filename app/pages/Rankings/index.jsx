import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import {hot} from "react-hot-loader/root";
import {isAuthenticated} from "@datawheel/canon-core";
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { formatAbbreviate } from 'd3plus-format';
import { Icon } from '@blueprintjs/core';

import './Rankings.css';

import OECNavbar from 'components/OECNavbar';
import Footer from 'components/Footer';
import Loading from 'components/Loading';
import RankingText from 'components/RankingText';
import RankingBuilder from 'components/RankingBuilder';
import RankingTable from 'components/RankingTable';

import { range } from 'helpers/utils';
import { subnationalCountries, subnationalData, yearsNational } from 'helpers/rankingsyears';

class Rankings extends Component {
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
			productExpThreshold: null,
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
		this.apiGetData = this.apiGetData.bind(this);
	}

	componentDidMount() {
		const defaultDepth = 'HS4';
		const defaultRevision = 'HS92';
		const defaultCountryThreshold = 5000000000;
		const defaultProductThreshold = 1000000000;

		this.setState({
			subnationalValue: subnationalCountries[0],
			productDepth: defaultDepth,
			productRevision: defaultRevision,
			yearValue: yearsNational[defaultRevision].final,
			yearRangeInitial: yearsNational[defaultRevision].final-1,
			yearRangeFinal: yearsNational[defaultRevision].final,
			countryExpThreshold: defaultCountryThreshold,
			productExpThreshold: defaultProductThreshold,
			_ready: true
		})
	}

	componentWillMount() {
		this.props.isAuthenticated();
  }

	/* BUILDER ORIENTED FUNCTIONS */

	handleCategorySwitch(key, value) {
		this.setState({ [key]: value });
	}

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
				productDepth: 'Section',
				productRevision: 'HS92',
				yearValue: subnationalData[subnationalValue].final,
				yearRangeInitial: subnationalData[subnationalValue].final - 1,
				yearRangeFinal: subnationalData[subnationalValue].final
			});
		}
	}

	handleCountrySelect(key, value) {
		this.setState({
			[key]: value,
			productDepth: 'Section',
			yearValue: subnationalData[value].final,
			yearRangeInitial: subnationalData[value].final - 1,
			yearRangeFinal: subnationalData[value].final
		});
	}

	handleProductButtons(key, value) {
		const { productRevision } = this.state;
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
			this.setState({ [key]: value });
		}
	}

	handleProductSelect(key, value) {
		const { productRevision } = this.state;
		this.setState({
			[key]: value,
			yearValue: yearsNational[productRevision].final,
			yearRangeInitial: yearsNational[productRevision].final - 1,
			yearRangeFinal: yearsNational[productRevision].final
		});
	}

	handlePeriodYearSwitch(key, value) {
		this.setState({ [key]: value });
	}

	handlePeriodYearButtons(key, value) {
		const {singleyear, productRevision, rangeChangeInitial, yearRangeInitial, yearRangeFinal} = this.state;
		if (singleyear) {
			this.setState({ [key]: value });
		} else {
			if (rangeChangeInitial) {
				if (value === yearsNational[productRevision].final) {
					this.setState({ yearRangeInitial: value - 1, yearRangeFinal: value });
				} else if (value < yearRangeInitial) {
					this.setState({ yearRangeInitial: value });
				} else if (yearRangeInitial < value && value < yearRangeFinal) {
					if (range(value, yearRangeFinal).length >= 2) {
						this.setState({ yearRangeInitial: value });
					}
				} else if (yearRangeFinal < value) {
					this.setState({ yearRangeInitial: value, yearRangeFinal: value + 1 });
				}
			} else {
				if (value === yearsNational[productRevision].initial) {
					this.setState({ yearRangeInitial: value, yearRangeFinal: value + 1 });
				} else if (value < yearRangeInitial) {
					this.setState({ yearRangeInitial: value - 1, yearRangeFinal: value });
				} else if (yearRangeInitial < value && value < yearRangeFinal) {
					if (range(yearRangeInitial, value).length >= 2) {
						this.setState({ yearRangeFinal: value });
					}
				} else if (yearRangeFinal < value) {
					this.setState({ yearRangeFinal: value });
				}
			}
		}
	}

	handlePeriodRangeSwitch(key, value) {
		this.setState({ [key]: value });
	}

	handleThresholdSlider(key) {
		return (value) => this.setState({ [key]: value });
	}

	renderThresholdSlider(val) {
		return `$${formatAbbreviate(val)}`;
	}

	/* TABLE ORIENTED FUNCTIONS*/

	yearAggregation(year, initial) {
		if (year === initial) {
			return [year, year, year];
		} else if (year === initial + 1) {
			return [year - 1, year, year];
		} else {
			return [year - 2, year - 1, year];
		}
	}

	pathCreator(years) {
		const {country, subnational, subnationalValue, productDepth, productRevision, countryExpThreshold, productExpThreshold} = this.state;
		const index = country ? "eci" : "pci";

		if (!subnational) {
			if (productDepth === 'SITC') {
				return `/api/stats/${index}?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${years[0]},${years[1]},${years[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productRevision}=${productExpThreshold*3}`;
			} else {
				return `/api/stats/${index}?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${years[0]},${years[1]},${years[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productDepth}=${productExpThreshold*3}`;
			}
		} else {
			const testPath = `/api/stats/${index}?cube=trade_s_${subnationalData[subnationalValue].cube}&rca=${subnationalData[subnationalValue].geo},${productDepth},Trade+Value&Year=${years[0]},${years[1]},${years[2]}&method=subnational&cubeRight=trade_i_baci_a_92&rcaRight=Exporter+Country,${productDepth},Trade+Value&YearRight=2017&aliasRight=Country,${productDepth}`;
			console.log(testPath);
			return testPath
		}
	}

	apiGetData() {
		this.setState({ _loading: true });
		const {
			singleyear,
			productRevision,
			yearValue,
			yearRangeInitial,
			yearRangeFinal,
		} = this.state;

		if (singleyear) {
			const aggregatedYears = this.yearAggregation(yearValue, yearsNational[productRevision].initial);
			const path = this.pathCreator(aggregatedYears);
			this.fetchSingleyearData(path);
		} else {
			const pathArray = [];
			range(yearRangeInitial, yearRangeFinal).map((d) => {
				const aggregatedYears = this.yearAggregation(d, yearsNational[productRevision].initial);
				const path = this.pathCreator(aggregatedYears);
				pathArray.push({ year: d, path });
			});

			this.fetchMultiyearData(pathArray);
		}
	}

	fetchSingleyearData = (path) => {
		const {country, singleyear, yearValue} = this.state;
		axios.all([ axios.get(path) ]).then(
			axios.spread((resp) => {
				const index = country ? 'Trade Value ECI' : 'Trade Value PCI';
				const data = resp.data.data.sort((a, b) => b[index] - a[index]);
				data.map((d) => ((d[`${yearValue}`] = d[index]), delete d[index]));
				const columns = this.createColumns(singleyear, yearValue);
				console.log("DATA HERE:", data);
				this.setState({
					data,
					columns,
					_loading: false
				});
			})
		);
	}

	fetchMultiyearData = async (paths) => {
		const { country, productDepth, productRevision, singleyear, yearRangeInitial, yearRangeFinal } = this.state;
		let rangeData = [];

		for (const d of paths) {
			const index = country ? 'Trade Value ECI' : 'Trade Value PCI';
			const data = await axios.get(d.path).then((resp) => resp.data.data);
			data.map((f) => ((f[`${d.year}`] = f[index]), delete f[index]));
			rangeData.push(data);
		}
		rangeData = rangeData.flat();

		const selector = country
			? 'Country ID'
			: productDepth === 'SITC' ? `${productRevision} ID` : `${productDepth} ID`;

		const reduceData = rangeData.reduce((obj, d) => {
			if (!obj[d[selector]]) obj[d[selector]] = [ d ];
			else obj[d[selector]].push(d);
			return obj;
		}, {});

		let finalData = [];
		Object.values(reduceData).map((d) => {
			let tempData = [];
			d.map((data, j) => {
				if (j === 0) {
					const flag = [];
					flag.push(data);
					tempData = flag[0];
				} else {
					tempData[`${range(yearRangeInitial, yearRangeFinal)[j]}`] =
						data[`${range(yearRangeInitial, yearRangeFinal)[j]}`];
				}
			});
			finalData.push(tempData);
		});

		finalData.map((d) => {
			range(yearRangeInitial, yearRangeFinal).map((f) => {
				if (d[`${f}`] === undefined) {
					d[`${f}`] = -1000;
				}
			});
		});
		finalData = finalData.sort((a, b) => b[`${yearRangeFinal}`] - a[`${yearRangeFinal}`]);

		const columns = await this.createColumns(singleyear, [ yearRangeInitial, yearRangeFinal ]);

		this.setState({
			data: finalData,
			columns,
			_loading: false
		});
	}

	createColumns(type, array) {
		const { country, productDepth, productRevision } = this.state;
		const years = type ? [ array, array ] : array;

		const columns = [
			{
				id: 'id',
				Header: '',
				className: 'col-id',
				Cell: (props) => props.index + 1,
				width: 40,
				sortable: false
			},
			{
				id: 'category',
				accessor: (d) =>
					country
					? d.Country
					: productDepth === 'SITC'
						? d[`${productRevision}`]
						: d[`${productDepth}`],
				width: 400,
				Header: () => (
					<div className="header">
						<span className="year">{country ? 'Country' : 'Product'}</span>
						<div className="icons">
							<Icon icon={'caret-up'} iconSize={16} />
							<Icon icon={'caret-down'} iconSize={16} />
						</div>
					</div>
				),
				style: { whiteSpace: 'unset' },
				Cell: (props) => (
					<div className="category">
						<img
							src={
								country
									? `/images/icons/country/country_${props.original['Country ID'].substr(props.original['Country ID'].length - 3)}.png`
									: productDepth === 'SITC'
										? `/images/icons/sitc/sitc_${props.original[`${productRevision} ID`].toString().charAt(0)}.svg`
								 		: `/images/icons/hs/hs_${props.original[`${productDepth} ID`].toString().substr(0,props.original[`${productDepth} ID`].toString().length * 1 - productDepth.substr(2) * 1)}.svg`
							}
							alt="icon"
							className="icon"
						/>
						<a
							href={
								country
									? `/en/profile/country/${props.original['Country ID'].substr(props.original['Country ID'].length - 3)}`
									: productDepth === 'SITC'
										? ''
										: `/en/profile/${productRevision.toLowerCase()}/${props.original[`${productRevision} ID`]}`
							}
							className="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="name">
								{country
									? props.original.Country
									: productDepth === 'SITC'
										? props.original[`${productRevision}`]
										: props.original[`${productDepth}`]
								}
							</div>
							<Icon icon={'chevron-right'} iconSize={14} />
						</a>
					</div>
				)
			},
			...range(years[0], years[1]).map((year, index, { length }) => ({
				id: length === index + 1 ? 'lastyear' : `${year}`,
				Header: () => (
					<div className="header">
						<span className="year">{year}</span>
						<div className="icons">
							<Icon icon={'caret-up'} iconSize={16} />
							<Icon icon={'caret-down'} iconSize={16} />
						</div>
					</div>
				),
				accessor: (d) => d[`${year}`],
				Cell: (props) =>
					numeral(props.original[`${year}`]).format('0.00000') * 1 !== -1000
						? numeral(props.original[`${year}`]).format('0.00000')
						: '',
				className: 'year'
			}))
		];

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
			productExpThreshold,
			data,
			columns,
			_ready,
			_loading
		} = this.state;

		const _authUser = this.props.auth.msg === 'LOGIN_SUCCESS' ? true : false;

		if (!_ready) {
      return (
        <div className="rankings-page">
          <OECNavbar />
					<div className="rankings-content">
						<RankingText />

						<Loading />
					</div>
          <Footer />
        </div>
      );
    }

		return (
			<div className="rankings-page">
				<OECNavbar />

				<div className="rankings-content">
					<RankingText />

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
							productExpThreshold,
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
						apiGetData={this.apiGetData}
					/>

					{_loading ? <Loading /> : data && <RankingTable data={data} columns={columns} country={country} />}
				</div>
				<Footer />
			</div>
		);
	}
}

export default hot(withNamespaces()(
  connect(state => ({
    auth: state.auth,
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    env: state.env
  }),
  dispatch => ({
    isAuthenticated: () => {
      dispatch(isAuthenticated());
    }
  }))(Rankings)
));
