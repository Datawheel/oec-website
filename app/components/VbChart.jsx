import React from "react";
import {withNamespaces} from "react-i18next";
import axios from "axios";
import {connect} from "react-redux";
import {
  Treemap,
  StackedArea,
  LinePlot,
  Geomap,
  Network,
  Rings,
  Plot
} from "d3plus-react";
import {range} from "helpers/utils";
import colors from "helpers/colors";
import subnat from "helpers/subnatVizbuilder";
import {formatAbbreviate} from "d3plus-format";

import "./VbChart.css";

import countryMembers from "../../static/members/country.json";
import OECButtonGroup from "./OECButtonGroup";
import VbDrawer from "./VbDrawer";
import VbShare from "./VbShare";
import VbDownload from "./VbDownload";
import PaywallChart from "./PaywallChart";

const ddTech = ["Section", "Superclass", "Class", "Subclass"];
const measures = ["Trade Value", "Growth", "Growth (%)"];

const CANON_STATS_API = "/api/stats/";
const OLAP_API = "/olap-proxy/data";

const geoFilter = (d, type) => type.split(".").includes(d.value.slice(2, 5));

class VbChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isOpenDrawer: false,
      relatedItems: {},
      loading: true,
      routeParams: this.props.routeParams,
      scale: "Log",
      stackLayout: "Value",
      subnatGeoDepth: undefined,
      selected: measures[0],
      auth: true,
      depth: "HS4",
      techDepth: ddTech[ddTech.length - 1]
    };
  }

  componentDidMount = () => {
    const {cubeSelected, routeParams} = this.props;
    const {cube} = routeParams;

    console.log(cubeSelected);

    const nextState = {
      location: window.location
    };
    if (subnat[cube]) {
      const levels = subnat[cube].productLevels;
      const n = levels.length;
      const depth = n > 3 ? levels[2] : levels[n - 1];
      nextState.depth = depth;
    }
    else {
      const levels = cubeSelected.productLevels;
      nextState.depth = levels.includes("HS4") ? "HS4" : levels[levels.length - 1];
    }
    this.setState(nextState, () => this.fetchData());
  };

  shouldComponentUpdate = (prevProps, prevState) =>
    prevProps.permalink !== this.props.permalink ||
    prevProps.countryMembers !== this.props.countryMembers ||
    JSON.stringify(prevProps.cubeSelected) !== JSON.stringify(this.props.cubeSelected) ||
    prevProps.xScale !== this.props.xScale ||
    prevProps.yScale !== this.props.yScale ||
    JSON.stringify(prevProps.subnatTimeItems) !== JSON.stringify(this.props.subnatTimeItems) ||
    prevState.loading !== this.state.loading ||
    prevState.depth !== this.state.depth ||
    prevState.scale !== this.state.scale ||
    prevState.isOpenDrawer !== this.state.isOpenDrawer ||
    prevState.selected !== this.state.selected ||
    prevState.stackLayout !== this.state.stackLayout ||
    prevState.subnatGeoDepth !== this.state.subnatGeoDepth;

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.permalink !== this.props.permalink) {
      this.fetchData();
    }
    if (JSON.stringify(prevProps.cubeSelected) !== JSON.stringify(this.props.cubeSelected)) {
      const levels = this.props.cubeSelected.productLevels;
      const depth = levels.includes("HS4") ? "HS4" : levels[levels.length - 1];
      this.setState({depth}, () => this.fetchData());
    }
  };

  fetchSubnatData = () => {
    const {depth, subnatGeoDepth} = this.state;
    const {routeParams} = this.props;
    const {cube, chart, flow, country, partner, viztype, time} = routeParams;
    const {productLevels, geoLevels} = subnat[cube];

    const flowItems = {
      export: 2,
      import: 1
    };
    const isTimeSeries = ["stacked", "line"].includes(chart);
    const subnatData = subnat[cube];
    const partnerId = !["show", "all"].includes(partner)
      ? countryMembers.filter(d => geoFilter(d, partner))
      : undefined;

    const isFilter = !["show", "all"].includes(viztype);

    const drilldowns = [];
    const timeTemp = time.split(".")[0];
    const timeOptions = {
      4: "Year",
      5: "Time",
      6: "Time"
    };
    const timeLength = timeTemp.toString().length;
    const timeLevel = timeOptions[timeLength] || "Year";
    const geoId = !["show", "all"].includes(country) ? country.replace(".", ",") : undefined;
    const timeSeriesChart = ["line", "stacked"].includes(chart);
    if (!geoId) drilldowns.push(subnatGeoDepth || geoLevels[geoLevels.length - 1]);
    else if (geoId && viztype === "show") drilldowns.push(["line"].includes(chart) ? productLevels[0] : depth);
    else if (geoId && viztype === "all" || geoId && isFilter) drilldowns.push("Country");

    if (isFilter || timeSeriesChart) drilldowns.push(timeLevel);

    const params = {
      cube: subnatData.cube,
      drilldowns: drilldowns.join(),
      measures: "Trade Value",
      parents: true
    };


    let timeFilter = time.replace(".", ",");
    if (isTimeSeries) {
      const {subnatTimeItems} = this.props;
      const interval = time.split(".");
      const j = subnatTimeItems.findIndex(d => d.value === interval[0]);
      const i = subnatTimeItems.findIndex(d => d.value === interval[1]);
      timeFilter = subnatTimeItems.slice(i, j + 1).map(d => d.value).join();
    }
    params.Time = timeFilter;

    if (flowItems[flow]) params["Trade Flow"] = flowItems[flow];
    else params.drilldowns = `Trade Flow,${timeLevel}`;
    if (partnerId) params.Country = partnerId.map(d => d.value).join();
    if (geoId) params["Subnat Geography"] = geoId;
    if (isFilter) params.Product = viztype;

    return axios
      .get(OLAP_API, {params})
      .then(resp => {
        const data = resp.data.data;
        if (data[0] && data[0].Time) {
          data.forEach(d => {
            const time = d.Time.toString();
            const year = time.slice(0, 4);
            let month = time.slice(4, timeLength);
            if (timeLength === 5) {
              month = month * 3 - 2;
            }
            const day = "01";
            d["Time ID"] = new Date(`${year}/${month}/${day}`);
          });
        }
        // if (this.state.selected.includes("Growth")) data = data.filter(d => d.Year === time * 1);
        const nextState = {
          data,
          auth: true,
          loading: false,
          routeParams
        };
        if (!subnatGeoDepth) nextState.subnatGeoDepth = geoLevels[geoLevels.length - 1];
        this.setState(nextState);
      }).catch(error => {
        this.setState({data: [], loading: false, routeParams, auth: false});
      });
  }

  fetchData = () => {
    const {cubeSelected, routeParams} = this.props;
    const {geoLevels} = cubeSelected;
    const {cube, chart, flow, country, partner, viztype, time} = routeParams;
    // Uses subnat cubes
    const prevState = {data: [], loading: true};
    if (!["tree_map"].includes(chart)) prevState.selected = measures[0];
    this.setState(prevState);

    if (subnat[cube]) return this.fetchSubnatData();

    // Gets countries and partners
    const countryId = countryMembers.filter(d => geoFilter(d, country));
    const partnerId = !["show", "all"].includes(partner)
      ? countryMembers.filter(d => geoFilter(d, partner))
      : undefined;
    const countryIds = countryId.map(d => d.value).join();

    const isFilter = !["show", "all"].includes(viztype);
    const isProduct = isFinite(viztype);
    const isTechnology = cube.includes("cpc");
    const isTradeBalance = flow === "show";

    // Creates time filter
    const timeInterval = time.split(".");
    const timeSeriesChart = ["line", "stacked"].includes(chart);
    const timeFilter =  !timeSeriesChart
      ? timeInterval.join()
      : range(timeInterval[0], timeInterval[timeInterval.length - 1]).join();
    if (timeInterval.length === 1) timeInterval.push(timeInterval[0]);

    const cubeName = cubeSelected.name;
    const measureName = isTechnology ? "Patent Share" : "Trade Value";
    const growth = `Year,${measureName}`;


    const reporterCountry = geoLevels[0];
    const partnerCountry = geoLevels[1];

    if (isTradeBalance) {
      const balanceParams = {
        cube: cubeName,
        drilldowns: "Year",
        measures: measureName,
        parents: true,
        Year: timeFilter
      };
      const exportsBalanceParams = Object.assign(
        balanceParams, {[reporterCountry]: countryIds}
      );
      const importsBalanceParams = Object.assign(
        balanceParams, {[partnerCountry]: countryIds}
      );

      if (partnerId) {
        exportsBalanceParams[partnerCountry] = partnerId
          .map(d => d.value)
          .join();
        importsBalanceParams[reporterCountry] = partnerId
          .map(d => d.value)
          .join();
      }

      return axios
        .all([
          axios.get(OLAP_API, {params: exportsBalanceParams}),
          axios.get(OLAP_API, {params: importsBalanceParams})
        ])
        .then(
          axios.spread((resp1, resp2) => {
            const exportData = resp1.data.data;
            const importData = resp2.data.data;
            exportData.forEach(d => {
              d["Trade Flow ID"] = 1;
              d["Trade Flow"] = "Exports";
            });

            importData.forEach(d => {
              d["Trade Flow ID"] = 2;
              d["Trade Flow"] = "Imports";
            });

            this.setState({
              data: [...exportData, ...importData],
              loading: false,
              auth: true,
              scale: "Linear",
              routeParams
            });
          })
        );
    }

    const countryType = isTechnology
      ? "Organization Country"
      : flow === "export"
        ? reporterCountry
        : partnerCountry;

    const countryTypeBalance = isTechnology
      ? "Organization Country"
      : flow === "export"
        ? partnerCountry
        : reporterCountry;

    const partnerType = isTechnology
      ? "Organization Country"
      : flow === "export"
        ? partnerCountry
        : reporterCountry;

    const dd = {
      show: isTechnology
        ? isFilter
          ? ddTech[viztype.length - 1]
          : this.state.techDepth
        : countryId.length === 0 || isProduct
          ? countryTypeBalance
          : this.state.depth,
      all: countryTypeBalance,
      wildcard:
        isProduct && countryId.length === 0 ? countryType : countryTypeBalance
    };

    if (chart === "line") dd.show = isFilter ? countryType : "Section";

    const drilldowns = ["Year"];
    if (!isTechnology) {
      drilldowns.push(
        !dd[viztype] ? dd.wildcard : dd[viztype] || countryTypeBalance
      );
    }
    if (isTechnology && viztype !== "show") drilldowns.push(countryTypeBalance);
    if (isTechnology && partner === "all" && !isFilter) {
      drilldowns.push(this.state.techDepth);
    }

    const params = {
      cube: cubeName,
      drilldowns: drilldowns.join(),
      measures: measureName,
      parents: true,
      Year: timeFilter
    };

    // const {diff} = this.state.selected;
    if (this.state.selected.includes("Growth")) {
      const diff = 1;
      params.growth = growth;
      const year = time * 1;
      params.Year = `${year - diff},${year}`;
    }

    if (countryId && countryId.length > 0) {
      params[countryType] = countryId.map(d => d.value).join();
    }
    if (partnerId) params[partnerType] = partnerId.map(d => d.value).join();
    if (isProduct) {
      const productTemp = viztype.split(".")[0];
      const len = productTemp.length;
      const digit = len + len % 2 - 2;
      const productLevelsV2 = {1: "Section", 2: "HS2", 4: "HS4", 6: "HS6"};

      params[productLevelsV2[digit]] = viztype.replace(".", ",");
    }
    if (isFilter && isTechnology) params[ddTech[viztype.length - 1]] = viztype;

    if (params.drilldowns.includes(countryType)) {
      params.properties = `${countryType} ISO 3`;
    }

    if (chart === "network") {
      // eslint-disable-next-line guard-for-in
      for (const member in params) {
        delete params[member];
      }
      const apiStatsParams = {
        cube: cubeName,
        alias: "HS4,Country",
        rca: `HS4,Exporter Country,${measureName}`,
        measures: measureName,
        parents: true,
        filter_Country: countryId.map(d => d.value)[0],
        Year: timeFilter
      };

      const endpoint = flow === "pgi" ? "opportunity_gain" : "relatedness";

      return axios
        .get(`${CANON_STATS_API}${endpoint}`, {
          params: apiStatsParams
        })
        .then(resp => {
          const data = resp.data.data;
          this.setState({
            data,
            auth: true,
            loading: false,
            routeParams
          });
        });
    }
    else if (chart === "rings") {
      const ringsParams = {
        Country: countryId.map(d => d.value)[0],
        Year: timeFilter
      };
      return axios
        .get("/api/connections/hs4", {params: ringsParams})
        .then(resp => {
          const data = resp.data;
          this.setState({
            data,
            auth: true,
            loading: false,
            routeParams
          });
        });
    }
    else if (chart === "scatter") {
      const scatterParams = {
        Year: time,
        x: flow,
        y: country
      };
      return axios.get("/api/gdp/eci", {params: scatterParams}).then(resp => {
        const data = resp.data;
        this.setState({
          data,
          loading: false,
          routeParams
        });
      });
    }

    return axios
      .get(OLAP_API, {params})
      .then(resp => {
        let data = resp.data.data;
        if (this.state.selected.includes("Growth")) data = data.filter(d => d.Year === time * 1);
        this.setState({
          data,
          auth: true,
          loading: false,
          routeParams
        });
      }).catch(error => {
        this.setState({data: [], loading: false, routeParams});
      });
  };

  /**
  shouldComponentUpdate = () => {
    this.fetchData();
  }
  */

  updateFilter = (key, value) => {
    this.setState({[key]: value}, () => this.fetchData());
  };

  render() {
    const {auth, data, loading, routeParams} = this.state;
    const {t} = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;

    if (loading) {
      return (
        <div className="vb-loading">
          <div className="vb-loading-spinner">
            <svg
              className="viz-spinner"
              width="60px"
              height="60px"
              viewBox="0 0 317 317"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="outer"
                d="M16.43 157.072c0 34.797 12.578 66.644 33.428 91.277l-11.144 11.141c-23.673-27.496-37.992-63.283-37.992-102.418 0-39.133 14.319-74.921 37.992-102.423l11.144 11.144c-20.85 24.63-33.428 56.481-33.428 91.279z"
              ></path>
              <path
                className="outer"
                d="M157.793 15.708c34.798 0 66.648 12.58 91.28 33.427l11.143-11.144c-27.502-23.676-63.29-37.991-102.423-37.991-39.132 0-74.919 14.315-102.422 37.991l11.148 11.144c24.627-20.847 56.477-33.427 91.274-33.427"
              ></path>
              <path
                className="outer"
                d="M299.159 157.072c0 34.797-12.578 66.644-33.43 91.277l11.145 11.141c23.674-27.496 37.992-63.283 37.992-102.418 0-39.133-14.318-74.921-37.992-102.423l-11.145 11.144c20.852 24.63 33.43 56.481 33.43 91.279"
              ></path>
              <path
                className="outer"
                d="M157.793 298.432c-34.797 0-66.647-12.574-91.274-33.424l-11.148 11.138c27.503 23.682 63.29 37.997 102.422 37.997 39.133 0 74.921-14.315 102.423-37.997l-11.143-11.138c-24.632 20.85-56.482 33.424-91.28 33.424"
              ></path>
              <path
                className="middle"
                d="M226.59 61.474l-7.889 13.659c24.997 18.61 41.184 48.382 41.184 81.94 0 33.555-16.187 63.329-41.184 81.936l7.889 13.664c29.674-21.394 49.004-56.23 49.004-95.6 0-39.373-19.33-74.21-49.004-95.599"
              ></path>
              <path
                className="middle"
                d="M157.793 259.169c-52.398 0-95.553-39.485-101.399-90.317h-15.814c5.912 59.524 56.131 106.018 117.213 106.018 17.26 0 33.633-3.742 48.404-10.406l-7.893-13.672c-12.425 5.38-26.114 8.377-40.511 8.377"
              ></path>
              <path
                className="middle"
                d="M157.793 54.976c14.397 0 28.086 2.993 40.511 8.371l7.893-13.667c-14.771-6.669-31.144-10.412-48.404-10.412-61.082 0-111.301 46.493-117.213 106.021h15.814c5.846-50.831 49.001-90.313 101.399-90.313"
              ></path>
              <path
                className="inner"
                d="M95.371 164.193c-3.476-30.475 15.471-58.324 43.723-67.097l-1.804-15.842c-36.899 9.931-61.986 45.602-57.524 84.719 4.461 39.115 36.934 68.219 75.122 69.584l-1.806-15.838c-29.504-2.186-54.235-25.054-57.711-55.526"
              ></path>
              <path
                className="inner"
                d="M162.504 94.425c29.508 2.185 54.235 25.053 57.711 55.529 3.476 30.469-15.466 58.319-43.724 67.096l1.806 15.834c36.898-9.927 61.986-45.598 57.525-84.712-4.461-39.117-36.936-68.223-75.125-69.588l1.807 15.841z"
              ></path>
            </svg>
          </div>
          <div className="vb-loading-text">Loading...</div>
          <div className="vb-loading-built">
            <a
              href="https://www.datawheel.us/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built by Datawheel
            </a>
          </div>
        </div>
      );
    }

    if (!auth) {
      return <PaywallChart />;
    }

    const isTechnology = cube.includes("cpc");
    const isFilter = !["show", "all"].includes(viztype);

    const tickFormatter = value =>
      !isTechnology ? `$${formatAbbreviate(value)}` : formatAbbreviate(value);
    const isSubnat =  subnat[cube];

    const groupByProductLevel1 = this.props.cubeSelected.productLevels[0];

    const baseConfig = {
      data: data || [],
      groupBy:
        isTechnology && isFilter
          ? country === "show"
            ? ["Continent", "Country"]
            : ["Section", this.state.techDepth]
          : viztype === "all" || isFinite(viztype) || isFilter
            ? ["Continent", "Country"]
            : isTechnology
              ? ["Section", this.state.techDepth]
              : [groupByProductLevel1, this.state.depth],
      totalFormat: d => `Total: ${tickFormatter(d)}`
    };
    const measure = isTechnology ? "Patent Share" : "Trade Value";

    if (this.state.selected.includes("Growth")) {
      const isLinearColorScale = this.state.selected === measures[2];
      const colorScaleMeasure = isLinearColorScale ? `${measure} Growth` : `${measure} Growth Value`;
      baseConfig.colorScale = colorScaleMeasure;
      baseConfig.colorScaleConfig = {
        axisConfig: {
          tickFormat: d => isLinearColorScale ? `${formatAbbreviate(d * 100)}%` : tickFormatter(d)
        },
        scale: isLinearColorScale ? "linear" : "log",
        midpoint: 0
      };
      baseConfig.shapeConfig = {
        fill: "D3PLUS-COMMON-RESET"
      };
    }

    if (isTechnology) {
      baseConfig.aggs = {
        "Section ID": undefined
      };
    }

    const onClickConfig = {
      on: {
        click: d =>
          this.setState({isOpenDrawer: true, relatedItems: d})
      }
    };

    let productDepthItems = this.props.cubeSelected.productLevels.slice(1);
    let isGeoSubnatGroupBy = false;

    if (isSubnat) {
      const geoId = !["show", "all"].includes(country) ? country.replace(".", ",") : undefined;
      const {productLevels} = isSubnat;
      const n = productLevels.length;
      const productDrilldown = n > 3 ? [productLevels[0], this.state.depth] : productLevels;
      productDepthItems = productLevels.slice(1);
      if (!geoId) {
        baseConfig.groupBy = isSubnat.geoLevels;
        isGeoSubnatGroupBy = true;
      }
      else if (geoId && viztype === "show") baseConfig.groupBy = productDrilldown;
      else if (geoId && viztype === "all" || geoId && isFilter) baseConfig.groupBy = ["Continent", "Country"];

    }

    if (chart === "tree_map" && data && data.length > 0) {
      const isContinentGroupBy = baseConfig.groupBy[0] === "Continent";
      return (
        <div>
          <div className="vb-chart">
            <Treemap
              config={{
                ...baseConfig,
                ...onClickConfig,
                sum: measure,
                total: measure
              }}
            />
          </div>
          <div className="vb-chart-options">
            {!isTechnology && !isContinentGroupBy && !isGeoSubnatGroupBy &&
              <OECButtonGroup
                items={productDepthItems}
                selected={this.state.depth}
                title={"Depth"}
                callback={depth =>
                  this.setState({depth}, () => this.fetchData())
                }
              />}
            {isTechnology && !isContinentGroupBy && !isGeoSubnatGroupBy &&
              <OECButtonGroup
                items={ddTech.slice(1)}
                selected={this.state.techDepth}
                title={"Depth"}
                callback={depth =>
                  this.setState({techDepth: depth}, () => this.fetchData())
                }
              />}

            {!isTechnology &&
              <OECButtonGroup
                items={measures}
                selected={this.state.selected}
                title={""}
                callback={selected =>
                  this.setState({selected}, () => this.fetchData())
                }
              />}

            <div className="vb-share-download-options">
              <VbShare />
              <VbDownload
                data={data}
                location={this.state.location}
                title="download"
              />
            </div>

            <VbDrawer
              isOpen={this.state.isOpenDrawer}
              relatedItems={this.state.relatedItems}
              selectedProducts={this.props.selectedProducts}
              routeParams={routeParams}
              router={this.props.router}
              run={d => (this.setState({isOpenDrawer: false}), this.props.callback(d))}
              callback={d => this.setState({isOpenDrawer: d})}
            />
          </div>
        </div>
      );
    }
    else if (chart === "stacked" && data && data.length > 0) {
      if (this.state.stackLayout === "Share") baseConfig.stackOffset = "expand";
      return (
        <div>
          <div className="vb-chart">
            <StackedArea
              config={{
                ...baseConfig,
                ...onClickConfig,
                colorScale: undefined,
                shapeConfig: {
                  Area: {
                    strokeWidth: 1
                  }
                },
                total: undefined,
                timeline: false,
                x: isSubnat ? "Time ID" : "Year",
                time: isSubnat ? "Time ID" : "Year",
                xConfig: {
                  title: isSubnat ? t("Time") : t("Year")
                },
                y: measure,
                yConfig: {
                  tickFormat: d => this.state.stackLayout === "Share" ? `${formatAbbreviate(d * 100)}%` : tickFormatter(d),
                  scale: "linear"
                }
              }}
            /></div>
          <div className="vb-chart-options">
            {!isTechnology &&
              <OECButtonGroup
                items={productDepthItems}
                selected={this.state.depth}
                title={"Depth"}
                callback={depth =>
                  this.setState({depth}, () => this.fetchData())
                }
              />
            }
            {isTechnology &&
              <OECButtonGroup
                items={ddTech.slice(1)}
                selected={this.state.techDepth}
                title={"Depth"}
                callback={depth =>
                  this.setState({techDepth: depth}, () => this.fetchData())
                }
              />}
            <OECButtonGroup
              items={["Value", "Share"]}
              selected={this.state.stackLayout}
              title={"Layout"}
              callback={depth =>
                this.setState({stackLayout: depth})
              }
            />
            <div className="vb-share-download-options">
              <VbShare />
              <VbDownload
                data={data}
                location={this.state.location}
                title="download"
              />
            </div>
            <VbDrawer
              isOpen={this.state.isOpenDrawer}
              relatedItems={this.state.relatedItems}
              selectedProducts={this.props.selectedProducts}
              routeParams={routeParams}
              router={this.props.router}
              run={d => (this.setState({isOpenDrawer: false}), this.props.callback(d))}
              callback={d => this.setState({isOpenDrawer: d})}
            />
          </div>
        </div>
      );
    }
    else if (chart === "line" && data && data.length > 0) {
      const {geoLevels, productLevels} = isSubnat;
      const isGeoGroupBy = viztype === "all" || isFinite(viztype);
      let lineGroupBy = ["Trade Flow ID"];
      const isTradeBalanceChart = flow === "show";
      if (!isTradeBalanceChart) {
        if (isGeoGroupBy) {
          lineGroupBy = ["Continent", "Country"];
        }
        else {
          lineGroupBy = isSubnat ? [productLevels[0]] : ["Section"];
        }
        const findItem = item => ["all", "show"].includes(item);
        if (findItem(country) && findItem(partner) && isSubnat) lineGroupBy = [geoLevels[geoLevels.length - 1]];
      }

      return (
        <div>
          <div className="vb-chart">
            <LinePlot
              config={{
                ...baseConfig,
                ...onClickConfig,
                colorScale: undefined,
                discrete: "x",
                groupBy: lineGroupBy,
                time: isSubnat ? "Time ID" : "Year",
                timeline: false,
                total: undefined,
                x: isSubnat ? "Time ID" : "Year",
                y: measure,
                yConfig: {
                  scale: this.state.scale.toLowerCase(),
                  tickFormat: d => tickFormatter(d)
                }
              }}
            />
          </div>
          <div className="vb-chart-options">
            <OECButtonGroup
              items={["Log", "Linear"]}
              selected={this.state.scale}
              title={"Scale"}
              callback={scale => this.setState({scale})}
            />
            <div className="vb-share-download-options">
              <VbShare />
              <VbDownload
                data={data}
                location={this.state.location}
                title="download"
              />
            </div>
            <VbDrawer
              isOpen={this.state.isOpenDrawer}
              relatedItems={this.state.relatedItems}
              selectedProducts={this.props.selectedProducts}
              routeParams={routeParams}
              router={this.props.router}
              run={d => (this.setState({isOpenDrawer: false}), this.props.callback(d))}
              callback={d => this.setState({isOpenDrawer: d})}
            />
          </div>
        </div>
      );
    }
    else if (chart === "geomap" && data && !loading) {
      const i = isSubnat ? isSubnat.geoLevels.indexOf(this.state.subnatGeoDepth) : -1;
      const topojson = isSubnat
        ? isSubnat.topojson[i === -1 ? isSubnat.topojson.length - 1 : i]
        : "/topojson/world-50m.json";

      return (
        <div>
          <div className="vb-chart">
            <Geomap
              forceUpdate={true}
              config={{
                ...baseConfig,
                ...onClickConfig,
                colorScale: measure,
                colorScaleConfig: {
                  scale: isSubnat ? "quantile" : "log"
                },
                groupBy: isSubnat ? `${this.state.subnatGeoDepth} ID` : "ISO 3",
                legend: false,
                ocean: false,
                tiles: false,
                topojson,
                // topojsonFilter: d => d.id !== "ata",
                // topojsonId: "id",
                topojsonId: isSubnat ? d => d.properties.id : "id",
                topojsonKey: isSubnat ? "objects" : "id",
                // topojsonKey: "id",
                total: false
              }}
            />
          </div>
          <div className="vb-chart-options">
            {isSubnat && isSubnat.geoLevels.length > 1 && <OECButtonGroup
              items={isSubnat.geoLevels}
              selected={this.state.subnatGeoDepth}
              title={"Depth"}
              callback={subnatGeoDepth => this.setState({subnatGeoDepth}, () => this.fetchData())}
            />}
            <div className="vb-share-download-options">
              <VbShare />
              <VbDownload
                data={data}
                location={this.state.location}
                title="download"
              />
            </div>
            <VbDrawer
              isOpen={this.state.isOpenDrawer}
              relatedItems={this.state.relatedItems}
              selectedProducts={this.props.selectedProducts}
              routeParams={routeParams}
              router={this.props.router}
              run={d => (this.setState({isOpenDrawer: false}), this.props.callback(d))}
              callback={d => this.setState({isOpenDrawer: d})}
            />
          </div>
        </div>
      );
    }
    else if (chart === "network" && data && data.length > 0) {
      const measureNetworkName =
        flow === "pgi"
          ? "Trade Value Opportunity Gain"
          : flow === "export"
            ? "Trade Value RCA"
            : "Trade Value Relatedness";
      const networkConfig = {
        shapeConfig: {
          Circle: {
            fill: d =>
              d["Trade Value RCA"] > 1
                ? colors.Section[d["Section ID"]] || "gray"
                : "gray"
          },
          Path: {
            sort: (a, b) => a.size - b.size,
            stroke: d => "#585D6B"
          }
        },
        colorScaleConfig: {
          scale: "jenks"
        }
      };
      if (flow !== "export") {
        networkConfig.colorScale = measureNetworkName;
        networkConfig.shapeConfig = {
          fill: "D3PLUS-COMMON-RESET",
          Circle: {
            fill: "D3PLUS-COMMON-RESET"
          },
          Path: {
            sort: (a, b) => a.size - b.size,
            stroke: d => "#585D6B"
          }
        };
      }

      return (
        <div>
          <div className="vb-chart">
            <Network
            // forceUpdate={true}
              config={{
                ...baseConfig,
                ...networkConfig,
                nodes: "/network/network_hs4.json",
                links: "/network/network_hs4.json",
                groupBy: ["Section ID", "HS4 ID"],
                size: d => d["Trade Value"] * 1 || 1,
                sizeMin: 5,
                sizeMax: 15,
                total: undefined

                // stroke: d => {
                //   const proximity = d.size - 1;
                //   const ranges = [
                //     {min: 0, max: 0.326532, color: "#585D6B"},
                //     {min: 0.326532, max: 0.357962, color: "#666679"},
                //     {min: 0.357962, max: 0.464879, color: "#766E86"},
                //     {min: 0.464879, max: 1, color: "#8A7591"}
                //   ];
                //   const selected = ranges.find(
                //     h => h.min <= proximity && proximity < h.max
                //   );
                //   return selected.color || "gray";
                // }


              }}
              nodesFormat={resp => resp.nodes}
              linksFormat={resp => resp.edges}
              dataFormat={data => {
                const newData = data.map(d => Object.assign(d, {id: d["HS4 ID"]}));
                return newData;
              }}
            />
          </div>
          <div className="vb-chart-options">
            <div className="vb-share-download-options">
              <VbShare />
              <VbDownload
                data={data}
                location={this.state.location}
                title="download"
              />
            </div>
          </div>
        </div>
      );
    }
    else if (chart === "rings" && data && data.length > 0) {
      return (
        <div>
          <div className="vb-chart">
            <Rings
              config={{
                center: viztype,
                label: "",
                links: data,
                total: undefined,
                tooltipConfig: {
                  title: (d, x, i) => console.log(d, x, i)
                },
                shapeConfig: {
                  Circle: {
                    fill: d => colors.Section[d.id.slice(0, -4)] || "gray"
                  }
                }
              }}
            />
          </div>
          <div className="vb-chart-options">
            <div className="vb-share-download-options">
              <VbShare />
              <VbDownload
                data={data}
                location={this.state.location}
                title="download"
              />
            </div>
          </div>
        </div>
      );
    }
    else if (chart === "scatter" && data && data.length > 0) {
      const {xAxis, yAxis} = this.props;
      const xTitle = xAxis.title || "";
      const yTitle = yAxis.title || "";
      return (
        <div>
          <div className="vb-chart">
            <Plot
              config={{
                data,
                groupBy: ["Continent", "Country"],
                x: flow,
                y: country,
                on: {
                  click: d =>
                    this.setState({isOpenDrawer: true, relatedItems: d})
                },
                size: "Trade Value",
                sizeMin: 5,
                sizeMax: 40,
                tooltipConfig: {
                  tbody: d => [
                    ["Country ID", d["Country ID"].slice(-3).toUpperCase()],
                    ["Trade Value", `$${formatAbbreviate(d["Trade Value"])}`],
                    [yTitle, formatAbbreviate(d[country])],
                    [xTitle, formatAbbreviate(d[flow])],
                    ["Year", time]
                  ]
                },
                total: undefined,
                xConfig: {
                  scale: this.props.xScale.toLowerCase(),
                  title: xTitle
                },
                yConfig: {
                  scale: this.props.yScale.toLowerCase(),
                  title: yTitle
                }
              }}
            />
          </div>
          <div className="vb-chart-options">
            <div className="vb-share-download-options">
              <VbShare />
              <VbDownload
                data={data}
                location={this.state.location}
                title="download"
              />
            </div>
          </div>
          <VbDrawer
            isOpen={this.state.isOpenDrawer}
            relatedItems={this.state.relatedItems}
            selectedProducts={this.props.selectedProducts}
            routeParams={routeParams}
            router={this.props.router}
            run={d => (this.setState({isOpenDrawer: false}), this.props.callback(d))}
            callback={d => this.setState({isOpenDrawer: d})}
          />
        </div>
      );
    }

    return <div />;
  }
}

/** */
function mapStateToProps(state) {
  const {countryMembers, cubeSelected, wdiIndicators} = state.vizbuilder;

  return {
    countryMembers,
    cubeSelected,
    wdiIndicators
  };
}

export default withNamespaces()(connect(mapStateToProps)(VbChart));
