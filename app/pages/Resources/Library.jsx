import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import { HTMLSelect } from '@blueprintjs/core';
import { Geomap } from 'd3plus-react';

import OECMultiSelect from 'components/OECMultiSelect';

import 'react-table/react-table.css';

class Library extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			headers: null,
			columns: null,
			uniqueRegion: null,
			uniqueSubtopics: null,
			filterRegion: 'All',
			filterSubtopics: []
		};
	}

	fetchData = () => {
		axios.get('/api/library').then((resp) => {
			const uniqueRegion = this.getUniqueRegions(resp.data.data);
			const uniqueSubtopics = this.getUniqueSubtopics(resp.data.data);
			this.setState({ data: resp.data.data, headers: resp.data.headers, uniqueRegion, uniqueSubtopics });
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

	render() {
		const { data, headers, columns, uniqueRegion, uniqueSubtopics, filterSubtopics } = this.state;
		const filteredData = this.filterData();

		return (
			<div className="library">
				<h1>Library</h1>

				{data && (
					<div className="filters">
						<div className="region">
							<h3>Region</h3>
							<HTMLSelect
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
