import React from "react";
import {Treemap} from "d3plus-react";
import {Client} from "@datawheel/olap-client";

import "./VbChart.css";

class VbChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    Client.fromURL("https://api.oec.world/tesseract")
      .then(client => client.getCube("trade_i_baci_a_92").then(cube => {
        const query = cube.query;

        query
          .addMeasure("Trade Value");

        ["Section"].forEach(d => {
          query.addDrilldown(d);
        });

        query.setOption("debug", false)
          .setOption("distinct", false)
          .setOption("nonempty", true);

        return client.execQuery(query);
      }))
      .then(data => {
        this.setState({data});
      });
  };

  render() {
    const {data} = this.state;

    return <div className="vb-chart">
      <Treemap
        config={{
          data: data.data || [],
          sum: "Trade Value",
          groupBy: ["Section"]
        }}
      />
    </div>;
  }
}

export default VbChart;
