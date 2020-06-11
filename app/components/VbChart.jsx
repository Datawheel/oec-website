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
import {tooltipTitle} from "../d3plus.js";
import {parseURL, range} from "helpers/utils";
import colors from "helpers/colors";
import subnat from "helpers/subnatVizbuilder";
import {formatAbbreviate} from "d3plus-format";
import {Drawer, Icon, Position} from "@blueprintjs/core";

import "./VbChart.css";

import countryMembers from "../../static/members/country.json";
import OECButtonGroup from "./OECButtonGroup";
import VbDrawer from "./VbDrawer";
import VbShare from "./VbShare";
import VbDownload from "./VbDownload";
import PaywallChart from "./PaywallChart";
import Loading from "./Loading.jsx";

const ddTech = ["Section", "Superclass", "Class", "Subclass"];
const measures = ["Trade Value", "Growth", "Growth (%)"];

const CANON_STATS_API = "/api/stats/";
const OLAP_API = "/olap-proxy/data";

const geoFilter = (d, type) => type.split(".").includes(d.value.slice(2, 5));

const CancelToken = axios.CancelToken;
let cancel;

class VbDrawerEmbed extends React.PureComponent {
  state = {
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    hasBackdrop: true,
    autoFocus: true,
    isOpen: true,
    position: Position.BOTTOM,
    size: 100
  }

  handleClose = () => {
    this.setState({isOpen: false});
    this.props.callback(false);
  };
  render() {
    return <Drawer {...this.state} isOpen={this.props.isOpen} onClose={this.handleClose}>
      {this.props.children}
    </Drawer>;
  }
}

class VbChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: true,
      data: [],
      depth: "HS4",
      isOpenDrawer: false,
      isOpenMoreDetails: false,
      loading: true,
      relatedItems: {},
      routeParams: this.props.routeParams,
      scale: "Log",
      selected: measures[0],
      stackLayout: "Value",
      subnatGeoDepth: undefined,
      techDepth: ddTech[ddTech.length - 1]
    };
  }

  componentDidMount = () => {
    const {cubeSelected, routeParams} = this.props;
    const {cube} = routeParams;

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
    prevProps.data.length !== this.props.data.length ||
    JSON.stringify(prevProps.cubeSelected) !== JSON.stringify(this.props.cubeSelected) ||
    JSON.stringify(prevProps.xConfig) !== JSON.stringify(this.props.xConfig) ||
    JSON.stringify(prevProps.yConfig) !== JSON.stringify(this.props.yConfig) ||
    prevState.depth !== this.state.depth ||
    prevState.isOpenDrawer !== this.state.isOpenDrawer ||
    prevState.isOpenMoreDetails !== this.state.isOpenMoreDetails ||
    prevState.loading !== this.state.loading ||
    prevState.scale !== this.state.scale ||
    prevState.selected !== this.state.selected ||
    prevState.stackLayout !== this.state.stackLayout ||
    prevState.subnatGeoDepth !== this.state.subnatGeoDepth;

  componentDidUpdate = prevProps => {
    if (JSON.stringify(prevProps.cubeSelected) !== JSON.stringify(this.props.cubeSelected)) {
      const levels = this.props.cubeSelected.productLevels;
      const depth = levels.includes("HS4") ? "HS4" : levels[levels.length - 1];
      this.setState({depth}, () => this.fetchData());
    }
    else if (prevProps.permalink !== this.props.permalink) {
      this.fetchData();
    }

  };

  fetchSubnatData = () => {
    const {depth, subnatGeoDepth} = this.state;
    const {cubeSelected, routeParams} = this.props;
    const {timeItems} = cubeSelected;
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
    if (!geoId) drilldowns.push(subnatGeoDepth || geoLevels[geoLevels.length - 1]);
    else if (geoId && viztype === "show") drilldowns.push(["line"].includes(chart) ? productLevels[0] : depth);
    else if (geoId && viztype === "all" || geoId && isFilter) drilldowns.push("Country");

    // if (isFilter || timeSeriesChart)
    drilldowns.push(timeLevel);


    const params = {
      cube: subnatData.cube,
      drilldowns: drilldowns.join(),
      measures: subnatData.measure,
      parents: true
    };


    let timeFilter = time.replace(".", ",");
    if (isTimeSeries) {
      const interval = time.split(".");
      const j = timeItems.findIndex(d => d.value === interval[0]);
      const i = timeItems.findIndex(d => d.value === interval[1]);
      timeFilter = timeItems.slice(i, j + 1).map(d => d.value).join();
    }
    params.Time = timeFilter;

    if (flowItems[flow]) params["Trade Flow"] = flowItems[flow];
    else params.drilldowns = `Trade Flow,${timeLevel}`;
    if (partnerId) params.Country = partnerId.map(d => d.value).join();
    if (geoId && cube.slice(-3) !== geoId) params["Subnat Geography"] = geoId;
    if (isFilter) params.Product = viztype;
    if (params.drilldowns.includes("Country")) params.properties = "ISO 3";

    const measureName = "Trade Value";
    const interval = time.split(".");
    const growth = `${timeLevel},${measureName}`;
    if (this.state.selected.includes("Growth")) {

      const i = timeItems.findIndex(d => d.value * 1 === interval[0] * 1);
      delete params.Time;
      const diff = 1;
      params.growth = growth;
      if (!params.drilldowns.includes(timeLevel)) {
        params.drilldowns += `,${timeLevel}`;
      }
      const year = time * 1;
      params[timeLevel] = `${timeItems[i + diff].value},${year}`;
    }
    const fullURL = `${OLAP_API}?${parseURL(params)}`;
    if (cancel !== undefined) {
      cancel();
    }
    return axios
      .get(OLAP_API, {cancelToken: new CancelToken(c => {
        cancel = c;
      }), params})
      .then(resp => {
        let data = resp.data.data;

        if (this.state.selected.includes("Growth")) data = data.filter(d => d[timeLevel] === interval[0] * 1);

        if (data[0] && data[0].Time) {
          data = data.map(d => {
            const time = d.Time.toString();
            const year = time.slice(0, 4);
            let month = time.slice(4, timeLength);
            if (timeLength === 5) {
              month = month * 3 - 2;
            }
            const day = "01";
            const timeId = new Date(`${year}/${month}/${day}`).getTime();
            return Object.assign(d, {"Time ID": timeId});
          });
        }
        this.props.updateData({API: fullURL, data, loading: false});
        const nextState = {
          data,
          auth: true,
          loading: false,
          routeParams
        };
        if (!subnatGeoDepth) nextState.subnatGeoDepth = geoLevels[geoLevels.length - 1];
        this.setState(nextState);
      }).catch(error => {
        // TODO: AUTH
        const nextState = {data: [], loading: false, routeParams};
        this.props.updateData({API: undefined, data: [], loading: false});
        if (error.response && error.response.status === 401) nextState.auth = false;
        this.setState(nextState);
      });
  }

  fetchData = () => {
    const {cubeSelected, routeParams} = this.props;
    const {geoLevels} = cubeSelected;
    const {cube, chart, flow, partner, viztype, time} = routeParams;
    let {country} = routeParams;
    if (country === "wld") country = "all";

    // Updates Redux state, with an empty data array
    const prevState = {API: undefined, data: [], loading: true};
    this.props.updateData(prevState);
    if (!["tree_map"].includes(chart)) prevState.selected = measures[0];
    this.setState(prevState);

    // If cube selected is subnational, uses fetchSubnatData function
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

    // Gets cube config
    const cubeName = cubeSelected.name;
    const measureName = cubeSelected.measure;
    const timeDimension = "Year";
    const {productLevels} = cubeSelected;

    const growth = `${timeDimension},${measureName}`;

    const reporterCountry = geoLevels[0];
    const partnerCountry = geoLevels[1];

    if (isTradeBalance) {
      const balanceParams = {
        cube: cubeName,
        drilldowns: timeDimension,
        measures: measureName,
        parents: true,
        Year: timeFilter
      };

      const exportsBalanceParams = Object.assign({},
        balanceParams, {[reporterCountry]: countryIds}
      );
      const importsBalanceParams = Object.assign({},
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
          axios.spread((...resp) => {
            const exportData = resp[0].data.data;
            const importData = resp[1].data.data;
            exportData.forEach(d => {
              d["Trade Flow ID"] = 1;
              d["Trade Flow"] = "Exports";
            });

            importData.forEach(d => {
              d["Trade Flow ID"] = 2;
              d["Trade Flow"] = "Imports";
            });

            const data = [...exportData, ...importData];
            const fullURL1 = `${OLAP_API}?${parseURL(exportsBalanceParams)}`;
            const fullURL2 = `${OLAP_API}?${parseURL(importsBalanceParams)}`;
            this.props.updateData({API: [fullURL1, fullURL2], data, loading: false});
            this.setState({
              data,
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

    if (chart === "line") dd.show = isFilter ? countryType : productLevels[0];

    const drilldowns = [timeDimension];
    if (!isTechnology) {
      if (country === "all" && partner === "all") {
        drilldowns.push(this.state.depth);
      }
      else {
        drilldowns.push(
          !dd[viztype] ? dd.wildcard : dd[viztype] || countryTypeBalance
        );
      }
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
    if (params.drilldowns.includes(countryTypeBalance)) {
      params.properties = `${countryTypeBalance} ISO 3`;
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

      const endpoint = flow === "ogi" ? "opportunity_gain" : "relatedness";

      return axios
        .get(`${CANON_STATS_API}${endpoint}`, {
          params: apiStatsParams
        })
        .then(resp => {
          const data = resp.data.data;
          const fullURL = `${CANON_STATS_API}${endpoint}${parseURL(apiStatsParams)}`;
          this.props.updateData({API: fullURL, data, loading: false});
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
          const fullURL = `/api/connections/hs4?${parseURL(ringsParams)}`;
          this.props.updateData({API: fullURL, data, loading: false});
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
        const fullURL = `/api/gdp/eci?${parseURL(scatterParams)}`;
        this.props.updateData({API: fullURL, data, loading: false});
        this.setState({
          data,
          loading: false,
          routeParams
        });
      });
    }

    if (cancel !== undefined) {
      cancel();
    }
    return axios
      .get(OLAP_API, {
        cancelToken: new CancelToken(c => {
          cancel = c;
        }), params})
      .then(resp => {
        let data = resp.data.data;
        if (this.state.selected.includes("Growth")) data = data.filter(d => d.Year === time * 1);
        const fullURL = `${OLAP_API}?${parseURL(params)}`;
        this.props.updateData({API: fullURL, data, loading: false});
        this.setState({
          data,
          auth: true,
          loading: false,
          routeParams
        });
      }).catch(() => {
        this.props.updateData({API: undefined, data: [], loading: false});
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
    const {auth, loading, routeParams} = this.state;
    const {cubeSelected, data, t} = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;
    const {currency} = cubeSelected;

    if (loading) {
      return <Loading isDark={this.props.isEmbed} />;
    }

    if (!auth) {
      return <PaywallChart />;
    }

    const isTechnology = cube.includes("cpc");
    const isFilter = !["show", "all"].includes(viztype);
    const isGeo = !["show", "all"].includes(country);

    const tickFormatter = value =>
      !isTechnology ? `${currency || "$"}${formatAbbreviate(value)}` : formatAbbreviate(value);
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

    const vbDrawerComponent = (groupBy = baseConfig.groupBy) => <VbDrawer
      isOpen={this.state.isOpenDrawer}
      groupBy={groupBy}
      relatedItems={this.state.relatedItems}
      selectedProducts={this.props.selectedProducts}
      routeParams={routeParams}
      router={this.props.router}
      run={d => (this.setState({isOpenDrawer: false}), this.props.callback(d))}
      callback={d => this.setState({isOpenDrawer: d})}
    />;

    const vbChartOptions =
      <div className="vb-share-download-options">
        <VbShare />
        <VbDownload
          data={data}
          location={this.state.location}
          title="download"
        />
      </div>;

    const cog = this.props.isEmbed ? <div className="vb-chart-cog"
    >
      <Icon onClick={() => this.setState({isOpenMoreDetails: !this.state.isOpenMoreDetails})} icon="cog" />
    </div> : <span />;


    if (chart === "tree_map" && data && data.length > 0) {
      const isContinentGroupBy = baseConfig.groupBy[0] === "Continent";
      const treemapChartOptions = <div className="vb-chart-options">
        <div className="vb-chart-options-config">
          {!isTechnology && !isContinentGroupBy && !isGeoSubnatGroupBy && productDepthItems.length > 1 &&
      <OECButtonGroup
        items={productDepthItems}
        selected={this.state.depth}
        title={"Depth"}
        callback={depth => this.setState({depth}, () => this.fetchData())}
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
          {vbChartOptions}
        </div></div>;
      return (
        <div>
          {cog}
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

          {this.props.isEmbed
            ? <VbDrawerEmbed
              callback={isOpenMoreDetails => this.setState({isOpenMoreDetails})}
              isOpen={this.state.isOpenMoreDetails}>{treemapChartOptions}</VbDrawerEmbed>
            : treemapChartOptions}
          {vbDrawerComponent()}
        </div>
      );
    }
    else if (chart === "stacked" && data && data.length > 0) {
      if (this.state.stackLayout === "Share") baseConfig.stackOffset = "expand";
      const stackedChartOptions = <div className="vb-chart-options">
        <div className="vb-chart-options-config">
          {!isTechnology &&
        <OECButtonGroup
          items={productDepthItems}
          selected={this.state.depth}
          title={"Depth"}
          callback={depth =>
            this.setState({depth}, () => this.fetchData())
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
          {vbChartOptions}
        </div>
      </div>;
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
                x: isSubnat && data[0]["Time ID"] ? "Time ID" : "Year",
                time: isSubnat && data[0]["Time ID"] ? "Time ID" : "Year",
                xConfig: {
                  title: this.props.isEmbed ? "" : isSubnat ? t("Time") : t("Year")
                },
                y: measure,
                yConfig: {
                  tickFormat: d => this.state.stackLayout === "Share" ? `${formatAbbreviate(d * 100)}%` : tickFormatter(d),
                  scale: "linear"
                }
              }}
            /></div>
          {this.props.isEmbed
            ? <VbDrawerEmbed
              callback={isOpenMoreDetails => this.setState({isOpenMoreDetails})}
              isOpen={this.state.isOpenMoreDetails}>{stackedChartOptions}</VbDrawerEmbed>
            : stackedChartOptions}
          {vbDrawerComponent()}
        </div>
      );
    }
    else if (chart === "line" && data && data.length > 0) {
      const {geoLevels, productLevels} = this.props.cubeSelected;
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

      const lineChartOptions = <div className="vb-chart-options">
        <div className="vb-chart-options-config">
          <OECButtonGroup
            items={["Log", "Linear"]}
            selected={this.state.scale}
            title={"Scale"}
            callback={scale => this.setState({scale})}
          />
          {vbChartOptions}
        </div>
      </div>;

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
          {this.props.isEmbed
            ? <VbDrawerEmbed
              callback={isOpenMoreDetails => this.setState({isOpenMoreDetails})}
              isOpen={this.state.isOpenMoreDetails}>{lineChartOptions}</VbDrawerEmbed>
            : lineChartOptions}
          {vbDrawerComponent(lineGroupBy)}

        </div>
      );
    }
    else if (chart === "geomap" && data && !loading) {
      const i = isSubnat ? isSubnat.geoLevels.indexOf(this.state.subnatGeoDepth) : -1;
      const topojson = isSubnat && !isGeo
        ? isSubnat.topojson[i === -1 ? isSubnat.topojson.length - 1 : i]
        : "/topojson/world-50m.json";

      const geoGroupBy = isSubnat && !isGeo ? `${this.state.subnatGeoDepth} ID` : "ISO 3";
      const geomapChartOptions = <div className="vb-chart-options">
        <div className="vb-chart-options-config">
          {isSubnat && isSubnat.geoLevels.length > 1 && <OECButtonGroup
            items={isSubnat.geoLevels}
            selected={this.state.subnatGeoDepth}
            title={"Depth"}
            callback={subnatGeoDepth => this.setState({subnatGeoDepth}, () => this.fetchData())}
          />}
          {vbChartOptions}
        </div>
      </div>;
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
                  axisConfig: {
                    tickFormat: d => tickFormatter(d)
                  },
                  scale: isSubnat ? "quantile" : "log"
                },
                groupBy: geoGroupBy,
                legend: false,
                ocean: false,
                tiles: false,
                topojson,
                // topojsonFilter: d => d.id !== "ata",
                // topojsonId: "id",
                topojsonId: isSubnat && !isGeo ? d => d.properties.id : "id",
                topojsonKey: isSubnat && !isGeo ? "objects" : "id",
                // topojsonKey: "id",
                total: false
              }}
            />
          </div>
          {this.props.isEmbed
            ? <VbDrawerEmbed
              callback={isOpenMoreDetails => this.setState({isOpenMoreDetails})}
              isOpen={this.state.isOpenMoreDetails}>{geomapChartOptions}</VbDrawerEmbed>
            : geomapChartOptions}
          {vbDrawerComponent(geoGroupBy)}
        </div>
      );
    }
    else if (chart === "network" && data && data.length > 0) {
      const measureNetworkName =
        flow === "ogi"
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

      const width = window.innerWidth;
      const mobile = width < 768 ? 0.5 : 1;
      const networkChartOptions = <div className="vb-chart-options">
        {vbChartOptions}
      </div>;

      return (
        <div>
          <div className="vb-chart">
            <Network
              config={{
                ...baseConfig,
                ...networkConfig,
                nodes: "/network/network_hs4.json",
                links: "/network/network_hs4.json",
                groupBy: ["Section ID", "HS4 ID"],
                size: d => d["Trade Value"] * 1 || 1,
                sizeMin: 5 * mobile,
                sizeMax: 15 * mobile,
                legendTooltip: {
                  tbody: []
                },
                total: undefined
              }}
              nodesFormat={resp => resp.nodes}
              linksFormat={resp => resp.edges}
              dataFormat={data => {
                const newData = data.map(d => Object.assign(d, {id: d["HS4 ID"]}));
                return newData;
              }}
            />
          </div>
          {this.props.isEmbed
            ? <VbDrawerEmbed
              callback={isOpenMoreDetails => this.setState({isOpenMoreDetails})}
              isOpen={this.state.isOpenMoreDetails}>{networkChartOptions}</VbDrawerEmbed>
            : networkChartOptions}
        </div>
      );
    }
    else if (chart === "rings" && data && data.length > 0) {
      const selected = viztype.split(".")[0];
      if (![5, 6].includes(selected.length)) {
        const selectedProduct = this.props.selectedProducts.find(d => d.id === selected * 1) || {};
        const name = selectedProduct.name;
        return <div>
          <div className="vb-chart">
            <div className="vb-chart-no-data">
              <h3 className="title">
                {t(`No connections available for \"${name},${selected}\".`)}
              </h3>
            </div>
          </div>
        </div>;
      }

      const labels = this.props.cubeSelected.productItems.reduce((obj, d) => {
        if (!obj[d["HS4 ID"]]) obj[d["HS4 ID"]] = d.HS4;
        return obj;
      }, {});
      const labelsRings = data.reduce((obj, d) => {
        if (!obj[d["HS4 ID"]]) obj[d["HS4 ID"]] = d;
        return obj;
      }, {});

      const ringsChartOptions = <div className="vb-chart-options">
        {vbChartOptions}
      </div>;

      return (
        <div>
          <div className="vb-chart">
            <Rings
              config={{
                data,
                center: selected,
                label: d => labels[d.id] || "",
                legend: false,
                links: data,
                total: undefined,
                tooltipConfig: {
                  title: d => {
                    const parentId = d.id.slice(0, -4);
                    const color = colors.Section[parentId] || "gray";
                    const image = `/images/icons/hs/hs_${parentId}.svg`;
                    return tooltipTitle(color, image, labels[d.id] || "");
                  },
                  tbody: d => {
                    const data = labelsRings[d.id];
                    const output = [];
                    if (data) {
                      output.push([t("HS4 ID"), data["HS4 ID"].toString().slice(-4)]);
                      output.push([t("Relatedness"), formatAbbreviate(data["Trade Value Relatedness"])]);
                      output.push([t("RCA"), formatAbbreviate(data["Trade Value RCA"])]);
                      output.push([t("Exports Value"), `$${formatAbbreviate(data["Trade Value"])}`]);
                    }
                    return output;
                  }
                },
                shapeConfig: {
                  Circle: {
                    fill: d => colors.Section[d.id.slice(0, -4)] || "gray"
                  }
                }
              }}
            />
          </div>
          {this.props.isEmbed
            ? <VbDrawerEmbed
              callback={isOpenMoreDetails => this.setState({isOpenMoreDetails})}
              isOpen={this.state.isOpenMoreDetails}>{ringsChartOptions}</VbDrawerEmbed>
            : ringsChartOptions}
        </div>
      );
    }
    else if (chart === "scatter" && data && data.length > 0) {
      const {xConfig, yConfig} = this.props;
      const xTitle = xConfig.title || "";
      const yTitle = yConfig.title || "";
      const xSelected = xConfig.selected.toLowerCase();
      const ySelected = yConfig.selected.toLowerCase();
      const scatterChartOptions = <div className="vb-chart-options">
        {vbChartOptions}
      </div>;
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
                shapeConfig: {
                  Circle: {
                    backgroundImage: d => `/images/icons/country/country_${d["Country ID"].slice(2, 5)}_circle.png`,
                    label: ""
                  }
                },
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
                  scale: xSelected,
                  title: xTitle
                },
                yConfig: {
                  scale: ySelected,
                  title: yTitle
                }
              }}
            />
          </div>
          {this.props.isEmbed
            ? <VbDrawerEmbed
              callback={isOpenMoreDetails => this.setState({isOpenMoreDetails})}
              isOpen={this.state.isOpenMoreDetails}>{scatterChartOptions}</VbDrawerEmbed>
            : scatterChartOptions}
          {vbDrawerComponent(["Continent", "Country"])}
        </div>
      );
    }

    return <div />;
  }
}

/** */
const mapDispatchToProps = dispatch => ({
  // dispatching plain actions
  updateData: payload => dispatch({type: "VB_UPDATE_DATA", payload})
});

/** */
function mapStateToProps(state) {
  const {axisConfig, countryMembers, cubeSelected, data, wdiIndicators} = state.vizbuilder;
  const {xConfig, yConfig} = axisConfig;
  return {
    countryMembers,
    cubeSelected,
    data,
    wdiIndicators,
    xConfig,
    yConfig
  };
}

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(VbChart));
