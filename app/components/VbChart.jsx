import React from "react";
import axios from "axios";
import {Treemap, StackedArea, LinePlot, Geomap, Network, Rings} from "d3plus-react";
import {Client} from "@datawheel/olap-client";
import {range} from "helpers/utils";

import colors from "helpers/colors";

import "./VbChart.css";

import countryMembers from "../../static/members/country.json";

class VbChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      routeParams: this.props.routeParams
    };
  }

  componentDidMount = () => {
    this.fetchData();
  }

  shouldComponentUpdate = (prevProps, prevState) => prevProps.permalink !== this.props.permalink ||
    prevState.loading !== this.state.loading

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

    const countryType = isTechnology ? "Organization Country" : flow === "export"
      ? "Exporter Country"
      : "Importer Country";

    const countryTypeBalance = isTechnology ? "Organization Country" : flow === "export"
      ? "Importer Country"
      : "Exporter Country";

    const partnerType = isTechnology ? "Organization Country" : flow === "export"
      ? "Importer Country"
      : "Exporter Country";

    const ddTech = ["Section", "Superclass", "Class", "Subclass"];

    const dd = {
      show: isTechnology
        ? isFilter
          ? ddTech[viztype.length - 1]
          : "Subclass"
        : countryId.length === 0 || isProduct ? countryTypeBalance : "HS4",
      all: countryTypeBalance
    };

    if (chart === "line") dd.show = "Section";

    const interval = time.split(".");
    if (interval.length === 1) interval.push(interval[0]);

    const drilldowns = ["Year"];
    if (!isTechnology) drilldowns.push(!dd[viztype] ? dd.show : dd[viztype] || countryTypeBalance);
    if (isTechnology && viztype !== "show") drilldowns.push(countryTypeBalance);
    if (isTechnology && partner === "all") drilldowns.push("Subclass");

    const cubeName = !isTechnology
      ? `trade_i_baci_a_${cube.replace("hs", "")}`
      : "patents_i_uspto_w_cpc";
    const measureName = isTechnology ? "Patent Share" : "Trade Value";

    const params = {
      cube: cubeName,
      drilldowns: drilldowns.join(),
      measures: measureName,
      parents: true,
      Year: ["tree_map", "geomap"].includes(chart)
        ? time.replace(".", ",")
        : range(interval[0], interval[interval.length - 1]).join()
    };

    if (countryId) params[countryType] = countryId.map(d => d.value).join();
    if (partnerId) params[partnerType] = partnerId.map(d => d.value).join();
    if (isProduct) params.HS4 = viztype;
    if (isFilter && isTechnology) params[ddTech[viztype.length - 1]] = viztype;

    if (params.drilldowns.includes(countryTypeBalance)) params.properties = `${countryTypeBalance} ISO 3`;

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
    const {chart, cube, flow, country, partner, viztype} = routeParams;

    console.log(data);

    if (loading) return <div>Loading...</div>;

    const isTechnology = cube.includes("cpc");
    const isFilter = !["show", "all"].includes(viztype);

    const baseConfig = {
      data: data || [],
      groupBy: isTechnology && isFilter
        ? country === "show" ? ["Continent", "Country"] : ["Section", "Subclass"]
        : viztype === "all" || isFinite(viztype) || isFilter
          ? ["Continent", "Country"]
          : isTechnology ? ["Section", "Subclass"] : ["Section", "HS4"]
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
            total: measure
          }}
        />
      </div>;
    }

    else if (chart === "stacked" && data && data.length > 0) {
      return <div className="vb-chart">
        <StackedArea
          config={{
            ...baseConfig,
            y: measure,
            x: "Year"
          // time: "Year"
          }}
        />
      </div>;
    }

    else if (chart === "line" && data && data.length > 0) {
      return <div className="vb-chart">
        <LinePlot
          config={{
            ...baseConfig,
            groupBy: viztype === "all" || isFinite(viztype)
              ? ["Continent"]
              : ["Section"],
            y: measure,
            x: "Year"
          // time: "Year"
          }}
        />
      </div>;
    }
    else if (chart === "geomap" && data && data.length > 0) {
      return <div className="vb-chart">
        <Geomap
          config={{
            ...baseConfig,
            colorScale: measure,
            colorScaleConfig: {
              scale: "jenks"
            },
            groupBy: "ISO 3",
            legend: false,
            projection: "geoBoggs",
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
              ? (console.log(d),  colors.Section[d["Section ID"]] || "gray")
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
                .map(dd => Object.assign(dd, {"id": `${dd["HS4 ID"]}`, "HS4 ID": `${dd["HS4 ID"]}`}));

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
            // nodeGroupBy: ["Section ID"],
            // size: "Trade Value",
            label: "",
            shapeConfig: {
              Circle: {
                fill: d => colors.Section[d.id.slice(0, -4)] || "gray"
              }
            },
            total: "Trade Value"
          }}
        />;
      </div>;
    }

    return <div />;
  }
}

export default VbChart;
