import React from "react";
import axios from "axios";
import {Treemap, StackedArea, LinePlot, Geomap, Network} from "d3plus-react";
import {Client} from "@datawheel/olap-client";
import {range} from "helpers/utils";

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
      show: isTechnology ? isFilter ? ddTech[viztype.length - 1] : "Subclass" : "HS4",
      all: countryTypeBalance
    };

    if (chart === "line") dd.show = "Section";

    const interval = time.split(".");
    if (interval.length === 1) interval.push(interval[0]);

    const drilldowns = ["Year"];
    if (!isTechnology) drilldowns.push(!dd[viztype] ? dd.show : dd[viztype] || countryTypeBalance);
    if (isTechnology) drilldowns.push(countryTypeBalance);
    console.log(drilldowns);

    const params = {
      cube: !isTechnology
        ? `trade_i_baci_a_${cube.replace("hs", "")}`
        : "patents_i_uspto_w_cpc",
      drilldowns: drilldowns.join(),
      measures: isTechnology ? "Patent Share" : "Trade Value",
      parents: true,
      Year: ["tree_map", "geomap"].includes(chart)
        ? time.replace(".", ",")
        : range(interval[0], interval[interval.length - 1]).join()
    };

    if (countryId) params[countryType] = countryId.map(d => d.value).join();
    if (partnerId) params[partnerType] = partnerId.map(d => d.value).join();
    if (isProduct) params.HS4 = viztype;
    if (isFilter && isTechnology) params[ddTech[viztype.length - 1]] = viztype;

    if (params.drilldowns.includes("Country")) params.properties = `${countryTypeBalance} ISO 3`;

    axios.get("https://api.oec.world/tesseract/data", {
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
    else if (chart === "network") {
      return <div className="vb-chart">
        <Network
          config={{
            ...baseConfig,
            nodes: "/network/network_hs4.json",
            links: "/network/network_hs4.json",
            groupBy: ["id"],

            size: d => 1,
            sizeMin: 2,
            sizeMax: 9,
            shapeConfig: {
            // strokeWidth: d => 1,
              stroke: d => "#444444",
              Path: {
                stroke: d => "#ccd0d6"
              }
            },
            total: undefined
          }}
          nodesFormat={resp => resp.nodes}
          linksFormat={resp => resp.edges}
          dataFormat={
            d => {
              const newData = d
                .map(dd => Object.assign(dd, {"id": `${dd["HS4 ID"]}`, "HS4 ID": `${dd["HS4 ID"]}`}));
              // .filter(dd => dd["HS4 ID"] === "10101");
              console.log(newData);
              return newData;
            }
          }
        /></div>;
    }

    return <div />;
  }
}

export default VbChart;
