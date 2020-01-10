import React from "react";
import axios from "axios";
import {Treemap, StackedArea, LinePlot} from "d3plus-react";
import {Client} from "@datawheel/olap-client";
import {range} from "helpers/utils";

import "./VbChart.css";

class VbChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryData: [],
      data: []
    };
  }

  componentDidMount() {
    Client.fromURL("https://api.oec.world/tesseract")
      .then(client => client.getCube("trade_i_baci_a_92").then(cube => {
        const query = cube.query;
        query.addMeasure("Trade Value");
        return client.getMembers({level: "Exporter Country"});

      }))
      .then(data => {
        this.setState(
          {countryData: data.map(d => ({value: d.key, title: d.name}))},
          () => this.fetchData()
        );
      });

  }

  fetchData = () => {
    const {routeParams} = this.props;
    const {countryData} = this.state;
    const {cube, flow, country, partner, viztype, time} = routeParams;

    const countryId = countryData.find(d => d.value.includes(country));
    const partnerId = !["show", "all"].includes(partner)
      ? countryData.find(d => d.value.includes(partner))
      : undefined;

    const isTechnology = cube.includes("cpc");
    const isProduct = isFinite(viztype);

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
      show: isTechnology ? "Subclass" : "HS4",
      all: countryTypeBalance
    };

    const interval = time.split(".");
    if (interval.length === 1) interval.push(interval[0]);

    const params = {
      cube: !isTechnology
        ? `trade_i_baci_a_${cube.replace("hs", "")}`
        : "patents_i_uspto_w_cpc",
      drilldowns: `${dd[viztype] || countryTypeBalance},Year`,
      measures: isTechnology ? "Patent Share" : "Trade Value",
      parents: true,
      Year: range(interval[0], interval[1]).join()
    };

    if (countryId) params[countryType] = countryId.value;
    if (partnerId) params[partnerType] = partnerId.value;
    if (isProduct) params.HS4 = viztype;

    axios.get("https://api.oec.world/tesseract/data", {
      params
    }).then(resp => {
      const data = resp.data.data;
      console.log(resp);
      this.setState({data});
    });

  };

  render() {
    const {routeParams} = this.props;
    const {data} = this.state;
    const {chart, cube, flow, country, partner, viztype} = routeParams;

    const isTechnology = cube.includes("cpc");

    const baseConfig = {
      data: data || [],
      groupBy: viztype === "all" || isFinite(viztype)
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
      console.log(baseConfig);
      return <div className="vb-chart">
        <Treemap
          forceUpdate={true}
          config={{
            ...baseConfig,
            sum: measure
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
    return <div />;
  }
}

export default VbChart;
