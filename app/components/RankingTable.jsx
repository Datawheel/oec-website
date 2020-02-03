import React from "react";
import ReactTable from "react-table";

import "react-table/react-table.css";
import "./RankingTable.css";

class RankingTable extends React.Component {
  state = {};

  render() {
    const {data, columns, length} = this.props;
    return (
      <div className="rankingtable-component">
        {data &&
          <ReactTable
            data={data}
            columns={columns}
            showPagination={true}
            // defaultPageSize={length}
            // minRows={length}
            defaultPageSize={100}
            minRows={100}
            resizable={false}
            defaultSorted={[{id: "lastyear", desc: true}]}
          />
        }
      </div>
    );
  }
}

export default RankingTable;
