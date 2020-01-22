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
        Header: ""
      },
      {
        id: "countryName",
        Header: "Country",
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
              <Icon icon={"chevron-right"} />
            </a>
          </div>
      },
      {
        id: "firstYear",
        Header: `${first_year}`,
        accessor: d => d[`${first_year}`]
      },
      {
        id: "secondYear",
        Header: `${first_year + 1}`,
        accessor: d => d[`${first_year + 1}`]
      },
      {
        id: "thirdYear",
        Header: `${first_year + 2}`,
        accessor: d => d[`${first_year + 2}`]
      },
      {
        id: "fourthYear",
        Header: `${first_year + 3}`,
        accessor: d => d[`${first_year + 3}`]
      },
      {
        id: "fifthYear",
        Header: `${first_year + 4}`,
        accessor: d => d[`${first_year + 4}`]
      }
    ];

    this.setState({columns});

    /* here the data is loaded */
    axios
      .get(`/json/oec_eci_${filter}.json`)
      .then(resp => this.setState({data: resp.data, length: resp.data.length}));
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
          />
        }
      </div>
    );
  }
}

export default RankingTable;
