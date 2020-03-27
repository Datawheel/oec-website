import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { formatAbbreviate } from 'd3plus-format';
import { Icon } from '@blueprintjs/core';

import './Rankings.css';

import OECNavbar from 'components/OECNavbar';
import Footer from 'components/Footer';
import Loading from 'components/Loading';
import RankingBuilder from 'components/RankingBuilder';
import RankingTable from 'components/RankingTable';

import { keyBy } from 'helpers/funcs';
import { range } from 'helpers/utils';

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
			initialYear: {
				Category: 2000,
				Section: 2000,
				Division: 2000,
				Group: 2000,
				Subgroup: 2000,
				HS92: 1995,
				HS96: 1998,
				HS02: 2003,
				HS07: 2008,
				HS12: 2012
			},
			finalYear: {
				Category: 2018,
				Section: 2018,
				Division: 2018,
				Group: 2018,
				Subgroup: 2018,
				HS92: 2018,
				HS96: 2018,
				HS02: 2018,
				HS07: 2018,
				HS12: 2018
			},
			yearValue: 2018,
			rangeChangeInitial: true,
			yearRangeInitial: 2017,
			yearRangeFinal: 2018,
			countryExpThreshold: 10000000000,
			productExpThreshold: 2000000000,
			data: null,
			columns: null,
			_loading: false
		};
		this.handleValueChange = this.handleValueChange.bind(this);
		this.getChangeHandler = this.getChangeHandler.bind(this);
		this.getChangeHandler = this.getChangeHandler.bind(this);
		this.recalculateData = this.recalculateData.bind(this);
		this.resetValueChange = this.resetValueChange.bind(this);
		this.handleYearRangeChange = this.handleYearRangeChange.bind(this);
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
					country ? d.Country : productDepth === 'SITC' ? d[`${productRevision}`] : d[`${productDepth}`],
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
								country ? (
									`/images/icons/country/country_${props.original['Country ID'].substr(
										props.original['Country ID'].length - 3
									)}.png`
								) : productDepth === 'SITC' ? (
									''
								) : (
									`/images/icons/hs/hs_${props.original[`${productDepth} ID`]
										.toString()
										.substr(
											0,
											props.original[`${productDepth} ID`].toString().length * 1 -
												productDepth.substr(2) * 1
										)}.svg`
								)
							}
							alt="icon"
							className="icon"
						/>
						<a
							href={
								country ? (
									`/en/profile/country/${props.original['Country ID'].substr(
										props.original['Country ID'].length - 3
									)}`
								) : productDepth === 'SITC' ? (
									''
								) : (
									`/en/profile/${productRevision.toLowerCase()}/${props.original[
										`${productRevision} ID`
									]}`
								)
							}
							className="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="name">
								{country ? (
									props.original.Country
								) : productDepth === 'SITC' ? (
									props.original[`${productRevision}`]
								) : (
									props.original[`${productDepth}`]
								)}
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

	handleValueChange(key, value) {
		const { finalYear, productRevision } = this.state;
		if (key === 'productRevision') {
			this.setState({
				[key]: value,
				yearValue: finalYear[productRevision],
				yearRangeInitial: finalYear[productRevision] - 1,
				yearRangeFinal: finalYear[productRevision]
			});
		} else {
			this.setState({ [key]: value });
		}
	}

	resetValueChange(key, value) {
		const { finalYear, productRevision } = this.state;
		if (this.state[key] !== 'SITC' && value === 'SITC') {
			this.setState({
				[key]: value,
				productRevision: 'Category',
				yearValue: finalYear[productRevision],
				yearRangeInitial: finalYear[productRevision] - 1,
				yearRangeFinal: finalYear[productRevision]
			});
		} else if (this.state[key] === 'SITC' && value !== 'SITC') {
			this.setState({
				[key]: value,
				productRevision: 'HS92',
				yearValue: finalYear[productRevision],
				yearRangeInitial: finalYear[productRevision] - 1,
				yearRangeFinal: finalYear[productRevision]
			});
		} else {
			this.setState({ [key]: value });
		}
	}

	handleYearRangeChange(value) {
		const {
			initialYear,
			finalYear,
			productRevision,
			rangeChangeInitial,
			yearRangeInitial,
			yearRangeFinal
		} = this.state;

		if (rangeChangeInitial) {
			if (value === finalYear[productRevision]) {
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
			if (value === initialYear[productRevision]) {
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

	getChangeHandler(key) {
		return (value) => this.setState({ [key]: value });
	}

	getRangeChangeHandler(key) {
		return (value) => {
			if (range(value[0], value[1]).length <= 5) {
				this.setState({ [key]: value });
			}
		};
	}

	renderExportThresholdLabel(val) {
		return `$${formatAbbreviate(val)}`;
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
	};

	recalculateData() {
		const {
			country,
			productDepth,
			subnationalValue,
			productRevision,
			singleyear,
			yearValue,
			countryExpThreshold,
			productExpThreshold,
			initialYear,
			yearRangeInitial,
			yearRangeFinal
		} = this.state;
		this.setState({ _loading: true });

		if (singleyear) {
			const pathYear =
				yearValue === initialYear[productRevision]
					? [ yearValue, yearValue, yearValue ]
					: yearValue === initialYear[productRevision] + 1
						? [ yearValue - 1, yearValue, yearValue ]
						: [ yearValue - 2, yearValue - 1, yearValue ];

			let path = country
				? productDepth === 'SITC'
					? (path = `/api/stats/eci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productRevision}=${productExpThreshold}`)
					: (path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(
							2
						)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productDepth}=${productExpThreshold}`)
				: productDepth === 'SITC'
					? (path = `/api/stats/pci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productRevision}=${productExpThreshold}`)
					: (path = `/api/stats/pci?cube=trade_i_baci_a_${productRevision.substr(
							2
						)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productDepth}=${productExpThreshold}`);

			axios.all([ axios.get(path) ]).then(
				axios.spread((resp) => {
					const varName = country ? 'Trade Value ECI' : 'Trade Value PCI';
					const data = resp.data.data.sort((a, b) => b[varName] - a[varName]);
					data.map((d) => ((d[`${yearValue}`] = d[varName]), delete d[varName]));
					console.log(data);
					const columns = this.createColumns(singleyear, yearValue);
					this.setState({
						data,
						columns,
						_loading: false
					});
				})
			);
		} else {
			const urlPath = [];

			range(yearRangeInitial, yearRangeFinal).map((d) => {
				const pathYear =
					d === initialYear[productRevision]
						? [ d, d, d ]
						: d === initialYear[productRevision] + 1 ? [ d - 1, d, d ] : [ d - 2, d - 1, d ];

				let path = country
					? productDepth === 'SITC'
						? (path = `/api/stats/eci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productRevision}=${productExpThreshold}`)
						: (path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(
								2
							)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productDepth}=${productExpThreshold}`)
					: productDepth === 'SITC'
						? (path = `/api/stats/pci?cube=trade_i_comtrade_a_sitc2_new&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productRevision}=${productExpThreshold}`)
						: (path = `/api/stats/pci?cube=trade_i_baci_a_${productRevision.substr(
								2
							)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${pathYear[0]},${pathYear[1]},${pathYear[2]}&threshold_Country=${countryExpThreshold}&threshold_${productDepth}=${productExpThreshold}`);

				urlPath.push({ year: d, path });
			});

			this.fetchRangeData(urlPath);
		}
	}

	render() {
		const {
			country,
			subnational,
			subnationalValue,
			productDepth,
			productRevision,
			singleyear,
			initialYear,
			finalYear,
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
							productDepth,
							productRevision,
							singleyear,
							initialYear,
							finalYear,
							yearValue,
							rangeChangeInitial,
							yearRangeInitial,
							yearRangeFinal,
							countryExpThreshold,
							productExpThreshold
						}}
						handleValueChange={this.handleValueChange}
						resetValueChange={this.resetValueChange}
						handleYearRangeChange={this.handleYearRangeChange}
						renderExportThresholdLabel={this.renderExportThresholdLabel}
						getChangeHandler={this.getChangeHandler}
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
