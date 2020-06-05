import React, {Component} from 'react';
import {Geomap, Plot} from "d3plus-react";
import {formatAbbreviate} from 'd3plus-format';

class ECIgraphs extends Component {
  state = {}
  render() {
    const {graphData, gdpData, year} = this.props;
    const colorScaleColors = ['#e2ebf3', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];

    // Calculate min and max values for ECI value
    const uniqueECI = [...new Set(gdpData.map(m => m.ECI))];
    const maxECI = Math.max(...uniqueECI);
    const minECI = Math.min(...uniqueECI);

    // Calculate min and max values for GDP value
    const uniqueGDP = [...new Set(gdpData.map(m => m.GDP))];
    const maxGDP = Math.max(...uniqueGDP);
    const minGDP = Math.min(...uniqueGDP);

    return (
      <div className="graphs">
        <div className="graph">
          <Geomap
            config={{
              data: graphData,
              groupBy: "Country ID",
              height: 500,
              legend: false,
              total: false,
              colorScale: "ECI",
              colorScaleConfig: {
                color: colorScaleColors,
                labelMin: "ECI",
                labelConfig: {
                  fontSize: 14,
                  fontColor: "#FFFFFF",
                  midpoint: 0
                }
              },
              tooltipConfig: {
                title: d => {
                  let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
                  tooltip += `<div class="icon" style="background-color: transparent"><img src="/images/icons/country/country_${d["Country ID"]}.png" /></div>`;
                  tooltip += `<div class="title"><span>${d.Country}</span></div>`;
                  tooltip += "</div>";
                  return tooltip;
                },
                tbody: [
                  ["Country ID", d => d["Country ID"].toUpperCase()],
                  ["Economic Complexity Ranking (ECI)", d => formatAbbreviate(d["ECI"])],
                  ["ECI Rank", d => d["ECI Rank"]],
                  ["Year", d => d["Year"]]
                ],
                width: "200px"
              },
              shapeConfig: {
                Path: {
                  opacity: d => d["Country ID"] ? 1 : 0.15,
                  stroke: "#63737f",
                  strokeWidth: 1
                }
              },
              ocean: "transparent",
              topojson: "/topojson/world-50m.json",
              topojsonId: d => d.id,
              topojsonFill: d => !d["Country ID"] && "#ffffff",
              zoom: false
            }}
          />
        </div>
        <div className="graph">
          <Plot
            config={{
              data: gdpData,
              groupBy: ["Continent ID", "Country ID"],
              height: 500,
              title: `Economic Complexity Index (ECI) vs GDP per capita, PPP (constant 2011 international $) (${year})`,
              titleConfig: {
                fontSize: 14,
                textAnchor: "middle"
              },
              size: "Trade Value",
              sizeMin: 12,
              sizeMax: 14,
              legend: false,
              total: false,
              shapeConfig: {
                Circle: {
                  backgroundImage: d => `/images/icons/country/country_${d["Country ID"]}_circle.png`,
                  label: ""
                }
              },
              tooltipConfig: {
                title: d => {
                  let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
                  tooltip += `<div class="icon" style="background-color: transparent"><img src="/images/icons/country/country_${d["Country ID"]}.png" /></div>`;
                  tooltip += `<div class="title"><span>${d.Country}</span></div>`;
                  tooltip += "</div>";
                  return tooltip;
                },
                tbody: [
                  ["Country ID", d => d["Country ID"].toUpperCase()],
                  ["Trade Value", d => `$${formatAbbreviate(d["Trade Value"])}`],
                  ["GDP per capita, PPP (constant 2011 international $)", d => formatAbbreviate(d["GDP"])],
                  ["Economic Complexity Ranking (ECI)", d => formatAbbreviate(d["ECI"])],
                  ["ECI Rank", d => d["ECI Rank"]],
                  ["Year", d => d["Year"]]
                ],
                width: "200px"
              },
              x: "ECI",
              y: "GDP",
              xConfig: {
                domain: [minECI * 1.1, maxECI * 1.1],
                scale: "linear",
                title: `Economic Complexity Index (ECI)`,
                titleConfig: {
                  fontSize: 14,
                  textAnchor: "middle"
                }
              },
              yConfig: {
                domain: [minGDP * 0.8, maxGDP * 1.2],
                scale: "log",
                title: `GDP per capita, PPP (constant 2011 international $)`,
                titleConfig: {
                  fontSize: 14,
                  textAnchor: "middle"
                }
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default ECIgraphs;
