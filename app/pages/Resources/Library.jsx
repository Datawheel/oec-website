import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import { Button, ButtonGroup, HTMLSelect, Slider, Switch, TagInput } from '@blueprintjs/core';

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
			filterSubtopic1: null,
			filterSubtopic2: null,
			filterSubtopic3: null
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
			return sorted;
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
		const { data, filterRegion, filterSubtopic1, filterSubtopic2, filterSubtopic3 } = this.state;
		if (filterRegion !== 'All') {
			return data.filter((f) => f.Region === filterRegion);
		} else {
			return data;
		}
	};

	handleValueChange(key, value) {
		this.setState({ [key]: value });
	}

	render() {
		const { data, headers, columns, uniqueRegion, uniqueSubtopics } = this.state;
		console.log('DATA:', data);
		console.log('HEADERS:', headers);
		console.log('REGIONS:', uniqueRegion);
		console.log('SUBTOPICS:', uniqueSubtopics);

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
							<HTMLSelect
								options={uniqueSubtopics}
								onChange={(event) =>
									this.handleValueChange(
										'filterSubtopic1',
										event.currentTarget.selectedOptions[0].value
									)}
							/>
							<HTMLSelect
								options={uniqueSubtopics}
								onChange={(event) =>
									this.handleValueChange(
										'filterSubtopic2',
										event.currentTarget.selectedOptions[0].value
									)}
							/>
							<HTMLSelect
								options={uniqueSubtopics}
								onChange={(event) =>
									this.handleValueChange(
										'filterSubtopic3',
										event.currentTarget.selectedOptions[0].value
									)}
							/>
							{/*
							<TagInput
								placeholder="Separate values with commas..."
								values={[]}
								fill={true}
							/>
							*/}
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
