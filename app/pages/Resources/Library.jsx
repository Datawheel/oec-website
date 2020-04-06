import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import { HTMLSelect } from '@blueprintjs/core';
import { Geomap } from 'd3plus-react';

import OECMultiSelect from 'components/OECMultiSelect';

import { geodict } from 'helpers/librarygeomap';

import 'react-table/react-table.css';

class Library extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			columns: null,
			uniqueRegion: null,
			uniqueSubtopics: null,
			geomapData: null,
			filterRegion: 'All',
			filterSubtopics: []
		};
	}

	fetchData = () => {
		axios.get('/api/library').then((resp) => {
			const uniqueRegion = this.getUniqueRegions(resp.data.data);
			const uniqueSubtopics = this.getUniqueSubtopics(resp.data.data);
			const geomapData = this.getGeomapData(resp.data.data, uniqueRegion);
			this.setState({ data: resp.data.data, uniqueRegion, uniqueSubtopics, geomapData });
		});
	};

	getUniqueRegions = (d) => {
		if (d) {
			const array = [ ...new Set(d.map((f) => f.Region)) ];
			array.push('All');
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

	getGeomapData = (d, regions) => {
		if (d) {
			const filters = regions.slice(0);
			filters.shift();
			let data = [];
			for (const index in filters) {
				const value = d.filter((f) => f.Region === filters[index]);
				const subtopics1 = [ ...new Set(value.map((m) => m.Subtopic1)) ].filter((f) => f !== null);
				const subtopics2 = [ ...new Set(value.map((m) => m.Subtopic2)) ].filter((f) => f !== null);
				const subtopics3 = [ ...new Set(value.map((m) => m.Subtopic3)) ].filter((f) => f !== null);
				const subtopics_array = subtopics1.concat(subtopics2).concat(subtopics3);
				const subtopics = [ ...new Set(subtopics_array) ].sort((a, b) => a.localeCompare(b));
				const row = {
					id: geodict[filters[index]],
					name: filters[index],
					count: value.length,
					subtopics: subtopics
				};
				data = data.concat(row);
			}
			return data.filter((f) => f.id !== '');
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
		this.setState({ columns });
	};

	componentDidMount() {
		this.fetchData();
		this.createColumns();
	}

	filterData = () => {
		const { data, filterRegion, filterSubtopics } = this.state;

		const _filteredRegion = filterRegion !== 'All' ? data.filter((f) => f.Region === filterRegion) : data;

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
		const { data, columns, uniqueRegion, uniqueSubtopics, geomapData, filterSubtopics } = this.state;
		const filteredData = this.filterData();
		console.log(geomapData);

		return (
			<div className="library">
				<h1>Library</h1>

				{geomapData && (
					<div className="geomap">
						<Geomap
							config={{
								data: geomapData,
								groupBy: 'id',
								height: 500,
								legend: false,
								total: false,
								colorScale: 'count',
								tooltipConfig: {
									title: (d) => {
										return d.name;
									},
									body: (d) => {
										let tooltip = "<div class='d3plus-tooltip-body-wrapper'>";
										tooltip += `<span>Papers: ${d.count}</span>`;
										{
											/*
											if (d.subtopics.length === 1) {
												tooltip += `<span>Subtopics: ${d.subtopics}</span>`;
											} else if (d.subtopics.length > 1) {
												tooltip += `<span>Subtopics: ${d.subtopics.map((m) => {
													return m;
												})}</span>`;
											}
											*/
										}
										tooltip += '</div>';
										return tooltip;
									},
									footer: 'Click to filter table',
									width: '200px'
								},
								on: {
									'click.shape': (d) => {
										if (!d.type) {
											this.changeGeomapFilter(d.name);
										}
									}
								},
								ocean: 'transparent',
								topojson: `/topojson/world-50m.json`,
								topojsonId: (d) => d.id,
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
						defaultSorted={[ { id: `Year`, desc: true } ]}
					/>
				)}
			</div>
		);
	}
}

export default Library;
