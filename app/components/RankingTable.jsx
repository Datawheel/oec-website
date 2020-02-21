import React from "react";
import ReactTable from "react-table";

import "react-table/react-table.css";
import "./RankingTable.css";

class RankingTable extends React.Component {
  state = {};

  render() {
    const {data, columns, sortBy} = this.props;
    return (
      <div className="rankingtable-component">
        {data &&
          <ReactTable
            data={data}
            columns={columns}
            showPagination={true}
            defaultPageSize={50}
            minRows={1}
            resizable={false}
            // defaultSorted={[{id: `${sortBy}`, desc: true}]}
          />
        }
      </div>
    );
  }
}

export default RankingTable;
