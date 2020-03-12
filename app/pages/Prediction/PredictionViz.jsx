import React from "react";
import {Plot} from "d3plus-react";
import {formatAbbreviate} from "d3plus-format";
import {timeFormat, timeParse} from "d3-time-format";
import {Button} from "@blueprintjs/core";
import {colorLighter} from "d3plus-color";

const getUniqColor = (color, id, colorsLookup) => {
  if (Object.values(colorsLookup).includes(color)) {
    color = colorLighter(color, 0.2);
    color = getUniqColor(color, id, colorsLookup);
  }
  else {
    colorsLookup[id] = color;
  }
};

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
    const {data, drilldownSelections, currencyFormat, error, loading, updateKey} = this.props;
    const {showObserved, showPrediction, showTrend} = this.state;

    // need to figure out if there are color overlaps!
    const colorsLookup = {};
    if (drilldownSelections) {
      drilldownSelections.forEach(d => {
        getUniqColor(d.color, d.id, colorsLookup);
      });
      console.log("colorsLookup!!!!", colorsLookup);
    }

    const actualPoints = showObserved
      ? data.filter(d => d["Trade Value"]).map(d => ({...d, Title: `${d.Drilldown.name} (Observed)`, color: colorsLookup[d.Drilldown.id] || d.Drilldown.color, shape: "Circle"}))
      : [];
    const trendLine = showTrend
      ? data.map(d => ({...d, "Title": `${d.Drilldown.name} (Trend)`, "color": colorsLookup[d.Drilldown.id] || d.Drilldown.color, "shape": "Line", "Trade Value": d.trend, "yhat_upper": d.trend, "yhat_lower": d.trend}))
      : [];
    const predictionLine = showPrediction
      ? data.map(d => ({...d, "Title": `${d.Drilldown.name} (Predicted)`, "color": colorsLookup[d.Drilldown.id] || d.Drilldown.color, "shape": "Line", "Trade Value": d.yhat}))
      : [];

    const combinedData = actualPoints.concat(predictionLine).concat(trendLine);
    console.log("drilldownSelections!", drilldownSelections);

    return <div className="prediction-viz">
      {loading ? <div className="prediction-overlay prediction-loading">Loading...</div> : null}
      {error ? <div className="prediction-overlay prediction-error">Error... Please try another selection.</div> : null}
      {!loading && combinedData.length
        ? <Plot config={{
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
          legend: true,
          legendConfig: {
            shapeConfig: {
              backgroundImage: false,
              labelConfig: {
                fontSize: () => 16,
                fontColor: () => "#CFDAE2"
              },
              fontColor: () => "#CFDAE2"
            },
            label: d => d.Drilldown.name
          },
          legendSort: (a, b) => {
            const aItem = a.Drilldown ? `${a.Drilldown.id}` : "";
            const bItem = b.Drilldown ? `${b.Drilldown.id}` : "";
            console.log(aItem, bItem);
            return aItem.localeCompare(bItem, "en", {sensitivity: "base"});
          },
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
              stroke: d => d.id === 0 ? "#919ca4" : "#15191F",
              strokeWidth: 1
            },
            shapeConfig: {
              labelConfig: {
                fontSize: () => 17
              }
            },
            tickFormat: currencyFormat
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
            },
            shapeConfig: {
              labelConfig: {
                fontSize: () => 17
              }
            }
          }
        }} />
        : null}
      {!loading && combinedData.length
        ? <div className="prediction-viz-key">
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
        : null}
    </div>;
  }
}

export default PredictionViz;
