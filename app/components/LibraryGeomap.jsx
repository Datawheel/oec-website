import React, {Component} from 'react';
import {Geomap} from 'd3plus-react';


class LibraryGeomap extends Component {
  state = {}
  render() {
    const {classname, data, topojson, width, height, tooltipImgSource} = this.props;
    const {changeGeomapFilter} = this.props;
    return (
      <div className={`geomap ${classname}`}>
        {classname === 'region' && (
          console.log("data", data),
          <Geomap
            config={{
              data: data,
              groupBy: 'country_id',
              height: height,
              width: width,
              legend: false,
              total: false,
              tooltipConfig: {
                title: (d) => {
                  let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
                  tooltip += `<div class="icon" style="background-color: transparent"><img src=${tooltipImgSource ? tooltipImgSource : '/images/icons/country/country_ne.png'} /></div>`;
                  tooltip += `<div class="title"><span>${d.Region}</span></div>`;
                  tooltip += "</div>";
                  return tooltip;
                },
                tbody: [
                  ["Papers", d => d.Count],
                  ["Topics", d => d.Topics]
                ],
                footer: 'Click to filter table',
                width: "200px"
              },
              on: {
                'click.shape': (d) => {
                  if (!d.type) {
                    changeGeomapFilter(d.Region);
                  } else {
                    changeGeomapFilter(" ");
                  }
                }
              },
              shapeConfig: {
                Path: {
                  opacity: 1,
                  stroke: "#63737f",
                  strokeWidth: 1
                }
              },
              projection: 'geoMercator',
              ocean: 'transparent',
              topojson: topojson,
              topojsonFill: d => d.Region && "#ffffff",
              zoom: false
            }}
          />
        )}
        {classname === 'countries' && (
          <Geomap
            config={{
              data: data,
              groupBy: 'country_id',
              height: height,
              legend: false,
              total: false,
              colorScale: 'Count',
              colorScaleConfig: {
                color: ['#ffffcc', '#c2e699', '#78c679', '#238443'],
                scale: "jenks"
              },
              tooltipConfig: {
                title: (d) => {
                  let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
                  tooltip += `<div class="icon" style="background-color: transparent"><img src="/images/icons/country/country_${d.country_id}.png" /></div>`;
                  tooltip += `<div class="title"><span>${d.Country}</span></div>`;
                  tooltip += "</div>";
                  return tooltip;
                },
                tbody: [
                  ["Papers", d => d.Count],
                  ["Topics", d => d.Topics]
                ],
                footer: 'Click to filter table',
                width: "200px"
              },
              on: {
                'click.shape': (d) => {
                  if (!d.type) {
                    changeGeomapFilter(d.Country);
                  } else {
                    changeGeomapFilter(" ");
                  }
                }
              },
              shapeConfig: {
                Path: {
                  opacity: d => d.country_id ? 1 : 0.15,
                  stroke: "#63737f",
                  strokeWidth: 1
                }
              },
              ocean: 'transparent',
              topojson: topojson,
              topojsonId: d => d.id,
              topojsonFill: d => !d.country_id && "#ffffff",
              zoom: false
            }}
          />
        )}
      </div>
    );
  }
}

export default LibraryGeomap;
