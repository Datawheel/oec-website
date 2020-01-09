import React from "react";
import axios from "axios";
import {Treemap, StackedArea} from "d3plus-react";
import {Client} from "@datawheel/olap-client";
import {range} from "helpers/utils";

import "./VbChart.css";

class VbChart extends React.Component {
  constructor(props) {
    super(props);
    const permalink = "stacked/hs02/import/chl/all/show/2013.2017".split("/");
    this.state = {
      countryData: [],
      data: [],
      permalink
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

    const type = flow === "export"
      ? "Exporter Country"
      : "Importer Country";

    const partnerType = flow === "export"
      ? "Importer Country"
      : "Exporter Country";

    const dd = {
      show: "HS4",
      all: type
    };

    const interval = time.split(".");
    if (interval.length === 1) interval.push(interval[0]);

    const params = {
      cube: cube.includes("hs") ? `trade_i_baci_a_${cube.replace("hs", "")}` : "",
      drilldowns: `${dd[viztype]},Year`,
      measures: "Trade Value",
      parents: true,
      Year: range(interval[0], interval[1]).join()
    };

    if (countryId) params[type] = countryId.value;
    if (partnerId) params[partnerType] = partnerId.value;

    axios.get("https://api.oec.world/tesseract/data", {
      params
    }).then(resp => {
      const data = resp.data.data;
      this.setState({data});
    });

  };

  render() {
    const {routeParams} = this.props;
    const {data} = this.state;
    const {chart, flow, country, partner, viztype} = routeParams;
    const baseConfig = {
      data: data || [],
      groupBy: viztype === "all" ? ["Continent", "Country"] : ["Section", "HS4"]
    };

    if (chart === "tree_map") {
      return <div className="vb-chart">
        <Treemap
          config={{
            ...baseConfig,
            sum: "Trade Value"
          }}
        />
      </div>;
    }

    else if (chart === "stacked" && data && data.length > 0) {
      return <div className="vb-chart">
        <StackedArea
          config={{
            ...baseConfig,
            y: "Trade Value",
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
