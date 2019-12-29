import React, {Fragment} from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";

import {fetchData} from "@datawheel/canon-core";
import axios from "axios";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import libs from "@datawheel/canon-cms/src/utils/libs";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import PredictionViz from "pages/Prediction/PredictionViz";
import "./Prediction.css";

import {Button, ButtonGroup, Collapse, Slider} from "@blueprintjs/core";

import SearchMultiSelect from "components/SearchMultiSelect";

class Prediction extends React.Component {
  state = {
    advControlIsOpen: false,
    scrolled: false,
    origins: [],
    destinations: [],
    products: [],
    predictionData: [],
    seasonalityMode: "multiplicative",
    changepointPriorScale: 0.05,
    changepointRange: 0.80,
    updateKey: null
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 5) {
      this.setState({scrolled: true});
    }
    else {
      this.setState({scrolled: false});
    }
  };

  updateSelection = stateKey => newItems => {
    // stateKey is the argument you passed to the function
    // newItems is the array returned
    this.setState({[stateKey]: newItems});
  };

  grabIds = item => item.id;

  buildPrediction = () => {
    const {origins, destinations, products, seasonalityMode, changepointPriorScale, changepointRange} = this.state;
    const originFilter = origins.length ? `&Exporter+Country=${origins.map(this.grabIds)}` : "";
    const destinationFilter = destinations.length ? `&Importer+Country=${destinations.map(this.grabIds)}` : "";
    const productFilter = products.length ? `&HS4=${products.map(this.grabIds)}` : "";
    const advControls = `&seasonality_mode=${seasonalityMode}&changepoint_prior_scale=${changepointPriorScale}&changepoint_range=${changepointRange}`;
    const apiUrl = `/api/predict?cube=trade_i_baci_a_92${originFilter}${destinationFilter}${productFilter}&drilldowns=Year&measures=Trade+Value${advControls}`;
    axios.get(apiUrl)
      .then(res => {
        console.log("DONE!", res.data);
        const updateKey = `sm-${seasonalityMode}-cps-${changepointPriorScale}-cr-${changepointRange}`;
        this.setState({updateKey, predictionData: res.data.data || []});
      });
  }

  toggleAdvControls = () => this.setState({advControlIsOpen: !this.state.advControlIsOpen});

  changeSeasonalityMode = newSeasonalityMode => _e => this.setState({seasonalityMode: newSeasonalityMode});

  changeChangepointPriorScale = newChangepointPriorScale => this.setState({changepointPriorScale: newChangepointPriorScale});

  changeChangepointRange = newChangepointRange => this.setState({changepointRange: newChangepointRange});

  render() {
    const {scrolled} = this.state;
    return <div className="prediction" onScroll={this.handleScroll}>
      <Navbar
        className={scrolled ? "background" : ""}
        title={scrolled ? "Predictions" : ""}
      />

      <div className="welcome">
        {/* spinning orb thing */}
        <div className="welcome-bg">
          <img className="welcome-bg-img" src="/images/stars.png" alt="" draggable="false" />
        </div>

        {/* entity selection form */}
        <div className="prediction-container-outer">
          <h1>Trade Predictions</h1>
          <div className="prediction-controls">
            <SearchMultiSelect
              updateSelection={this.updateSelection("origins")}
              itemType="Origin Country"
              items={[{name: "Angola", id: "afago"}, {name: "China", id: "aschn"}, {name: "Finland", id: "eufin"}, {name: "United States", id: "nausa"}]} />
            <SearchMultiSelect
              updateSelection={this.updateSelection("products")}
              itemType="Product"
              items={[{name: "Computers", id: 168471}, {name: "Yeast", id: 42102}]} />
            <SearchMultiSelect
              updateSelection={this.updateSelection("destinations")}
              itemType="Destination Country"
              items={[{name: "Angola", id: "afago"}, {name: "China", id: "aschn"}, {name: "Finland", id: "eufin"}, {name: "United States", id: "nausa"}]} />
            <Button rightIcon="arrow-right" intent="success" text="Go" minimal={true} onClick={this.buildPrediction} />
          </div>
          <div className="prediction-controls-advanced">
            <Button onClick={this.toggleAdvControls} icon={"settings"}>
              {this.state.advControlIsOpen ? "Hide" : "Show"} advanced controls
            </Button>
            <Collapse isOpen={this.state.advControlIsOpen}>
              <div className="prediction-controls">

                <div className="prediction-control">
                  <h3>Seasonality Mode</h3>
                  <ButtonGroup fill={true} style={{marginTop: 5}}>
                    <Button active={this.state.seasonalityMode === "additive"} text="Additive" onClick={this.changeSeasonalityMode("additive")} />
                    <Button active={this.state.seasonalityMode === "multiplicative"} text="Multiplicative" onClick={this.changeSeasonalityMode("multiplicative")} />
                  </ButtonGroup>
                </div>

                <div className="prediction-control slider-control">
                  <h3>Changepoint Prior Scale</h3>
                  <Slider
                    onChange={this.changeChangepointPriorScale}
                    className="changepoint-prior-scale"
                    leftIconName="bp3-icon-derive-column"
                    stepSize={0.001}
                    labelStepSize={0.025}
                    value={this.state.changepointPriorScale}
                    min={0.001}
                    max={0.2}
                  />
                </div>

                <div className="prediction-control slider-control">
                  <h3>Changepoint Range</h3>
                  <Slider
                    onChange={this.changeChangepointRange}
                    className="changepoint-range"
                    leftIconName="bp3-icon-derive-column"
                    stepSize={0.01}
                    labelStepSize={0.1}
                    labelRenderer={val => `${Math.round(val * 100)}%`}
                    value={this.state.changepointRange}
                    min={0.2}
                    max={1}
                  />
                </div>

              </div>
            </Collapse>
          </div>

          {/* prediction viz line chart */}
          <div className="prediction-viz-container">
            {this.state.predictionData.length
              ? <PredictionViz
                updateKey={this.state.updateKey}
                data={this.state.predictionData}
              />
              : null}
          </div>
        </div>

      </div>

      <Footer />
    </div>;
  }
}


Prediction.need = [
];

Prediction.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object
};


export default hot(withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale
  }))(Prediction)
));
