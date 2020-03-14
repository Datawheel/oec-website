import React from "react";
import axios from "axios";
import numeral from "numeral";
import classnames from "classnames";
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import {browserHistory} from "react-router";
import {withNamespaces} from "react-i18next";
import {Sparklines, SparklinesLine} from "react-sparklines";
import {AnchorButton, Icon} from "@blueprintjs/core";

import "./Rankings.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import Loading from "components/Loading";
import RankingTable from "components/RankingTable";
import RankingTableButtons from "components/RankingTableButtons";

import {
  PAGE,
  CATEGORY_BUTTONS,
  PRODUCT_BUTTONS,
  FILTER_YEARS,
  DOWNLOAD_BUTTONS
} from "helpers/rankings";
import {keyBy} from "helpers/funcs";
import {range} from "helpers/utils";

class Rankings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      text: null,
      data: null,
      category: null,
      measure: null,
      filter: null,
      _loading: true,
      _valid: true
    };
    this.changeRange = this.changeRange.bind(this);
  }

  createColumns(category, measure, filter) {
    const {t, lng} = this.props;
    const categoryHeader = category === "country" ? "rankings_active_country" : "rankings_active_product";
    const firstYear = filter.split("-")[0] * 1;
    const lastYear = filter.split("-")[1] * 1;

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
        accessor: d => category === "country" ? d.Country : d.HS6,
        Header: () =>
          <div className="header">
            <span className="year">{t(categoryHeader)}</span>
            <div className="icons">
              <Icon icon={"caret-up"} iconSize={16} />
              <Icon icon={"caret-down"} iconSize={16} />
            </div>
          </div>,
        style: {whiteSpace: "unset"},
        Cell: props =>
          <div className="category">
            <img
              src={
                category === "country"
                  ? `/images/icons/country/country_${props.original["Icon ID"]}.png`
                  : `/images/icons/hs/hs_${props.original["Icon ID"]}.svg`

              }
              alt="icon"
              className="icon"
            />
            <a
              href={
                category === "country"
                  ? `/${lng}/profile/country/${props.original["Icon ID"]}`
                  : `/${lng}/profile/${measure}/${props.original["HS6 ID"]}`

              }
              className="link"
            >
              <div className="name">
                {category === "country" ? props.original.Country : props.original.HS6}
              </div>
              <Icon icon={"chevron-right"} iconSize={14} />
            </a>
          </div>

      },
      ...range(firstYear, lastYear).map((year, index, {length}) => ({
        id: length === index + 1 ? "lastyear" : `year${index}`,
        Header: () =>
          <div className="header">
            <span className="year">{year}</span>
            <div className="icons">
              <Icon icon={"caret-up"} iconSize={16} />
              <Icon icon={"caret-down"} iconSize={16} />
            </div>
          </div>,
        accessor: d => d[`${year}`],
        Cell: props =>
          numeral(props.original[`${year}`]).format("0.00000") * 1 !== 0
            ? numeral(props.original[`${year}`]).format("0.00000")
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

  changeRange(category, measure, fltr) {
    const {lng} = this.props;
    const filter = fltr ? fltr : FILTER_YEARS[measure][FILTER_YEARS[measure].length - 1];
    const path = `/${lng}/rankings/${category}/${measure}/?year_range=${filter}`;

    browserHistory.push(path);
    this.setState({category, measure, filter});
  }

  componentDidMount() {
    const category = this.props.params.category || "country";
    const measure = this.props.params.measure || "eci";
    const validCategory = ["country", "product"];
    const _valid = validCategory.some(d => d === category);

    // valid category on hash
    if (_valid) {
      const title = PAGE[0].title[category];

      const text = PAGE[0].text;
      const filter = FILTER_YEARS[measure].find(
        d => d === this.props.location.search.split("=")[1]
      );

      const futureData = FILTER_YEARS[measure].map(d => {
        const columns = this.createColumns(category, measure, d);
        const lastYear = d.split("-")[1] * 1;

        const path =
          category === "country"
            ? `/json/rankings/oec_eci_${d}.json`
            : `/json/rankings/oec_pci_hs6_${measure}_${d}.json`;

        return axios.get(path).then(resp => {
          category === "country"
            ? resp.data.map(d => d["Icon ID"] = d["Country ID"].slice(2))
            : resp.data.map(d => d["Icon ID"] = d["HS6 ID"].toString().slice(0, -6));
          resp.data.sort((a, b) => b[lastYear] - a[lastYear]);
          return {filter: d, data: resp.data, cols: columns};
        });
      });

      Promise.all(futureData).then(data =>
        this.setState({
          data: keyBy(data, "filter"),
          filter: filter || FILTER_YEARS[measure][FILTER_YEARS[measure].length - 1],
          category,
          measure,
          title,
          text,
          _loading: false,
          _valid
        })
      );
    }

    // invalid category on hash
    if (!_valid) {
      this.setState({
        _loading: false,
        _valid
      });
    }
  }

  render() {
    const {title, text, data, category, measure, filter, _loading, _valid} = this.state;
    const {t} = this.props;

    if (_loading) {
      return (
        <div>
          <Helmet>
            <title>{t("Loading")}</title>
          </Helmet>
          <OECNavbar />
          <Loading />
          <Footer />
        </div>
      );
    }

    if (!_valid) {
      return (
        <div>
          ERROR 404
        </div>
      );
    }

    return (
      <div className="rankings-page">
        <Helmet>
          <title>{t(title)}</title>
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
            {DOWNLOAD_BUTTONS.map((d, k, {length}) =>
              <AnchorButton
                text={t(d[0])}
                href={d[1][category]}
                key={k}
                className={classnames("anchor-button", {last: length === k + 1})}
              />
            )}
          </div>

          <div className="settings">
            <RankingTableButtons
              t={t}
              anchor={true}
              type={"showing"}
              title={t("rankings_settings_showing")}
              array={CATEGORY_BUTTONS}
              active={category}
            />
            {category === "product" &&
              <RankingTableButtons
                t={t}
                anchor={true}
                type={"product"}
                title={t("rankings_settings_product_classification")}
                array={PRODUCT_BUTTONS}
                active={measure}
              />
            }
            <RankingTableButtons
              t={t}
              anchor={false}
              type={"year"}
              title={t("rankings_settings_year_range")}
              array={FILTER_YEARS[measure]}
              onclick={
                {
                  function: this.changeRange,
                  category,
                  measure
                }
              }
              active={filter}
            />
          </div>

          <div className="ranking">
            {data &&
              <RankingTable
                data={data[filter].data}
                columns={data[filter].cols}
                length={data[filter].data.length}
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
