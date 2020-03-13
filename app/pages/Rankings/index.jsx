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
			initialYear: { HS92: 1995, HS96: 1998, HS02: 2003, HS07: 2008, HS12: 2012 },
			yearValue: 2017,
			yearRange: [ 2013, 2017 ],
			countryExpThreshold: 100000000,
			productExpThreshold: 100000000,
			data: null,
			columns: null,
			_loading: false,
			_yearSelection: 'single'
		};
		this.handleValueChange = this.handleValueChange.bind(this);
		this.getChangeHandler = this.getChangeHandler.bind(this);
		this.getChangeHandler = this.getChangeHandler.bind(this);
		this.recalculateData = this.recalculateData.bind(this);
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
				accessor: (d) => country ? d.Country : d[`${productDepth}`],
				Header: () => (
					<div className="header">
						<span className="year">{country ? "Country" : "Product"}</span>
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
								? (`/images/icons/country/country_${props.original['Country ID'].substr(props.original['Country ID'].length - 3)}.png`)
								: (`/images/icons/hs/hs_${props.original[`${productDepth} ID`].toString().substr(0,props.original[`${productDepth} ID`].toString().length * 1 -productDepth.substr(2) * 1)}.png`)
							}
							alt="icon"
							className="icon"
						/>
						<a
							href={
								country
								? (`/en/profile/country/${props.original['Country ID'].substr(props.original['Country ID'].length - 3)}`)
								: (`/en/profile/${productRevision.toLowerCase()}/${props.original[`${productDepth} ID`]}`)
							}
							className="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="name">
								{country ? props.original.Country : props.original[`${productDepth}`]}
							</div>
							<Icon icon={'chevron-right'} iconSize={14} />
						</a>
					</div>
				)
			},
			...range(years[0], years[1]).map((year, index, { length }) => ({
				id: length === index + 1 ? 'lastyear' : `year${index}`,
				Header: () => (
					<div className="header">
						<span className="year">{year}</span>
						<div className="icons">
							<Icon icon={'caret-up'} iconSize={16} />
							<Icon icon={'caret-down'} iconSize={16} />
						</div>
					</div>
				),
				accessor: (d) => d['Trade Value ECI'],
				Cell: (props) =>
					numeral(props.original['Trade Value ECI']).format('0.00000') * 1 !== 0
						? numeral(props.original['Trade Value ECI']).format('0.00000')
						: '',
				className: 'year'
			}))
		];

		return columns.filter((f) => f !== null);
	}

	handleValueChange(key, value) {
		this.setState({ [key]: value });
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

	recalculateData() {
		const {
			country,
			productDepth,
			subnationalValue,
			productRevision,
			singleyear,
			yearValue,
			yearRange,
			countryExpThreshold,
			productExpThreshold,
			_yearSelection
		} = this.state;
		this.setState({ _loading: true });

		if (singleyear) {
			let path =
				country
				? productDepth === "SITC"
					? (path = `/api/stats/eci?cube=trade_i_comtrade_a_sitc2&rca=Reporter+Country,${productRevision},Trade+Value&alias=Country,${productRevision}&Year=${yearValue}&parents=true&threshold_Country=${countryExpThreshold}&threshold_${productRevision}=${productExpThreshold}`)
					: (path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${yearValue}&parents=true&threshold_Country=${countryExpThreshold}&threshold_${productDepth}=${productExpThreshold}`)
				: productDepth === "SITC"
					?	(path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=${productDepth},Exporter+Country,Trade+Value&alias=${productDepth},Country&Year=${yearValue}&parents=true&threshold_Country=${countryExpThreshold}&threshold_${productDepth}=${productExpThreshold}&iterations=21`)
					:	(path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=${productDepth},Exporter+Country,Trade+Value&alias=${productDepth},Country&Year=${yearValue}&parents=true&threshold_Country=${countryExpThreshold}&threshold_${productDepth}=${productExpThreshold}&iterations=21`);

			axios.all([ axios.get(path) ]).then(
				axios.spread((resp) => {
					const data = resp.data.data.sort((a, b) => b['Trade Value ECI'] - a['Trade Value ECI']);
					const columns = this.createColumns(singleyear, yearValue);
					console.log('data:', data, 'columns:', columns);
					this.setState({
						data,
						columns,
						_loading: false
					});
				})
			);
		} else {
			const data = [];
			range(yearRange[0], yearRange[1]).map((year) => {
				let path =
					country
						? (path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=Exporter+Country,${productDepth},Trade+Value&alias=Country,${productDepth}&Year=${year}&parents=true&threshold_Country=${countryExpThreshold}`)
						: (path = `/api/stats/eci?cube=trade_i_baci_a_${productRevision.substr(2)}&rca=${productDepth},Exporter+Country,Trade+Value&alias=${productDepth},Country&Year=${year}&parents=true&threshold_Country=${countryExpThreshold}&iterations=21`);

				axios.all([ axios.get(path) ]).then(
					axios.spread((resp) => {
						const yeardata = resp.data.data.sort((a, b) => b['Trade Value ECI'] - a['Trade Value ECI']);
						console.log(year, yeardata, path);
					})
				);
			});

			this.setState({
				_loading: false
			});
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
			yearValue,
			yearRange,
			countryExpThreshold,
			productExpThreshold,
			data,
			columns,
			_loading,
			_yearSelection
		} = this.state;

		const depthButtons = [ 'HS2', 'HS4', 'HS6' ];
		const revisionButtons = [ 'HS92', 'HS96', 'HS02', 'HS07', 'HS12' ];
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

		console.log(
			'Country Profile:', country,
			'National Profile:', !subnational,
			'Subnational Country:', subnationalValue,
			'Product Depth', productDepth,
			'Product Revision', productRevision,
			'Singleyear', singleyear,
			'Country Threshold', countryExpThreshold,
			'Product Threshold', productExpThreshold
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
							countryExpThreshold,
							productExpThreshold,
							initialYear,
							productRevision,
							yearValue
						}}
						handleValueChange={this.handleValueChange}
						renderExportThresholdLabel={this.renderExportThresholdLabel}
						getChangeHandler={this.getChangeHandler}
						recalculateData={this.recalculateData}
					/>

					{_loading ? <Loading /> : data && <RankingTable data={data} columns={columns} />}
				</div>
				<Footer />
			</div>
		);
	}
}

export default withNamespaces()(connect()(Rankings));
