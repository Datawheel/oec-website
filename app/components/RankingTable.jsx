import React from "react";
import axios from "axios";
import ReactTable from "react-table";
import {Icon} from "@blueprintjs/core";

import "react-table/react-table.css";
import "./RankingTable.css";

class RankingTable extends React.Component {
  state = {
    data: [],
    columns: [],
    length: []
  };

  componentDidMount() {
    const {category, filter} = this.props;
    // eslint-disable-next-line camelcase
    const first_year = filter.split("_")[0] * 1;
    console.log("categoria", category);

    let columns = [];

    columns = [
      {
        id: "countryId",
        Header: "",
        className: "col-id",
        accessor: d => d.table_id,
        width: 50,
        sortable: false
      },
      {
        id: "countryName",
        Header: "Country",
        className: "col-country",
        width: 300,
        Cell: props =>
          <div className="country">
            <img
              src={`/images/icons/country/country_${props.original["Country ID"].slice(
                props.original["Country ID"].length - 3
              )}.png`}
              alt="flag"
              className="flag"
            />
            <a
              href={`/en/profile/country/${props.original["Country ID"].slice(
                props.original["Country ID"].length - 3
              )}`}
              className="link"
            >
              <span className="name">{props.original.Country}</span>
              <Icon icon={"chevron-right"} iconSize={14} />
            </a>
          </div>

      },
      {
        id: "firstYear",
        Header: `${first_year}`,
        accessor: d => d[`${first_year}`],
        width: 160,
        className: "firstYear"
      },
      {
        id: "secondYear",
        Header: `${first_year + 1}`,
        accessor: d => d[`${first_year + 1}`],
        width: 160,
        className: "secondYear"
      },
      {
        id: "thirdYear",
        Header: `${first_year + 2}`,
        accessor: d => d[`${first_year + 2}`],
        width: 160,
        className: "thirdYear"
      },
      {
        id: "fourthYear",
        Header: `${first_year + 3}`,
        accessor: d => d[`${first_year + 3}`],
        width: 160,
        className: "fourthYear"
      },
      {
        id: "fifthYear",
        Header: `${first_year + 4}`,
        accessor: d => d[`${first_year + 4}`],
        width: 160,
        className: "fifthYear"
      },
      {
        id: "sparkline",
        Header: "",
        accessor: d => d.sparkline,
        className: "sparkline",
        sortable: false
      }
    ];

    this.setState({columns});

    /* here the data is loaded */
    axios
      .get(`/json/oec_eci_${filter}.json`)
      .then(
        resp => (
          resp.data.map((d, k) => d.table_id = k + 1),
          this.setState({data: resp.data, length: resp.data.length})
        )
      );
  }

  render() {
    const {data, length, columns} = this.state;
    data.map(d => console.log(d.Country));
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
            defaultSorted={["fifthYear"]}
          />
        }
      </div>
    );
  }
}

export default RankingTable;
