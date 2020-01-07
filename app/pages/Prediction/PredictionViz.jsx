import React from "react";
import {Plot} from "d3plus-react";
import {formatAbbreviate} from "d3plus-format";
import {timeFormat, timeParse} from "d3-time-format";
import {Button} from "@blueprintjs/core";

class PredictionViz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      selectedItems: [],
      showObserved: true,
      showPrediction: true,
      showTrend: false
    };
  }

  toggleVizShowOptions = stateKey => () => this.setState({[stateKey]: !this.state[stateKey]})

  render() {
    const {data, error, loading, updateKey} = this.props;
    const {showObserved, showPrediction, showTrend} = this.state;
    const actualPoints = showObserved ? data.filter(d => d["Trade Value"]).map(d => ({...d, Title: `${d.Drilldown.name} (Observed)`, color: d.Drilldown.color, shape: "Circle"})) : [];
    const trendLine = showTrend ? data.map(d => ({...d, "Title": `${d.Drilldown.name} (Trend)`, "color": d.Drilldown.color, "shape": "Line", "Trade Value": d.trend, "yhat_upper": d.trend, "yhat_lower": d.trend})) : [];
    // const actualLine = data.map(d => ({...d, Title: "Actual Line", shape: "Line"}));
    const predictionLine = showPrediction ? data.map(d => ({...d, "Title": `${d.Drilldown.name} (Prediction)`, "color": d.Drilldown.color, "shape": "Line", "Trade Value": d.yhat})) : [];

    const combinedData = actualPoints.concat(predictionLine).concat(trendLine);
    // console.log("combinedData!", combinedData);

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
      <div className="prediction-viz-key">
        <Button
          active={showObserved}
          className="bp3-minimal"
          icon="scatter-plot"
          onClick={this.toggleVizShowOptions("showObserved")}
          text="Observed Data" />
        <Button
          active={showPrediction}
          className="bp3-minimal"
          icon="timeline-line-chart"
          onClick={this.toggleVizShowOptions("showPrediction")}
          text="Prediction" />
        <Button
          active={showTrend}
          className="bp3-minimal"
          icon="regression-chart"
          onClick={this.toggleVizShowOptions("showTrend")}
          text="Trend" />
      </div>
    </div>;
  }
}

export default PredictionViz;
