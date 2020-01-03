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
    const {data, error, loading, updateKey} = this.props;
    const actualPoints = data.filter(d => d["Trade Value"]).map(d => ({...d, Title: `Actual Points (${d.Drilldown.name})`, color: d.Drilldown.color, shape: "Circle"}));
    // const actualLine = data.map(d => ({...d, Title: "Actual Line", shape: "Line"}));
    const predictionLine = data.map(d => ({...d, "Title": `Prediction Line (${d.Drilldown.name})`, "color": d.Drilldown.color, "shape": "Line", "Trade Value": d.yhat}));
    const combinedData = actualPoints.concat(predictionLine);
    return <div className="prediction-viz">
      {loading ? <div className="prediction-overlay prediction-loading">Loading...</div> : null}
      {error ? <div className="prediction-overlay prediction-error">Error... Please try another selection.</div> : null}
      <Plot config={{
        data: combinedData,
        dataKey: updateKey,
        discrete: "x",
        groupBy: "Title",
        shape: d => d.shape,
        shapeConfig: {
          Circle: {
            fill: d => d.color,
            fillOpacity: 1
          },
          Line: {
            stroke: d => d.color
          }
        },
        confidence: [
          d => d.yhat_lower || d["Trade Value"],
          d => d.yhat_upper || d["Trade Value"]
        ],
        confidenceConfig: {
          fill: d => d.color,
          fillOpacity: d => d.shape === "Line" ? 0.25 : 1,
          strokeWidth: 0
        },
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
