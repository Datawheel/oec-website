import React, {Component} from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import {HTMLSelect} from '@blueprintjs/core';
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
			geomap: null,
			uniqueRegion: null,
			uniqueCountries: null,
			uniqueSubtopics: null,
			filterRegion: ' ',
			filterCountry: ' ',
			filterSubtopics: []
		};
		this.changeGeomapFilterRegion = this.changeGeomapFilterRegion.bind(this);
		this.changeGeomapFilterCountry = this.changeGeomapFilterCountry.bind(this);
	}

	componentDidMount() {
		this.fetchData();
		this.createColumns();
	}

	fetchData = () => {
		const dataApi = '/api/library';
		const dictApi =
			'/olap-proxy/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Exporter+Country&measures=Trade+Value&parents=true&sparse=false';
		axios.all([axios.get(dataApi), axios.get(dictApi)]).then(
			axios.spread((resp1, resp2) => {
				const data = resp1.data.data.filter((f) => f.Region !== null);

				const dictArray = resp2.data.data;
				const dict = {};
				dictArray.map((d) => {
					const object = {};
					object['Continent ID'] = d['Continent ID'];
					object['Continent'] = d['Continent'];
					object['Country ID'] = d['Country ID'].slice(2, 5);
					object['Country'] = d['Country'];
					dict[d['Country']] = object;
				});

				// Reassign regions to countries and continents
				const dictList = Object.keys(dict);
				data.map(d => {
					if (dictList.includes(d["Region"])) {
						d["Country"] = dict[d["Region"]]["Country"];
						d["Region"] = dict[d["Region"]]["Continent"];
					} else {
						if (d["Region"].split(',').length === 1) {
							d["Country"] = "-";
							d["Region"] = d["Region"];
						} else {
							const region = [];
							d["Region"].replace(/ /g, '').split(',').map((f) => {
								if (!region.includes(dict[f]["Continent"])) {
									region.push(dict[f]["Continent"]);
								}
							});
							d["Country"] = d["Region"];
							d["Region"] = this.formatRegions(region);
						}
					}
				});

				const geomapData = this.getGeomapData(data, dict);

				this.setState({
					data,
					dict,
					geomap: geomapData[0],
					uniqueRegion: geomapData[1],
					uniqueCountries: geomapData[2],
					uniqueSubtopics: geomapData[3]
				});
			})
		);
	};

	formatRegions = (array) => {
		return array.reduce((str, item, i) => {
			if (!i) str += item;
			else str += `, ${item}`;
			return str;
		}, "");
	}

	getUnique = (d, key) => {
		if (d) {
			const array = [...new Set(d.map((f) => f[`${key}`]))];
			array.push(' ');
			const sorted = array.sort((a, b) => a.localeCompare(b));
			return sorted;
		} else {
			return null;
		}
	};

	getUniqueRegions = (d) => {
		if (d) {
			const array = [...new Set(d.map((f) => f.Region))];
			array.push(' ');
			const sorted = array.sort((a, b) => a.localeCompare(b));
			return sorted;
		} else {
			return null;
		}
	};

	getUniqueSubtopics = (d) => {
		if (d) {
			const subtopics1 = [...new Set(d.map((m) => m.Subtopic1))].filter((f) => f !== null);
			const subtopics2 = [...new Set(d.map((m) => m.Subtopic2))].filter((f) => f !== null);
			const subtopics3 = [...new Set(d.map((m) => m.Subtopic3))].filter((f) => f !== null);
			const subtopics = subtopics1.concat(subtopics2).concat(subtopics3);
			const sorted = [...new Set(subtopics)].sort((a, b) => a.localeCompare(b));
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

	// Creates row for every [key] value of data
	cleanData = (d, key) => {
		let dreturn = [];
		d.map(m => {
			if (m[key].replace(/ /g, '').split(',').length === 1) {
				const row = {};
				row[key] = m[key];
				row['Subtopic1'] = m.Subtopic1;
				row['Subtopic2'] = m.Subtopic2;
				row['Subtopic3'] = m.Subtopic3;
				dreturn = dreturn.concat(row);
			} else {
				m[key].replace(/ /g, '').split(',').map(f => {
					const row = {};
					row[key] = f;
					row['Subtopic1'] = m.Subtopic1;
					row['Subtopic2'] = m.Subtopic2;
					row['Subtopic3'] = m.Subtopic3;
					dreturn = dreturn.concat(row);
				})
			}
		});
		return dreturn;
	};

	numberOfPapers = (d, key) => {
		return d.reduce((acc, it) => {
			acc[it[key]] = acc[it[key]] + 1 || 1;
			return acc;
		}, {});
	};

	groupData = (d, indexes, key, dict) => {
		let dreturn = [];
		const filters = indexes.filter(fil => fil != " ");
		for (const index in filters) {
			const data = d.filter(f => f[key] === filters[index]);
			const subtopics1 = [...new Set(data.map((m) => m.Subtopic1))].filter((f) => f !== null);
			const subtopics2 = [...new Set(data.map((m) => m.Subtopic2))].filter((f) => f !== null);
			const subtopics3 = [...new Set(data.map((m) => m.Subtopic3))].filter((f) => f !== null);
			const subtopics_array = subtopics1.concat(subtopics2).concat(subtopics3);
			const subtopics = [...new Set(subtopics_array)].sort((a, b) => a.localeCompare(b));
			const row = {}
			row[key] = filters[index];
			row["Count"] = data.length;
			row["Topics"] = subtopics;
			if (key === "Country") {
				row["country_id"] = dict[filters[index]]["Country ID"];
				row["Continent"] = dict[filters[index]]["Continent"];
			} else {
				row["country_id"] = filters[index];
			}
			dreturn = dreturn.concat(row);
		}
		return dreturn;
	};

	getGeomapData = (d, dict) => {
		if (d) {
			// Get clean data by every row
			const cleanDatabyRegion = this.cleanData(d, "Region");
			const cleanDatabyCountry = this.cleanData(d, "Country");

			// Get unique value per index
			const uniqueRegions = this.getUnique(cleanDatabyRegion, "Region");
			const uniqueCountries = this.getUnique(cleanDatabyCountry, "Country").filter(f => f != "-");
			const uniqueSubtopics = this.getUniqueSubtopics(d);

			// Calculate the amount of papers by region
			const papersByRegion = this.numberOfPapers(cleanDatabyRegion, "Region");
			const papersByCountry = this.numberOfPapers(cleanDatabyCountry, "Country");

			// Get country with more papers
			const countryPapersValue = Object.values(papersByCountry);
			const maxPapers = Math.max(...countryPapersValue);

			const regions = this.groupData(cleanDatabyRegion, uniqueRegions, "Region", dict);
			const countries = this.groupData(cleanDatabyCountry, uniqueCountries, "Country", dict);

			const geomap = regions.concat(countries);

			return [geomap, uniqueRegions, uniqueCountries, uniqueSubtopics];
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
				Header: 'Country',
				accessor: 'Country',
				Cell: (props) => (
					<div className="reference">
						<span className="name">{props.original.Country}</span>
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
		this.setState({columns});
	};

	filterDatabyGeo = (data, filter, key) => {
		return data.filter((f) => {
			if (f[key].split(',').length === 1) {
				return f[key] === filter;
			} else {
				return f[key].replace(/ /g, '').split(',').includes(filter);
			}
		});
	};

	filterData = () => {
		const {data, filterRegion, filterCountry, filterSubtopics} = this.state;

		let _filteredDatabyGeo = null;
		if (filterRegion !== ' ' && filterCountry !== ' ') {
			_filteredDatabyGeo = this.filterDatabyGeo(this.filterDatabyGeo(data, filterRegion, "Region"), filterCountry, "Country");
		} else if (filterRegion !== ' ' && filterCountry === ' ') {
			_filteredDatabyGeo = this.filterDatabyGeo(data, filterRegion, "Region");
		} else if (filterRegion === ' ' && filterCountry !== ' ') {
			_filteredDatabyGeo = this.filterDatabyGeo(data, filterCountry, "Country");
		} else {
			_filteredDatabyGeo = data;
		};

		if (filterSubtopics.length > 0) {
			const _filteredData = [];
			filterSubtopics.map((d) => {
				const _filteredBySubtopic = _filteredDatabyGeo.filter(
					(f) => f.Subtopic1 === d.value || f.Subtopic2 === d.value || f.Subtopic3 === d.value
				);
				_filteredData.push(_filteredBySubtopic);
			});
			return _filteredData.flat();
		} else {
			return _filteredDatabyGeo;
		}
	};

	handleValueChange(key, value) {
		this.setState({[key]: value});
	}

	handleItemMultiSelect = (key, d) => {
		this.setState({[key]: d});
	};

	changeGeomapFilterRegion(d, key) {
		document.getElementById('select-region').value = d;
		this.setState({
			filterRegion: d
		});
	}

	changeGeomapFilterCountry(d, key) {
		if (key === "default") {
			document.getElementById('select-country').value = d;
			document.getElementById('select-region').value = d;
			this.setState({
				filterRegion: d,
				filterCountry: d
			});
		} else {
			document.getElementById('select-region').value = this.state.dict[d]["Continent"];
			document.getElementById('select-country').value = d;
			this.setState({
				filterRegion: this.state.dict[d]["Continent"],
				filterCountry: d
			});
		}
	}

	render() {
		const {
			data,
			columns,
			geomap,
			uniqueRegion,
			uniqueCountries,
			uniqueSubtopics,
			filterSubtopics
		} = this.state;
		const filteredData = this.filterData();

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
						<div className="regions left">
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/continent_wld.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/continent_wld.svg'}
							/>
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/country_eu.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/country_eu.png'}
							/>
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/country_na.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/country_na.png'}
							/>
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/country_sa.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/country_sa.png'}
							/>
						</div>
						<div className="countries">
							<LibraryGeomap
								classname={'countries'}
								data={geomap}
								topojson={'/topojson/world-50m.json'}
								height={500}
								changeGeomapFilter={this.changeGeomapFilterCountry}
								tooltipImgSource={'/images/icons/country/country_${d.country_id}.png'}
							/>
						</div>
						<div className="regions right">
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/country_af.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/country_af.png'}
							/>
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/country_as.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/country_as.png'}
							/>
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/country_oc.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/country_oc.png'}
							/>
							<LibraryGeomap
								classname={'region'}
								data={geomap}
								topojson={'/topojson/continent_mena.json'}
								height={100}
								width={100}
								changeGeomapFilter={this.changeGeomapFilterRegion}
								tooltipImgSource={'/images/icons/country/continent_mena.svg'}
							/>
						</div>
					</div>
				)}

				{data && (
					<div className="filters">
						<div className="region">
							<h3>Region</h3>
							<HTMLSelect
								id={'select-region'}
								options={uniqueRegion}
								onChange={(event) =>
									this.handleValueChange(
										'filterRegion',
										event.currentTarget.selectedOptions[0].value
									)}
							/>
						</div>
						<div className="country">
							<h3>Country</h3>
							<HTMLSelect
								id={'select-country'}
								options={uniqueCountries}
								onChange={(event) =>
									this.handleValueChange(
										'filterCountry',
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
						defaultSorted={[{id: `Year`, desc: true}]}
					/>
				)}
			</div>
		);
	}
}

export default Library;
