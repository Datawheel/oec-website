import React from "react";
import axios from "axios";
import Numeral from "numeral";
import ReactTable from "react-table";
import {Icon} from "@blueprintjs/core";
import {Sparklines, SparklinesLine} from "react-sparklines";

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
    const first_year = filter.split("-")[0] * 1;
    const lastYear = filter.split("-")[1] * 1;
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
        Cell: props => Numeral(props.original[`${first_year}`]).format("0.00000"),
        width: 160,
        className: "firstYear"
      },
      {
        id: "secondYear",
        Header: `${first_year + 1}`,
        accessor: d => d[`${first_year + 1}`],
        Cell: props => Numeral(props.original[`${first_year + 1}`]).format("0.00000"),
        width: 160,
        className: "secondYear"
      },
      {
        id: "thirdYear",
        Header: `${first_year + 2}`,
        accessor: d => d[`${first_year + 2}`],
        Cell: props => Numeral(props.original[`${first_year + 2}`]).format("0.00000"),
        width: 160,
        className: "thirdYear"
      },
      {
        id: "fourthYear",
        Header: `${first_year + 3}`,
        accessor: d => d[`${first_year + 3}`],
        Cell: props => Numeral(props.original[`${first_year + 3}`]).format("0.00000"),
        width: 160,
        className: "fourthYear",
        sortable: true
      },
      {
        id: "fifthYear",
        Header: `${first_year + 4}`,
        accessor: d => d[`${first_year + 4}`],
        Cell: props => Numeral(props.original[`${first_year + 4}`]).format("0.00000"),
        width: 160,
        className: "fifthYear",
        sortable: true
      },
      {
        id: "sparkline",
        Header: "",
        accessor: "sparkline",
        Cell: props =>
          <div>
            <Sparklines data={props.row.sparkline} limit={5} width={100} height={20}>
              <SparklinesLine color="white" style={{fill: "none"}} />
            </Sparklines>
          </div>,
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
          resp.data.sort((a, b) => b[`${lastYear}`] - a[`${lastYear}`]),
          resp.data.map((d, k) => d.table_id = k + 1),
          this.setState({data: resp.data, length: resp.data.length})
        )
      );
  }

  render() {
    const {data, length, columns} = this.state;
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
