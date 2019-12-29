import React from "react";
import {Plot} from "d3plus-react";
import {formatAbbreviate} from "d3plus-format";

class PredictionViz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      selectedItems: []
    };
  }

  render() {
    const {data} = this.props;
    const actualPoints = data.filter(d => d["Trade Value"]).map(d => ({...d, Title: "Actual Points", shape: "Circle"}));
    // const actualLine = data.map(d => ({...d, Title: "Actual Line", shape: "Line"}));
    const predictionLine = data.map(d => ({...d, "Title": "Prediction Line", "shape": "Line", "Trade Value": d.yhat}));
    const combinedData = actualPoints.concat(predictionLine);
    return <div className="prediction-viz">
      <Plot config={{
        confidence: [
          d => d.yhat_lower || d["Trade Value"],
          d => d.yhat_upper || d["Trade Value"]
        ],
        data: combinedData,
        dataKey: this.props.updateKey,
        discrete: "x",
        groupBy: "Title",
        shape: d => d.shape,
        tooltipConfig: {
          title: d => d.Title,
          tbody: [
            ["Year", d => d.Year],
            [d => d["Service Value"] ? "Service Value" : "Trade Value", d => d["Service Value"] ? `$${formatAbbreviate(d["Service Value"])}` : `$${formatAbbreviate(d["Trade Value"])}`]
          ]
        },
        total: null,
        y: "Trade Value",
        yConfig: {
          barConfig: {
            stroke: "#15191F"
          },
          gridConfig: {
            stroke: "#15191F",
            strokeWidth: 1
          }
        },
        x: "Year",
        xConfig: {
          barConfig: {
            stroke: "#15191F"
          },
          gridConfig: {
            stroke: "#15191F",
            strokeWidth: 1
          }
        }
      }} />
    </div>;
  }
}

export default PredictionViz;
