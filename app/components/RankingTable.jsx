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
        {data.length > 0 && 
          <ReactTable
            data={data}
            columns={columns}
            showPagination={false}
            defaultPageSize={length}
            minRows={length}
            resizable={false}
            defaultSorted={[
              {
                id: "fifthYear",
                desc: true
              }
            ]}
          />
        }
      </div>
    );
  }
}

export default RankingTable;
