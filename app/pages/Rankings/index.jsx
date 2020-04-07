import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { formatAbbreviate } from 'd3plus-format';
import { Icon } from '@blueprintjs/core';

import './Rankings.css';

import OECNavbar from 'components/OECNavbar';
import Footer from 'components/Footer';
import Loading from 'components/Loading';
import RankingBuilder from 'components/RankingBuilder';
import RankingTable from 'components/RankingTable';

import { range } from 'helpers/utils';
import { initialYearsNational, finalYearsNational, finalYearsSubnational } from 'helpers/rankingsyears';

class Rankings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			country: true,
			subnational: false,
			subnationalValue: 'Brazil',
			productDepth: 'HS4',
			productRevision: 'HS92',
			singleyear: true,
			yearValue: 2018,
			rangeChangeInitial: true,
			yearRangeInitial: 2017,
			yearRangeFinal: 2018,
			countryExpThreshold: 5000000000,
			productExpThreshold: 1000000000,
			data: null,
			columns: null,
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
		this.recalculateData = this.recalculateData.bind(this);
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
				yearValue: finalYearsNational[productRevision],
				yearRangeInitial: finalYearsNational[productRevision] - 1,
				yearRangeFinal: finalYearsNational[productRevision]
			 });
		} else {
			this.setState({
				[key]: value,
				productDepth: 'HS4',
				yearValue: finalYearsSubnational[subnationalValue],
				yearRangeInitial: finalYearsSubnational[subnationalValue] - 1,
				yearRangeFinal: finalYearsSubnational[subnationalValue]
			});
		}
	}

	handleCountrySelect(key, value) {
		this.setState({
			[key]: value,
			yearValue: finalYearsSubnational[value],
			yearRangeInitial: finalYearsSubnational[value] - 1,
			yearRangeFinal: finalYearsSubnational[value]
		});
	}

	handleProductButtons(key, value) {
		const { productRevision } = this.state;
		if (this.state[key] !== 'SITC' && value === 'SITC') {
			this.setState({
				[key]: value,
				productRevision: 'Category',
				yearValue: finalYearsNational[productRevision],
				yearRangeInitial: finalYearsNational[productRevision] - 1,
				yearRangeFinal: finalYearsNational[productRevision]
			});
		} else if (this.state[key] === 'SITC' && value !== 'SITC') {
			this.setState({
				[key]: value,
				productRevision: 'HS92',
				yearValue: finalYearsNational[productRevision],
				yearRangeInitial: finalYearsNational[productRevision] - 1,
				yearRangeFinal: finalYearsNational[productRevision]
			});
		} else {
			this.setState({ [key]: value });
		}
	}

	handleProductSelect(key, value) {
		const { productRevision } = this.state;
		this.setState({
			[key]: value,
			yearValue: finalYearsNational[productRevision],
			yearRangeInitial: finalYearsNational[productRevision] - 1,
			yearRangeFinal: finalYearsNational[productRevision]
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
				if (value === finalYearsNational[productRevision]) {
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
				if (value === initialYearsNational[productRevision]) {
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

	recalculateData() {
		const {
			country,
			productDepth,
			productRevision,
			singleyear,
			yearValue,
			yearRangeInitial,
			yearRangeFinal,
			countryExpThreshold,
			productExpThreshold
		} = this.state;
		this.setState({ _loading: true });

		if (singleyear) {
			const pathYear =
				yearValue === initialYearsNational[productRevision]
					? [ yearValue, yearValue, yearValue ]
					: yearValue === initialYearsNational[productRevision] + 1
						? [ yearValue - 1, yearValue, yearValue ]
						: [ yearValue - 2, yearValue - 1, yearValue ];

			let urlPath = country
				? productDepth === 'SITC'
					? urlPath = `/api/stats/eci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productRevision}=${productExpThreshold*3}`
					: urlPath = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productDepth}=${productExpThreshold*3}`
				: productDepth === 'SITC'
					? urlPath = `/api/stats/pci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productRevision}=${productExpThreshold*3}`
					: urlPath = `/api/stats/pci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productDepth}=${productExpThreshold*3}`;

			this.fetchSingleyearData(urlPath);

		} else {
			const urlPath = [];
			range(yearRangeInitial, yearRangeFinal).map((d) => {
				const pathYear =
					d === initialYearsNational[productRevision]
						? [ d, d, d ]
						: d === initialYearsNational[productRevision] + 1
							? [ d - 1, d, d ]
							: [ d - 2, d - 1, d ];

				let path = country
					? productDepth === 'SITC'
						? path = `/api/stats/eci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productRevision}=${productExpThreshold*3}`
						: path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productDepth}=${productExpThreshold*3}`
					: productDepth === 'SITC'
						? path = `/api/stats/pci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productRevision}=${productExpThreshold*3}`
						: path = `/api/stats/pci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold*3}&threshold_${productDepth}=${productExpThreshold*3}`;

				urlPath.push({ year: d, path });
			});

			this.fetchRangeData(urlPath);
		}
	}

	fetchSingleyearData = (path) => {
		const {country, singleyear, yearValue} = this.state;
		axios.all([ axios.get(path) ]).then(
			axios.spread((resp) => {
				const varName = country ? 'Trade Value ECI' : 'Trade Value PCI';
				const data = resp.data.data.sort((a, b) => b[varName] - a[varName]);
				data.map((d) => ((d[`${yearValue}`] = d[varName]), delete d[varName]));
				const columns = this.createColumns(singleyear, yearValue);
				this.setState({
					data,
					columns,
					_loading: false
				});
			})
		);
	}

	fetchRangeData = async (paths) => {
		const { country, productDepth, productRevision, singleyear, yearRangeInitial, yearRangeFinal } = this.state;
		let rangeData = [];

		for (const d of paths) {
			const varName = country ? 'Trade Value ECI' : 'Trade Value PCI';
			const data = await axios.get(d.path).then((resp) => resp.data.data);
			data.map((f) => ((f[`${d.year}`] = f[varName]), delete f[varName]));
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
		let tempData = null;

		Object.values(reduceData).map((d) => {
			tempData = [];
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
			_loading
		} = this.state;

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
			<div className="rankings-page">
				<OECNavbar />

				<div className="rankings-content">
					<h1 className="title">Dynamic Rankings</h1>
					<div className="about">
						<p>
							The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are,
							respectively, measures of the relative knowledge intensity of an economy or a product. ECI
							measures the knowledge intensity of an economy by considering the knowledge intensity of the
							products it exports. PCI measures the knowledge intensity of a product by considering the
							knowledge intensity of its exporters. This circular argument is mathematically tractable and
							can be used to construct relative measures of the knowledge intensity of economies and
							products (see {' '}
							<a
								href="/en/resources/methodology/"
								className="link"
								target="_blank"
								rel="noopener noreferrer"
							>
								methodology section
							</a>{' '}
							for more details).
						</p>
						<p>
							ECI has been validated as a relevant economic measure by showing its ability to predict
							future economic growth (see {' '}
							<a
								href="http://www.pnas.org/content/106/26/10570.short"
								className="link"
								target="_blank"
								rel="noopener noreferrer"
							>
								Hidalgo and Hausmann 2009
							</a>), and explain international variations in income inequality (see {' '}
							<a
								href="/pdf/LinkingEconomicComplexityInstitutionsAndIncomeInequality.pdf"
								className="link"
								target="_blank"
								rel="noopener noreferrer"
							>
								Hartmann et al. 2017
							</a>).
						</p>
						<p>This page includes rankings using the Economic Complexity Index (ECI).</p>
					</div>

					<RankingBuilder
						variables={{
							country,
							subnational,
							subnationalValue,
							productDepth,
							productRevision,
							singleyear,
							initialYearsNational,
							finalYearsNational,
							yearValue,
							rangeChangeInitial,
							yearRangeInitial,
							yearRangeFinal,
							countryExpThreshold,
							productExpThreshold
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
						recalculateData={this.recalculateData}
					/>

					{_loading ? <Loading /> : data && <RankingTable data={data} columns={columns} country={country} />}
				</div>
				<Footer />
			</div>
		);
	}
}

export default withNamespaces()(connect()(Rankings));
