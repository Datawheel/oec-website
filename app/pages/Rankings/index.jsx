import React from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import {withNamespaces} from "react-i18next";
import {Button, ButtonGroup} from "@blueprintjs/core";

import axios from "axios";
import Numeral from "numeral";
import {Icon} from "@blueprintjs/core";
import {Sparklines, SparklinesLine} from "react-sparklines";

import "./Rankings.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import RankingTable from "../../components/RankingTable";

import {PAGE, FILTER_CATEGORY, FILTER_YEARS} from "helpers/rankings.js";

class Rankings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      text: [],
      category: this.props.params.category || "country",
      measure: this.props.params.measure || "eci",
      filter: this.props.location.search.split("=")[1] || "2013-2017",
      data: [],
      length: null,
      columns: []
    };
  }

  componentDidMount() {
    const {category} = this.state;

    this.setState({
      title: PAGE[0][category].title,
      text: PAGE[0][category].text
    });
  }

  componentDidUpdate() {
    const {filter} = this.state;
    const firstYear = filter.split("-")[0] * 1;
    const lastYear = filter.split("-")[1] * 1;

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
        Header: `${firstYear}`,
        accessor: d => d[`${firstYear}`],
        Cell: props =>
          Numeral(props.original[`${firstYear}`]).format("0.00000") * 1 !== 0
            ? Numeral(props.original[`${firstYear}`]).format("0.00000")
            : "",
        width: 160,
        className: "firstYear"
      },
      {
        id: "secondYear",
        Header: `${firstYear + 1}`,
        accessor: d => d[`${firstYear + 1}`],
        Cell: props =>
          Numeral(props.original[`${firstYear + 1}`]).format("0.00000") * 1 !== 0
            ? Numeral(props.original[`${firstYear + 1}`]).format("0.00000")
            : "",
        width: 160,
        className: "secondYear"
      },
      {
        id: "thirdYear",
        Header: `${firstYear + 2}`,
        accessor: d => d[`${firstYear + 2}`],
        Cell: props =>
          Numeral(props.original[`${firstYear + 2}`]).format("0.00000") * 1 !== 0
            ? Numeral(props.original[`${firstYear + 2}`]).format("0.00000")
            : "",
        width: 160,
        className: "thirdYear"
      },
      {
        id: "fourthYear",
        Header: `${firstYear + 3}`,
        accessor: d => d[`${firstYear + 3}`],
        Cell: props =>
          Numeral(props.original[`${firstYear + 3}`]).format("0.00000") * 1 !== 0
            ? Numeral(props.original[`${firstYear + 3}`]).format("0.00000")
            : "",
        width: 160,
        className: "fourthYear",
        sortable: true
      },
      {
        id: "fifthYear",
        Header: `${firstYear + 4}`,
        accessor: d => d[`${firstYear + 4}`],
        Cell: props =>
          Numeral(props.original[`${firstYear + 4}`]).format("0.00000") * 1 !== 0
            ? Numeral(props.original[`${firstYear + 4}`]).format("0.00000")
            : "",
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

    axios
      .get(`/json/rankings/oec_eci_${filter}.json`)
      .then(
        resp => (
          resp.data.sort((a, b) => b[`${lastYear}`] - a[`${lastYear}`]),
          resp.data.map((d, k) => d.table_id = k + 1),
          this.setState({data: resp.data, length: resp.data.length, columns})
        )
      );
  }

  redirectPage(category, measure, filter) {
    const {lng} = this.props;
    const path = `/${lng}/rankings/${category}/${measure}/?year_range=${filter}`;
    browserHistory.push(path);
    this.setState({category, measure, filter});
  }

  render() {
    const {title, text, category, measure, filter, data, length, columns} = this.state;
    const {t} = this.props;

    return (
      <div className="rankings-page">
        <OECNavbar />

        <div className="rankings-content">
          <h1 className="title">{t(title)}</h1>
          <div className="about">
            {text.map((d, k) =>
              <p
                className={"text"}
                key={`${k}`}
                dangerouslySetInnerHTML={{__html: t(d)}}
              />
            )}
          </div>
          <div className="download">Here it goes the download buttons</div>
          <div className="settings">
            <div className="setup showing">
              <div className="title">{t("Showing")}</div>
              <div className="buttons">
                <ButtonGroup style={{minWidth: 200}}>
                  {FILTER_CATEGORY.map((d, k) =>
                    <Button
                      key={k}
                      onClick={() => this.redirectPage(d[1], d[2], filter)}
                      className={`${d[1] === category ? "isactive" : ""}`}
                    >{`${d[0]}`}</Button>
                  )}
                </ButtonGroup>
              </div>
            </div>
            <div className="setup year">
              <div className="title">{t("Year Range")}</div>
              <div className="buttons">
                <ButtonGroup style={{minWidth: 200}}>
                  {FILTER_YEARS.map((d, k) =>
                    <Button
                      key={k}
                      onClick={() => this.redirectPage(category, measure, d)}
                      className={`${d === filter ? "isactive" : ""}`}
                    >{`${d}`}</Button>
                  )}
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div className="ranking">
            {/* data && <RankingTable filter={filter} /> */}
            {data && <RankingTable data={data} columns={columns} length={length} />}
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(connect()(Rankings));
