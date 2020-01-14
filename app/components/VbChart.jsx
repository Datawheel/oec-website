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
      data: [],
      loading: true,
      routeParams: {}
    };
  }

  componentDidMount = () => {
    Client.fromURL("https://api.oec.world/tesseract")
      .then(client => client.getCube("trade_i_baci_a_92").then(cube => {
        const query = cube.query;
        query.addMeasure("Trade Value");
        return client.getMembers({level: "Exporter Country"});

      }))
      .then(data => {
        this.setState(
          {
            countryData: data.map(d => ({value: d.key, title: d.name})),
            routeParams: this.props.routeParams
          },
          () => this.fetchData()
        );
      });
  }

  shouldComponentUpdate = (prevProps, prevState) => prevProps.permalink !== this.props.permalink ||
    prevState.loading !== this.state.loading

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.permalink !== this.props.permalink) {
      console.log("ASDF");
      this.fetchData();
    }
  }

  fetchData = () => {
    const {routeParams} = this.props;
    const {countryData} = this.state;
    const {cube, chart, flow, country, partner, viztype, time} = routeParams;

    this.setState({data: [], loading: true});

    const countryId = countryData.filter(d => country.split(".").includes(d.value.slice(2, 5)));
    const partnerId = !["show", "all"].includes(partner)
      ? countryData.filter(d => partner.split(".").includes(d.value.slice(2, 5)))
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

    const dd = {
      show: isTechnology ? "Subclass" : "HS4",
      all: countryTypeBalance
    };

    const ddTech = ["Section", "Superclass", "Class", "Subclass"];

    const interval = time.split(".");
    if (interval.length === 1) interval.push(interval[0]);

    const params = {
      cube: !isTechnology
        ? `trade_i_baci_a_${cube.replace("hs", "")}`
        : "patents_i_uspto_w_cpc",
      drilldowns: `${dd[viztype] || countryTypeBalance},Year`,
      measures: isTechnology ? "Patent Share" : "Trade Value",
      parents: true,
      Year: ["tree_map", "geomap"].includes(chart)
        ? time.replace(".", ",")
        : range(interval[0], interval[1])
    };

    if (countryId) params[countryType] = countryId.map(d => d.value).join();
    if (partnerId) params[partnerType] = partnerId.map(d => d.value).join();
    if (isProduct) params.HS4 = viztype;
    if (isFilter && isTechnology) params[ddTech[viztype.length - 1]] = viztype;

    axios.get("https://api.oec.world/tesseract/data", {
      params
    }).then(resp => {
      const data = resp.data.data;
      this.setState({data, loading: false, routeParams: this.props.routeParams});
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
      groupBy: viztype === "all" || isFinite(viztype) || isFilter
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
