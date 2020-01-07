import React from "react";
import {Plot} from "d3plus-react";
import {formatAbbreviate} from "d3plus-format";
import {timeFormat, timeParse} from "d3-time-format";

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
    const actualPoints = data.filter(d => d["Trade Value"]).map(d => ({...d, Title: `Observed Points (${d.Drilldown.name})`, color: d.Drilldown.color, shape: "Circle"}));
    // const actualLine = data.map(d => ({...d, Title: "Actual Line", shape: "Line"}));
    const predictionLine = data.map(d => ({...d, "Title": `Prediction Line (${d.Drilldown.name})`, "color": d.Drilldown.color, "shape": "Line", "Trade Value": d.yhat}));
    const combinedData = actualPoints.concat(predictionLine);

    return <div className="prediction-viz">
      {loading ? <div className="prediction-overlay prediction-loading">Loading...</div> : null}
      {error ? <div className="prediction-overlay prediction-error">Error... Please try another selection.</div> : null}
      <Plot config={{
        confidence: [
          d => d.yhat_lower || parseFloat(d["Trade Value"]),
          d => d.yhat_upper || parseFloat(d["Trade Value"])
        ],
        confidenceConfig: {
          fill: d => d.color,
          fillOpacity: d => d.shape === "Line" ? 0.25 : 1,
          strokeWidth: 0
        },
        data: combinedData,
        dataKey: updateKey,
        discrete: "x",
        groupBy: "Title",
        legend: false,
        height: 700,
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
        tooltipConfig: {
          title: d => d.Title,
          tbody: [
            [d => d.Time ? "Month" : "Year", d => d.Time ? timeFormat("%b %Y")(timeParse("%Y%m")(d.Time)) : d.Year],
            [d => d["Service Value"] ? "Service Value" : "Trade Value", d => d["Service Value"] ? `$${formatAbbreviate(d["Service Value"])}` : `$${formatAbbreviate(d["Trade Value"])}`]
          ]
        },
        total: null,
        y: d => parseFloat(d["Trade Value"]),
        yConfig: {
          barConfig: {
            stroke: "#15191F"
          },
          gridConfig: {
            stroke: "#15191F",
            strokeWidth: 1
          }
        },
        x: "ds",
        time: "ds",
        timeline: false,
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
