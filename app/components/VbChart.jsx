import React from "react";
import {withNamespaces} from "react-i18next";
import axios from "axios";
import {Treemap, StackedArea, LinePlot, Geomap, Network, Rings, Plot} from "d3plus-react";
import {Client} from "@datawheel/olap-client";
import {range} from "helpers/utils";

import colors from "helpers/colors";
import {formatAbbreviate} from "d3plus-format";

import "./VbChart.css";

import countryMembers from "../../static/members/country.json";
import OECButtonGroup from "./OECButtonGroup";
import VbDrawer from "./VbDrawer";
import VbShare from "./VbShare";
import VbDownload from "./VbDownload";

const ddTech = ["Section", "Superclass", "Class", "Subclass"];

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
      depth: "HS4",
      techDepth: ddTech[ddTech.length - 1]
    };
  }

  componentDidMount = () => {
    this.setState({location: window.location});
    this.fetchData();
  }

  shouldComponentUpdate = (prevProps, prevState) => prevProps.permalink !== this.props.permalink ||
    prevProps.xScale !== this.props.xScale || prevProps.yScale !== this.props.yScale ||
    prevState.loading !== this.state.loading || prevState.depth !== this.state.depth ||
    prevState.scale !== this.state.scale || prevState.isOpenDrawer !== this.state.isOpenDrawer

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.permalink !== this.props.permalink) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const {routeParams} = this.props;
    const {cube, chart, flow, country, partner, viztype, time} = routeParams;

    this.setState({data: [], loading: true});

    const countryId = countryMembers.filter(d => country.split(".").includes(d.value.slice(2, 5)));
    const partnerId = !["show", "all"].includes(partner)
      ? countryMembers.filter(d => partner.split(".").includes(d.value.slice(2, 5)))
      : undefined;

    const isTechnology = cube.includes("cpc");
    const isProduct = isFinite(viztype);
    const isFilter = !["show", "all"].includes(viztype);
    const isTradeBalance = flow === "show";
    const interval = time.split(".");
    if (interval.length === 1) interval.push(interval[0]);

    const cubeName = !isTechnology
      ? `trade_i_baci_a_${cube.replace("hs", "")}`
      : "patents_i_uspto_w_cpc";
    const measureName = isTechnology ? "Patent Share" : "Trade Value";

    if (isTradeBalance) {
      const exportsBalanceParams = {
        "cube": cubeName,
        "drilldowns": "Year",
        "measures": measureName,
        "parents": true,
        "Year": range(interval[0], interval[interval.length - 1]).join(),
        "Exporter Country": countryId.map(d => d.value).join()
      };

      const importsBalanceParams = {
        "cube": cubeName,
        "drilldowns": "Year",
        "measures": measureName,
        "parents": true,
        "Year": range(interval[0], interval[interval.length - 1]).join(),
        "Importer Country": countryId.map(d => d.value).join()
      };

      if (partnerId) {
        exportsBalanceParams["Importer Country"] = partnerId.map(d => d.value).join();
        importsBalanceParams["Exporter Country"] = partnerId.map(d => d.value).join();
      }

      return axios.all([
        axios.get("https://api.oec.world/tesseract/data", {
          params: exportsBalanceParams
        }),
        axios.get("https://api.oec.world/tesseract/data", {
          params: importsBalanceParams
        })
      ]).then(axios.spread((resp1, resp2) => {
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
          scale: "Linear",
          routeParams
        });
      }));
    }

    const countryType = isTechnology ? "Organization Country" : flow === "export"
      ? "Exporter Country"
      : "Importer Country";

    const countryTypeBalance = isTechnology ? "Organization Country" : flow === "export"
      ? "Importer Country"
      : "Exporter Country";

    const partnerType = isTechnology ? "Organization Country" : flow === "export"
      ? "Importer Country"
      : "Exporter Country";

    const dd = {
      show: isTechnology
        ? isFilter
          ? ddTech[viztype.length - 1]
          : this.state.techDepth
        : countryId.length === 0 || isProduct ? countryTypeBalance : this.state.depth,
      all: countryTypeBalance,
      wildcard: isProduct && countryId.length === 0 ? countryType : countryTypeBalance
    };

    if (chart === "line") dd.show = isFilter ? countryType : "Section";

    const drilldowns = ["Year"];
    if (!isTechnology) drilldowns.push(!dd[viztype] ? dd.wildcard : dd[viztype] || countryTypeBalance);
    if (isTechnology && viztype !== "show") drilldowns.push(countryTypeBalance);
    if (isTechnology && partner === "all" && !isFilter) drilldowns.push(this.state.techDepth);

    const params = {
      cube: cubeName,
      drilldowns: drilldowns.join(),
      measures: measureName,
      parents: true,
      Year: ["tree_map", "geomap"].includes(chart)
        ? time.replace(".", ",")
        : range(interval[0], interval[interval.length - 1]).join()
    };

    if (countryId && countryId.length > 0) params[countryType] = countryId.map(d => d.value).join();
    if (partnerId) params[partnerType] = partnerId.map(d => d.value).join();
    if (isProduct) {
      const productTemp = viztype.split(".")[0];
      const productLevels = ["Section", "HS2", "HS4", "HS6"];
      const n = Math.ceil((productTemp.length - (productTemp.length / 2 >> 0)) / 2);
      params[productLevels[n]] = viztype.replace(".", ",");
    }
    if (isFilter && isTechnology) params[ddTech[viztype.length - 1]] = viztype;

    if (params.drilldowns.includes(countryType)) params.properties = `${countryType} ISO 3`;

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
        Year: 2017
      };

      const endpoint = flow === "pgi"
        ? "opportunity_gain" : "relatedness";

      return axios.get(`/api/stats/${endpoint}`, {
        params: apiStatsParams
      }).then(resp => {
        const data = resp.data.data;
        this.setState({
          data,
          loading: false,
          routeParams
        });
      });
    }
    else if (chart === "rings") {
      const ringsParams = {
        Country: countryId.map(d => d.value)[0],
        Year: 2017
      };
      return axios.get("/api/connections/hs4", {params: ringsParams}).then(resp => {
        const data = resp.data;
        this.setState({
          data,
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

    return axios.get("https://api.oec.world/tesseract/data", {
      params
    }).then(resp => {
      const data = resp.data.data;
      this.setState({
        data,
        loading: false,
        routeParams
      });
    });

  };

  /**
  shouldComponentUpdate = () => {
    this.fetchData();
  }
  */

  render() {
    const {routeParams} = this.state;
    const {data, loading} = this.state;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;

    if (loading) {
      return <div className="vb-loading">
        <div className="vb-loading-spinner">
          <svg className="viz-spinner" width="60px" height="60px" viewBox="0 0 317 317" xmlns="http://www.w3.org/2000/svg">
            <path className="outer" d="M16.43 157.072c0 34.797 12.578 66.644 33.428 91.277l-11.144 11.141c-23.673-27.496-37.992-63.283-37.992-102.418 0-39.133 14.319-74.921 37.992-102.423l11.144 11.144c-20.85 24.63-33.428 56.481-33.428 91.279z"></path>
            <path className="outer" d="M157.793 15.708c34.798 0 66.648 12.58 91.28 33.427l11.143-11.144c-27.502-23.676-63.29-37.991-102.423-37.991-39.132 0-74.919 14.315-102.422 37.991l11.148 11.144c24.627-20.847 56.477-33.427 91.274-33.427"></path>
            <path className="outer" d="M299.159 157.072c0 34.797-12.578 66.644-33.43 91.277l11.145 11.141c23.674-27.496 37.992-63.283 37.992-102.418 0-39.133-14.318-74.921-37.992-102.423l-11.145 11.144c20.852 24.63 33.43 56.481 33.43 91.279"></path>
            <path className="outer" d="M157.793 298.432c-34.797 0-66.647-12.574-91.274-33.424l-11.148 11.138c27.503 23.682 63.29 37.997 102.422 37.997 39.133 0 74.921-14.315 102.423-37.997l-11.143-11.138c-24.632 20.85-56.482 33.424-91.28 33.424"></path>
            <path className="middle" d="M226.59 61.474l-7.889 13.659c24.997 18.61 41.184 48.382 41.184 81.94 0 33.555-16.187 63.329-41.184 81.936l7.889 13.664c29.674-21.394 49.004-56.23 49.004-95.6 0-39.373-19.33-74.21-49.004-95.599"></path>
            <path className="middle" d="M157.793 259.169c-52.398 0-95.553-39.485-101.399-90.317h-15.814c5.912 59.524 56.131 106.018 117.213 106.018 17.26 0 33.633-3.742 48.404-10.406l-7.893-13.672c-12.425 5.38-26.114 8.377-40.511 8.377"></path>
            <path className="middle" d="M157.793 54.976c14.397 0 28.086 2.993 40.511 8.371l7.893-13.667c-14.771-6.669-31.144-10.412-48.404-10.412-61.082 0-111.301 46.493-117.213 106.021h15.814c5.846-50.831 49.001-90.313 101.399-90.313"></path>
            <path className="inner" d="M95.371 164.193c-3.476-30.475 15.471-58.324 43.723-67.097l-1.804-15.842c-36.899 9.931-61.986 45.602-57.524 84.719 4.461 39.115 36.934 68.219 75.122 69.584l-1.806-15.838c-29.504-2.186-54.235-25.054-57.711-55.526"></path>
            <path className="inner" d="M162.504 94.425c29.508 2.185 54.235 25.053 57.711 55.529 3.476 30.469-15.466 58.319-43.724 67.096l1.806 15.834c36.898-9.927 61.986-45.598 57.525-84.712-4.461-39.117-36.936-68.223-75.125-69.588l1.807 15.841z"></path>
          </svg>
        </div>
        <div className="vb-loading-text">
          Loading...
        </div>
        <div className="vb-loading-built">
          <a href="https://www.datawheel.us/" target="_blank" rel="noopener noreferrer">
            Built by Datawheel
          </a>
        </div>

      </div>;
    }

    const isTechnology = cube.includes("cpc");
    const isFilter = !["show", "all"].includes(viztype);

    const tickFormatter = value => !isTechnology ? `$${formatAbbreviate(value)}` : formatAbbreviate(value);

    const baseConfig = {
      data: data || [],
      groupBy: isTechnology && isFilter
        ? country === "show" ? ["Continent", "Country"] : ["Section", this.state.techDepth]
        : viztype === "all" || isFinite(viztype) || isFilter
          ? ["Continent", "Country"]
          : isTechnology ? ["Section", this.state.techDepth] : ["Section", this.state.depth],
      totalFormat: d => `Total: ${tickFormatter(d)}`
    };

    if (isTechnology) {
      baseConfig.aggs = {
        "Section ID": undefined
      };
    }

    const measure = isTechnology ? "Patent Share" : "Trade Value";

    if (chart === "tree_map" && data && data.length > 0) {
      return <div className="vb-chart">
        <Treemap
          config={{
            ...baseConfig,
            sum: measure,
            total: measure,
            on: {
              click: d => this.setState({isOpenDrawer: true, relatedItems: d})
            }
          }}
        />
        <div className="vb-chart-options">
          {!isTechnology && <OECButtonGroup
            items={["HS2", "HS4", "HS6"]}
            selected={this.state.depth}
            title={"Depth"}
            callback={depth => this.setState({depth}, () => this.fetchData())}
          />}
          {isTechnology && <OECButtonGroup
            items={ddTech.slice(1)}
            selected={this.state.techDepth}
            title={"Depth"}
            callback={depth => this.setState({techDepth: depth}, () => this.fetchData())}
          />}

          <VbShare />
          <VbDownload
            data={data}
            location={this.state.location}
            title="download"
          />

          <VbDrawer
            isOpen={this.state.isOpenDrawer}
            relatedItems={this.state.relatedItems}
            routeParams={routeParams}
            router={this.props.router}
            callback={d => this.setState({isOpenDrawer: d})}
          />
        </div>
      </div>;
    }

    else if (chart === "stacked" && data && data.length > 0) {
      return <div className="vb-chart">
        <StackedArea
          config={{
            ...baseConfig,
            total: undefined,
            y: measure,
            yConfig: {
              tickFormat: d => tickFormatter(d),
              scale: "linear"
            },
            x: "Year"
          // time: "Year"
          }}
        />
        <div className="vb-chart-options">
          {!isTechnology && <OECButtonGroup
            items={["HS2", "HS4", "HS6"]}
            selected={this.state.depth}
            title={"Depth"}
            callback={depth => this.setState({depth}, () => this.fetchData())}
          />}
          {isTechnology && <OECButtonGroup
            items={ddTech.slice(1)}
            selected={this.state.techDepth}
            title={"Depth"}
            callback={depth => this.setState({techDepth: depth}, () => this.fetchData())}
          />}
        </div>
      </div>;
    }

    else if (chart === "line" && data && data.length > 0) {
      return <div className="vb-chart">
        <LinePlot
          forceUpdate={true}
          key={`lineplot_${this.state.scale}`}
          config={{
            ...baseConfig,
            groupBy: flow === "show" ? ["Trade Flow"] : viztype === "all" || isFinite(viztype)
              ? ["Continent", "Country"]
              : ["Section"],
            y: measure,
            yConfig: {
              scale: this.state.scale.toLowerCase()
            },
            x: "Year",
            discrete: "x",
            total: undefined,
            timeline: false,
            // legend: false
            time: "Year"
          }}
        />
        <OECButtonGroup items={["Log", "Linear"]} selected={this.state.scale} title={"Scale"} callback={scale => this.setState({scale})} />
      </div>;
    }
    else if (chart === "geomap" && data && data.length > 0) {
      console.log(data);
      return <div className="vb-chart">
        <Geomap
          config={{
            ...baseConfig,
            colorScale: measure,
            colorScaleConfig: {
              scale: "log"
            },
            groupBy: "ISO 3",
            legend: false,
            topojsonId: "id",
            topojsonKey: "id",
            tiles: false,
            topojson: "/topojson/world-50m.json",
            topojsonFilter: d => d.id !== "ata",
            ocean: false,
            total: false
          }}
        />
      </div>;
    }
    else if (chart === "network" && data && data.length > 0) {
      const measureNetworkName = flow === "pgi"
        ? "Trade Value Opportunity Gain"
        : flow === "export" ? "Trade Value RCA" : "Trade Value Relatedness";
      const networkConfig = {
        shapeConfig: {
          Circle: {
            fill: d => d["Trade Value RCA"] > 1
              ? colors.Section[d["Section ID"]] || "gray"
              : "gray"
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
          }
        };
      }

      return <div className="vb-chart">
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
            legend: false,
            total: undefined
          }}
          nodesFormat={resp => resp.nodes}
          linksFormat={resp => resp.edges}
          dataFormat={
            d => {
              const newData = d
                .map(dd => Object.assign(dd, {"id": dd["HS4 ID"], "HS4 ID": `${dd["HS4 ID"]}`}));

              return newData;
            }
          }
        /></div>;
    }

    else if (chart === "rings" && data && data.length > 0) {
      return <div className="vb-chart">
        <Rings
          config={{
            links: data,
            center: viztype,
            total: undefined,
            label: "",
            shapeConfig: {
              Circle: {
                fill: d => colors.Section[d.id.slice(0, -4)] || "gray"
              }
            }
          }}
        />;
      </div>;
    }

    else if (chart === "scatter" && data && data.length > 0) {
      return <div className="vb-chart">
        <Plot
          config={{
            data,
            groupBy: ["Continent", "Country"],
            x: flow,
            y: country,
            size: "Trade Value",
            sizeMin: 5,
            sizeMax: 40,
            tooltipConfig: {
              tbody: d => [
                ["Country ID", d["Country ID"].slice(-3).toUpperCase()],
                ["Trade Value", `$${formatAbbreviate(d["Trade Value"])}`],
                ["Measure", `$${formatAbbreviate(d.Measure)}`],
                ["Year", time]
              ]
            },
            total: undefined,
            xConfig: {
              scale: this.props.xScale.toLowerCase()
            },
            yConfig: {
              scale: this.props.yScale.toLowerCase()
            }
          }}
        />
      </div>;
    }

    return <div />;
  }
}

export default withNamespaces()(VbChart);
