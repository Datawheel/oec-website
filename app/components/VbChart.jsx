import React from "react";
import {Treemap} from "d3plus-react";
import {Client, MondrianDataSource, TesseractDataSource} from "@datawheel/olap-client";

import "./VbChart.css";

class VbChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    Client.fromURL("https://api.oec.world/tesseract")
      .then(client => client.getCube("trade_i_baci_a_92").then(cube => {
        const query = cube.query;
        query
          .addMeasure("Trade Value")
          .addDrilldown("Section")
          .setOption("debug", false)
          .setOption("distinct", false)
          .setOption("nonempty", true);
        return client.execQuery(query);
      }))
      .then(aggregation => {
        console.log(aggregation);
      });
  }

  render() {
    return <div className="vb-chart">
      <Treemap
        config={{
          data: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Section&measures=Trade+Value&parents=false&sparse=false",
          sum: "Trade Value",
          groupBy: ["Section"]
        }}
        dataFormat={resp => resp.data}
      />
    </div>;
  }
}

export default VbChart;
