import React, {Component} from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import {HTMLSelect} from '@blueprintjs/core';
import {Geomap} from 'd3plus-react';
import {GeoAlbersUk} from "d3-composite-projections";

import OECMultiSelect from 'components/OECMultiSelect';

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
	}

	fetchData = () => {
		const dataApi = '/api/library';
		const dictApi = 'https://dev.oec.world/olap-proxy/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Exporter+Country&measures=Trade+Value&parents=false&sparse=false';
		axios.all([axios.get(dataApi), axios.get(dictApi)])
			.then(axios.spread((resp1, resp2) => {
				const data = resp1.data.data;
				const uniqueRegion = this.getUniqueRegions(data);
				const uniqueSubtopics = this.getUniqueSubtopics(data);

				const dictarray = resp2.data.data;
				const dict = {};
				dictarray.map(d => {
					const object = {};
					object['Country ID'] = d['Country ID'].slice(2, 5);
					object['Continent'] = d['Continent'];
					object['Continent ID'] = d['Continent ID'];
					dict[d['Country']] = object;
				});

				const geomapData = this.getGeomapData(data, uniqueRegion, dict);
				this.setState({data, dict, uniqueRegion, uniqueSubtopics, geomapCountries: geomapData[0], geomapContinents: geomapData[1]});
			}));
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

	getGeomapData = (d, regions, dict) => {
		if (d) {
			let countries = [];
			let continents = [];
			const countryPapers = d.filter(f => f.Region in dict);
			const papersByCountry = countryPapers.reduce((acc, it) => {
				acc[it.Region] = acc[it.Region] + 1 || 1;
				return acc;
			}, {});
			const papersValue = Object.values(papersByCountry);
			const maxPapers = Math.max(...papersValue);
			console.log(maxPapers);
			const filters = regions.slice(0);
			filters.shift();
			for (const index in filters) {
				const value = d.filter((f) => f.Region === filters[index]);
				const subtopics1 = [...new Set(value.map((m) => m.Subtopic1))].filter((f) => f !== null);
				const subtopics2 = [...new Set(value.map((m) => m.Subtopic2))].filter((f) => f !== null);
				const subtopics3 = [...new Set(value.map((m) => m.Subtopic3))].filter((f) => f !== null);
				const subtopics_array = subtopics1.concat(subtopics2).concat(subtopics3);
				const subtopics = [...new Set(subtopics_array)].sort((a, b) => a.localeCompare(b));
				const _gap = value.length / maxPapers;
				let row = {};
				if (dict[filters[index]]) {
					row = {
						country: filters[index],
						country_id: dict[filters[index]] ? dict[filters[index]]["Country ID"] : filters[index],
						continent: dict[filters[index]] ? dict[filters[index]]["Continent"] : filters[index],
						continent_id: dict[filters[index]] ? dict[filters[index]]["Continent ID"] : filters[index],
						count: value.length,
						gap: _gap < 0.25 ? 1 : _gap < 0.5 ? 2 : _gap < 0.75 ? 3 : 4,
						topics: subtopics
					};
					countries = countries.concat(row);
				} else {
					row = {
						continent: filters[index],
						// continent_id: dict[filters[index]] ? dict[filters[index]]["Continent ID"] : filters[index],
						count: value.length,
						subtopics: subtopics
					};
					continents = continents.concat(row);
				}
			}
			return [countries, continents];
		} else {
			return null;
		}
	};

	createColumns = () => {
		const columns = [
			{
				Header: 'Region',
				accessor: 'Region',
				minWidth: 80
			},
			{
				Header: 'Year',
				accessor: 'Year',
				minWidth: 30
			},
			{
				Header: 'Reference',
				accessor: 'Reference',
				Cell: (props) => (
					<a href={props.original.Link} target="_blank" rel="noopener noreferrer">
						{props.original.Reference}
					</a>
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

	componentDidMount() {
		this.fetchData();
		this.createColumns();
	}

	filterData = () => {
		const {data, filterRegion, filterSubtopics} = this.state;

		const _filteredRegion = filterRegion !== ' ' ? data.filter((f) => f.Region === filterRegion) : data;

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
		this.setState({[key]: value});
	}

	handleItemMultiSelect = (key, d) => {
		this.setState({[key]: d});
	};

	changeGeomapFilter(d) {
		document.getElementById('select').value = d;
		this.setState({
			filterRegion: d
		});
	}

	render() {
		const {data, columns, uniqueRegion, uniqueSubtopics, geomapCountries, geomapContinents, filterSubtopics} = this.state;
		const filteredData = this.filterData();
		console.log(geomapCountries);

		return (
			<div className="library">
				<h1>Library</h1>

				{geomapCountries && (
					<div className="geomap">
						<Geomap
							config={{
								data: geomapCountries,
								groupBy: 'country_id',
								height: 500,
								legend: false,
								total: false,
								colorScale: 'gap',
								colorScaleConfig: {
									color: ['#ffffcc', '#c2e699', '#78c679', '#238443']
								},
								tooltipConfig: {
									title: (d) => {
										let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
										tooltip += `<div class="icon" style="background-color: transparent"><img src="/images/icons/country/country_${d.country_id}.png" /></div>`;
										tooltip += `<div class="title"><span>${d.country}</span></div>`;
										tooltip += "</div>";
										return tooltip;
									},
									tbody: [
										["Papers", d => d.count],
										["Topics", d => d.topics]
									],
									footer: 'Click to filter table',
									width: "400px"
								},
								on: {
									'click.shape': (d) => {
										if (!d.type) {
											this.changeGeomapFilter(d.country);
										} else {
											this.changeGeomapFilter(" ");
										}
									}
								},
								shapeConfig: {
									Path: {
										opacity: d => d.country_id ? 1 : 0.15,
										stroke: "#63737f",
										strokeWidth: 1
									}
								},
								ocean: 'transparent',
								topojson: `/topojson/world-50m.json`,
								topojsonId: d => d.id,
								topojsonFill: d => !d.country_id && "#ffffff",
								zoom: false
							}}
						/>
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
						defaultSorted={[{id: `Year`, desc: true}]}
					/>
				)}
			</div>
		);
	}
}

export default Library;
