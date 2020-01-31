import React from "react";
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import {browserHistory} from "react-router";
import {withNamespaces} from "react-i18next";
import {AnchorButton, Button, ButtonGroup} from "@blueprintjs/core";

import axios from "axios";
import Numeral from "numeral";
import {Icon} from "@blueprintjs/core";
import {Sparklines, SparklinesLine} from "react-sparklines";

import "./Rankings.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import RankingTable from "../../components/RankingTable";

import {
  PAGE,
  FILTER_CATEGORY,
  FILTER_PRODUCT,
  FILTER_YEARS,
  RANGE_YEARS,
  DOWNLOAD_BUTTONS
} from "helpers/rankings.js";
import {keyBy} from "../../helpers/funcs";

class Rankings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: PAGE[0][this.props.params.category].title,
      text: PAGE[0][this.props.params.category].text,
      data: null,
      category: this.props.params.category || "country",
      measure: this.props.params.measure || "eci",
      range: null
    };
  }

  /**
   * Auxiliar Functions
   */

  createColumns(category, range, measure) {
    const categoryHeader = category === "country" ? "Country" : "Product";
    const columns = [
      {
        id: "id",
        Header: "",
        className: "col-id",
        Cell: props => props.index + 1,
        width: 40,
        sortable: false
      },
      {
        id: "category",
        Header: `${categoryHeader}`,
        style: {whiteSpace: "unset"},
        Cell: props =>
          <div className="category">
            <img
              src={
                category === "country"
                  ? `/images/icons/country/country_${props.original["Country ID"].slice(props.original["Country ID"].length - 3)}.png`
                  : `/images/icons/hs/hs_${props.original["HS6 ID"].toString().length === 7 ? props.original["HS6 ID"].toString().slice(0, 1) : props.original["HS6 ID"].toString().slice(0, 2)}.png`
              }
              alt="icon"
              className="icon"
            />
            <a
              href={
                category === "country"
                  ? `/en/profile/country/${props.original["Country ID"].slice(props.original["Country ID"].length - 3)}`
                  : `/en/profile/${measure}/${props.original["HS6 ID"]}`
              }
              className="link"
            >
              <div className="name">
                {category === "country"
                  ? props.original.Country
                  : props.original.HS6
                }
              </div>
              <Icon icon={"chevron-right"} iconSize={14} />
            </a>
          </div>

      },
      ...RANGE_YEARS[range].map((year, index) => ({
        id: RANGE_YEARS[range].length - index > 1 ? `${year}` : "lastyear",
        Header: `${year}`,
        accessor: d => d[`${year}`],
        Cell: props =>
          Numeral(props.original[`${year}`]).format("0.00000") * 1 !== 0
            ? Numeral(props.original[`${year}`]).format("0.00000")
            : "",
        width: 140,
        className: "year"
      })),
      category === "country"
        ? {
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
          width: 220,
          sortable: false
        }
        : null
    ];

    return columns.filter(f => f !== null);
  }

  // Change the settings for the react table
  changeRange(category, measure, fltr) {
    const {lng} = this.props;
    const range = fltr ? fltr : FILTER_YEARS[measure][FILTER_YEARS[measure].length - 1];
    const path = `/${lng}/rankings/${category}/${measure}/?year_range=${range}`;

    browserHistory.push(path);
    this.setState({category, measure, range});
  }

  /**
    * Mount
    */

  componentDidMount() {
    const {category, measure} = this.state;

    const range = FILTER_YEARS[measure].find(d => d === this.props.location.search.split("=")[1]);

    const futureData = FILTER_YEARS[measure].map(d => {
      const columns = this.createColumns(category, d, measure);
      const lastYear = d.split("-")[1] * 1;

      const path =
        category === "country"
          ? `/json/rankings/oec_eci_${d}.json`
          : `/json/rankings/oec_pci_hs6_${measure}_${d}.json`;

      return axios.get(path).then(resp => {
        resp.data.sort((a, b) => b[`${lastYear}`] - a[`${lastYear}`]);
        return {range: d, data: resp.data, cols: columns};
      });
    });

    Promise.all(futureData).then(data =>
      this.setState({
        data: keyBy(data, "range"),
        range: range || FILTER_YEARS[measure][FILTER_YEARS[measure].length - 1]
      })
    );
  }

  /**
   * Page Render
   */

  render() {
    const {title, text, data, category, measure, range} = this.state;
    const {t} = this.props;

    return (
      <div className="rankings-page">
        <Helmet>
          <title>{`${title}`}</title>
        </Helmet>
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

          <div className="download">
            {DOWNLOAD_BUTTONS.map((d, k) => <AnchorButton text={d[0]} href={d[1]} key={k} className={DOWNLOAD_BUTTONS.length - k > 1 ? "" : "last"} />)}
          </div>

          <div className="settings">
            <div className="setup showing">
              <div className="title">{t("Showing")}</div>
              <div className="buttons">
                <ButtonGroup style={{minWidth: 200}}>
                  {FILTER_CATEGORY.map((d, k) =>
                    <Button
                      key={k}
                      onClick={() => this.redirectPage(d[1], d[2])}
                      className={`${d[1] === category ? "isactive" : ""}`}
                    >{`${d[0]}`}</Button>
                  )}
                </ButtonGroup>
              </div>
            </div>
            {category === "product" &&
              <div className="setup product">
                <div className="title">{t("Product Classification")}</div>
                <div className="buttons">
                  <ButtonGroup style={{minWidth: 200}}>
                    {FILTER_PRODUCT.map((d, k) =>
                      <Button
                        key={k}
                        onClick={() => this.changeRange("product", d[1])}
                        className={`${d[1] === measure ? "isactive" : ""}`}
                      >{`${d[0]}`}</Button>
                    )}
                  </ButtonGroup>
                </div>
              </div>
            }
            <div className="setup year">
              <div className="title">{t("Year Range")}</div>
              <div className="buttons">
                <ButtonGroup style={{minWidth: 200}}>
                  {FILTER_YEARS[measure] &&
                    FILTER_YEARS[measure].map((d, k) =>
                      <Button
                        key={k}
                        onClick={() => this.changeRange(category, measure, d)}
                        className={`${d === range ? "isactive" : ""}`}
                      >{`${d}`}</Button>
                    )}
                </ButtonGroup>
              </div>
            </div>
          </div>

          <div className="ranking">
            {data &&
              <RankingTable
                data={data[range].data}
                columns={data[range].cols}
                length={data[range].data.length}
              />
            }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(connect()(Rankings));
