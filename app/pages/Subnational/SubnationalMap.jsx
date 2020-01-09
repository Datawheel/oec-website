import React from "react";
import {hot} from "react-hot-loader/root";

import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {Geomap} from "d3plus-react";

import "./SubnationalMap.css";

class SubnationalMap extends React.Component {
  constructor(props) {
    super(props);
    this.dataFormat = this.dataFormat.bind(this);
    this.getGeoConfig = this.getGeoConfig.bind(this);
  }

  dataFormat(shapes) {
    return shapes;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  getGeoConfig() {
    const {items, country, level} = this.props;
    return {
      data: items,
      groupBy: "id",
      height: 500,
      legend: false,
      ocean: "transparent",
      total: false,
      on: {
        "click.shape": d => {
          if (d) {
            console.log("click.shape", d.properties);
          }
        }
      },
      projectionPadding: "0 0 0 0",
      shapeConfig: {
        Path: {
          fill: d => "#ff9900",
          stroke: "rgba(255, 255, 255, 1)"
        }
      },
      tiles: false,
      fit: true,
      topojson: `/shapes/subnational_${country}_${level}.topojson`,
      topojsonId: d => d.properties.id,
      topojsonKey: "objects",
      zoom: false
    };
  }

  render() {
    const {country, level} = this.props;

    const geoConfig = this.getGeoConfig();

    return <div className="subnational-map">
      <h4>Map here: {country} - {level}</h4>
      <Geomap
        className="splash-geomap"
        config={geoConfig}
        dataFormat={this.dataFormat}
      />
    </div>;
  }
}


SubnationalMap.need = [];

export default hot(withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale
  }))(SubnationalMap)
));
