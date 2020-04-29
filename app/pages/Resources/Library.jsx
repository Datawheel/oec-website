import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import { HTMLSelect } from '@blueprintjs/core';
import OECMultiSelect from 'components/OECMultiSelect';
import LibraryGeomap from 'components/LibraryGeomap';

import 'react-table/react-table.css';

class Library extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			columns: null,
			dict: null,
			uniqueRegion: null,
			uniqueSubtopics: null,
			geomapCountries: null,
			geomapContinents: null,
			filterRegion: ' ',
			filterSubtopics: []
		};
		this.changeGeomapFilter = this.changeGeomapFilter.bind(this);
	}

	fetchData = () => {
		const dataApi = '/api/library';
		const dictApi =
			'/olap-proxy/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Exporter+Country&measures=Trade+Value&parents=false&sparse=false';
		axios.all([ axios.get(dataApi), axios.get(dictApi) ]).then(
			axios.spread((resp1, resp2) => {
				const data = resp1.data.data.filter((f) => f.Region !== null);

				const dictarray = resp2.data.data;
				const dict = {};
				dictarray.map((d) => {
					const object = {};
					object['Country ID'] = d['Country ID'].slice(2, 5);
					object['Continent'] = d['Continent'];
					object['Continent ID'] = d['Continent ID'];
					dict[d['Country']] = object;
				});

				const geomapData = this.getGeomapData(data, dict);
				this.setState({
					data,
					dict,
					geomapCountries: geomapData[0],
					geomapContinents: geomapData[1],
					uniqueRegion: geomapData[2],
					uniqueSubtopics: geomapData[3]
				});
			})
		);
	};

	getUniqueRegions = (d) => {
		if (d) {
			const array = [ ...new Set(d.map((f) => f.Region)) ];
			array.push(' ');
			const sorted = array.sort((a, b) => a.localeCompare(b));
			return sorted;
		} else {
			return null;
		}
	};

	getUniqueSubtopics = (d) => {
		if (d) {
			const subtopics1 = [ ...new Set(d.map((m) => m.Subtopic1)) ].filter((f) => f !== null);
			const subtopics2 = [ ...new Set(d.map((m) => m.Subtopic2)) ].filter((f) => f !== null);
			const subtopics3 = [ ...new Set(d.map((m) => m.Subtopic3)) ].filter((f) => f !== null);
			const subtopics = subtopics1.concat(subtopics2).concat(subtopics3);
			const sorted = [ ...new Set(subtopics) ].sort((a, b) => a.localeCompare(b));
			const dict = [];
			sorted.forEach((h) => {
				const item = {};
				item['value'] = h;
				item['title'] = h;
				dict.push(item);
			});
			return dict;
		} else {
			return null;
		}
	};

	getGeomapData = (d, dict) => {
		if (d) {
			let cleanData = [];
			d.map((m) => {
				if (m.Region.split(',').length === 1) {
					cleanData = cleanData.concat(m);
				} else {
					m.Region.split(',').map((f) => {
						const row = {};
						row['Region'] = f.replace(/ /g, '');
						row['Year'] = m.Year;
						row['Reference'] = m.Reference;
						row['Link'] = m.Link;
						row['Subtopic1'] = m.Subtopic1;
						row['Subtopic2'] = m.Subtopic2;
						row['Subtopic3'] = m.Subtopic3;
						cleanData = cleanData.concat(row);
					});
				}
			});
			const uniqueRegion = this.getUniqueRegions(cleanData);
			const uniqueSubtopics = this.getUniqueSubtopics(cleanData);
			const countryPapers = cleanData.filter((f) => f.Region in dict);
			const papersByCountry = countryPapers.reduce((acc, it) => {
				acc[it.Region] = acc[it.Region] + 1 || 1;
				return acc;
			}, {});
			const papersValue = Object.values(papersByCountry);
			const maxPapers = Math.max(...papersValue);
			const filters = uniqueRegion.slice(0);
			filters.shift();
			let countries = [];
			let continents = [];
			for (const index in filters) {
				const value = cleanData.filter((f) => f.Region === filters[index]);
				const subtopics1 = [ ...new Set(value.map((m) => m.Subtopic1)) ].filter((f) => f !== null);
				const subtopics2 = [ ...new Set(value.map((m) => m.Subtopic2)) ].filter((f) => f !== null);
				const subtopics3 = [ ...new Set(value.map((m) => m.Subtopic3)) ].filter((f) => f !== null);
				const subtopics_array = subtopics1.concat(subtopics2).concat(subtopics3);
				const subtopics = [ ...new Set(subtopics_array) ].sort((a, b) => a.localeCompare(b));
				const _gap = value.length / maxPapers;
				let row = {};
				if (dict[filters[index]]) {
					row = {
						country: filters[index],
						country_id: dict[filters[index]] ? dict[filters[index]]['Country ID'] : filters[index],
						continent: dict[filters[index]] ? dict[filters[index]]['Continent'] : filters[index],
						continent_id: dict[filters[index]] ? dict[filters[index]]['Continent ID'] : filters[index],
						count: value.length,
						gap: _gap < 0.25 ? 1 : _gap < 0.5 ? 2 : _gap < 0.75 ? 3 : 4,
						topics: subtopics
					};
					countries = countries.concat(row);
				} else {
					row = {
						country: filters[index],
						// country_id: filters[index],
						count: value.length,
						topics: subtopics
					};
					continents = continents.concat(row);
				}
			}
			return [ countries, continents, uniqueRegion, uniqueSubtopics ];
		} else {
			return null;
		}
	};

	createColumns = () => {
		const columns = [
			{
				Header: 'Region',
				accessor: 'Region',
				Cell: (props) => (
					<div className="reference">
						<span className="name">{props.original.Region}</span>
					</div>
				),
				minWidth: 80
			},
			{
				Header: 'Year',
				accessor: 'Year',
				minWidth: 40
			},
			{
				Header: 'Reference',
				accessor: 'Reference',
				Cell: (props) => (
					<div className="reference">
						<a className="link" href={props.original.Link} target="_blank" rel="noopener noreferrer">
							<span className="name">{props.original.Reference}</span>
						</a>
					</div>
				),
				minWidth: 640
			},
			{
				Header: 'Subtopic 1',
				accessor: 'Subtopic1'
			},
			{
				Header: 'Subtopic 2',
				accessor: 'Subtopic2'
			},
			{
				Header: 'Subtopic 3',
				accessor: 'Subtopic3'
			}
		];
		this.setState({ columns });
	};

	componentDidMount() {
		this.fetchData();
		this.createColumns();
	}

	filterData = () => {
		const { data, filterRegion, filterSubtopics } = this.state;

		const _filteredRegion =
			filterRegion !== ' '
				? data.filter((f) => {
						if (f.Region.split(',').length === 1) {
							return f.Region === filterRegion;
						} else {
							return f.Region.replace(/ /g, '').split(',').includes(filterRegion);
						}
					})
				: data;

		if (filterSubtopics.length > 0) {
			const _filteredData = [];
			filterSubtopics.map((d) => {
				const _filteredBySubtopic = _filteredRegion.filter(
					(f) => f.Subtopic1 === d.value || f.Subtopic2 === d.value || f.Subtopic3 === d.value
				);
				_filteredData.push(_filteredBySubtopic);
			});
			return _filteredData.flat();
		} else {
			return _filteredRegion;
		}
	};

	handleValueChange(key, value) {
		this.setState({ [key]: value });
	}

	handleItemMultiSelect = (key, d) => {
		this.setState({ [key]: d });
	};

	changeGeomapFilter(d) {
		document.getElementById('select').value = d;
		this.setState({
			filterRegion: d
		});
	}

	render() {
		const {
			data,
			columns,
			uniqueRegion,
			uniqueSubtopics,
			geomapCountries,
			geomapContinents,
			filterSubtopics
		} = this.state;
		const filteredData = this.filterData();
		console.log(geomapCountries);
		console.log(geomapContinents);

		return (
			<div className="library">
				<h1>Library</h1>

				<p>
					The OEC Library gathers a selection of papers related to the ideas of economic complexity. The
					purpose of the library is to help visibilize papers related to economic complexity focused on
					specific geographies and topics. The collection of papers is curated by the OEC team.
				</p>

				{data && (
					<div className="geomaps">
						<div className="continents">
							<LibraryGeomap
								classname={'continent'}
								data={geomapContinents.filter((d) => d.country === 'Africa')}
								topojson={'/topojson/country_af.json'}
								// projection={'geoMiller'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilter}
								tooltipImgSource={'/images/icons/country/country_af.png'}
							/>
							<LibraryGeomap
								classname={'continent'}
								data={geomapContinents.filter((d) => d.country === 'Europe')}
								topojson={'/topojson/country_eu.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilter}
								tooltipImgSource={'/images/icons/country/country_eu.png'}
							/>
							<LibraryGeomap
								classname={'continent'}
								data={geomapContinents.filter((d) => d.country === 'Latin America')}
								topojson={'/topojson/country_sa.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilter}
								tooltipImgSource={'/images/icons/country/country_sa.png'}
							/>
						</div>
						<div className="countries">
							<LibraryGeomap
								classname={'countries'}
								data={geomapCountries}
								topojson={'/topojson/world-50m.json'}
								height={400}
								changeGeomapFilter={this.changeGeomapFilter}
								tooltipImgSource={'/images/icons/country/country_${d.country_id}.png'}
							/>
						</div>
						<div className="continents">
							<LibraryGeomap
								classname={'continent'}
								data={geomapContinents.filter((d) => d.country === 'Global')}
								topojson={'/topojson/continent_wld.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilter}
							/>
							<LibraryGeomap
								classname={'continent'}
								data={geomapContinents.filter((d) => d.country === 'Asia')}
								topojson={'/topojson/country_as.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilter}
								tooltipImgSource={'/images/icons/country/country_as.png'}
							/>
							<LibraryGeomap
								classname={'continent'}
								data={geomapContinents.filter((d) => d.country === 'MENA')}
								topojson={'/topojson/continent_mena.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilter}
							/>
						</div>
					</div>
				)}

				{data && (
					<div className="filters">
						<div className="region">
							<h3>Region</h3>
							<HTMLSelect
								id={'select'}
								options={uniqueRegion}
								onChange={(event) =>
									this.handleValueChange(
										'filterRegion',
										event.currentTarget.selectedOptions[0].value
									)}
							/>
						</div>
						<div className="subtopic">
							<h3>Subtopics</h3>
							<OECMultiSelect
								items={uniqueSubtopics}
								selectedItems={filterSubtopics}
								callback={(d) => this.handleItemMultiSelect('filterSubtopics', d)}
							/>
						</div>
					</div>
				)}

				{filteredData && (
					<ReactTable
						data={filteredData}
						columns={columns}
						showPagination={false}
						defaultPageSize={data.length}
						minRows={1}
						defaultSorted={[ { id: `Year`, desc: true } ]}
					/>
				)}
			</div>
		);
	}
}

export default Library;
