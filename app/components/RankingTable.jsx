import React from 'react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';
import './RankingTable.css';

class RankingTable extends React.Component {
	state = {};

	render() {
		const { data, columns, country } = this.props;
		return (
			<div className="rankingtable-component">
				{data && country ? (
					<ReactTable
						data={data}
						columns={columns}
						showPagination={false}
						defaultPageSize={data.length}
						minRows={1}
						resizable={false}
						defaultSorted={[ { id: `ranking`, desc: false }, { id: `lastyear`, desc: true } ]}
					/>
				) : (
					<ReactTable
						data={data}
						columns={columns}
						showPagination={true}
						defaultPageSize={100}
						minRows={1}
						resizable={false}
						defaultSorted={[ { id: `ranking`, desc: false }, { id: `lastyear`, desc: true } ]}
					/>
				)}
			</div>
		);
	}
}

export default RankingTable;
