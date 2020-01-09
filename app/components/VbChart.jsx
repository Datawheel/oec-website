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
      data: [],
      permalink
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const {routeParams} = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;

    const type = flow === "export"
      ? "Exporter Country"
      : "Importer Country";

    const dd = {
      show: "HS4",
      all: type
    };

    let interval = time.split(".");
    if (interval.length === 1) interval.push(interval[0]);

    const params = {
      cube: cube.includes("hs") ? `trade_i_baci_a_${cube.replace("hs", "")}` : "",
      drilldowns: `${dd[viztype]},Year`,
      measures: "Trade Value",
      parents: true,
      [type]: "sachl",
      Year: range(interval[0], interval[1]).join()
    };

    axios.get("https://api.oec.world/tesseract/data", {
      params
    }).then(resp => {
      const data = resp.data.data;
      this.setState({data});
    })

  };

  render() {
    const {routeParams} = this.props;
    const {data} = this.state;
    const {permalink} = this.state;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;
    const baseConfig = {
      data: data || [],
      groupBy: viztype === "all" ? ["Continent", "Country"] : ["Section", "HS4"]
    };

    if (chart === "tree_map")
      return <div className="vb-chart">
        <Treemap
          config={{
            ...baseConfig,
            sum: "Trade Value"
          }}
        />
      </div>;

    else if (chart === "stacked" && data && data.length > 0)
      return <div className="vb-chart">
        <StackedArea
          config={{
            ...baseConfig,
            y: "Trade Value",
            x: "Year",
            // time: "Year"
          }}
        />
      </div>;
    return <div />
  }
}

export default VbChart;
