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
import {toHS} from "helpers/funcs.js";
import colors from "helpers/colors";
import "./Prediction.css";

import {Button, ButtonGroup, Collapse, Slider} from "@blueprintjs/core";

import SearchMultiSelect from "components/SearchMultiSelect";

class Prediction extends React.Component {
  state = {
    advControlIsOpen: false,
    changepointPriorScale: 0.05,
    changepointRange: 0.80,
    currentDrilldown: null,
    destinations: [],
    loading: false,
    origins: [],
    predictionData: [],
    products: [],
    scrolled: false,
    seasonalityMode: "multiplicative",
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
    this.setState({loading: true});
    const {currentDrilldown, origins, destinations, products, seasonalityMode, changepointPriorScale, changepointRange} = this.state;
    let apiUrls = [];
    let drilldowns = [];
    const originFilter = origins.length ? `&Exporter+Country=${origins.map(this.grabIds)}` : "";
    const destinationFilter = destinations.length ? `&Importer+Country=${destinations.map(this.grabIds)}` : "";
    const productFilter = products.length ? `&HS4=${products.map(this.grabIds)}` : "";
    const advControls = `&seasonality_mode=${seasonalityMode}&changepoint_prior_scale=${changepointPriorScale}&changepoint_range=${changepointRange}`;
    if (!currentDrilldown) {
      drilldowns = [{name: "All", color: "red", id: "xx"}];
      apiUrls = [`/api/predict?cube=trade_i_baci_a_92${originFilter}${destinationFilter}${productFilter}&drilldowns=Year&measures=Trade+Value${advControls}`];
    }
    else if (currentDrilldown === "origins") {
      drilldowns = origins.slice();
      apiUrls = origins.map(origin => {
        const originCut = `&Exporter+Country=${origin.id}`;
        return `/api/predict?cube=trade_i_baci_a_92${originCut}${destinationFilter}${productFilter}&drilldowns=Year&measures=Trade+Value${advControls}`;
      });
    }
    else if (currentDrilldown === "products") {
      drilldowns = products.slice();
      apiUrls = products.map(product => {
        const productCut = `&HS4=${product.id}`;
        return `/api/predict?cube=trade_i_baci_a_92${originFilter}${destinationFilter}${productCut}&drilldowns=Year&measures=Trade+Value${advControls}`;
      });
    }
    else if (currentDrilldown === "destinations") {
      drilldowns = destinations.slice();
      apiUrls = destinations.map(destination => {
        const destinationCut = `&Importer+Country=${destination.id}`;
        return `/api/predict?cube=trade_i_baci_a_92${originFilter}${destinationCut}${productFilter}&drilldowns=Year&measures=Trade+Value${advControls}`;
      });
    }
    axios.all(apiUrls.map(url => axios.get(url)))
      .then(axios.spread((...responses) => {
        let allResults = [];
        responses.forEach((resp, i) => {
          allResults = allResults.concat(resp.data.data.map(d => ({...d, Drilldown: drilldowns[i]})));
        });
        const updateKey = `sm-${seasonalityMode}-cps-${changepointPriorScale}-cr-${changepointRange}`;
        this.setState({loading: false, updateKey, predictionData: allResults || []});
      }));
  }

  toggleAdvControls = () => this.setState({advControlIsOpen: !this.state.advControlIsOpen});

  changeSeasonalityMode = newSeasonalityMode => _e => this.setState({seasonalityMode: newSeasonalityMode});

  changeChangepointPriorScale = newChangepointPriorScale => this.setState({changepointPriorScale: newChangepointPriorScale});

  changeChangepointRange = newChangepointRange => this.setState({changepointRange: newChangepointRange});

  toggleDrilldown = selectorType => e => {
    this.setState({currentDrilldown: e.target.checked ? selectorType : null});
    console.log("xxx", selectorType, e.target.value, e.target.checked);
  }

  render() {
    const {countries, productsHs4} = this.props;
    const {currentDrilldown, loading, predictionData, scrolled, updateKey} = this.state;
    const countriesForDropdown = countries.data
      .map(d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}))
      .sort((a, b) => a.name.localeCompare(b.name));
    const productsForDropdown = productsHs4.data
      .map(d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}))
      .sort((a, b) => a.name.localeCompare(b.name));

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
              isDrilldown={currentDrilldown === "origins" ? true : false}
              itemType="Origin Country"
              items={countriesForDropdown}
              toggleDrilldown={this.toggleDrilldown("origins")} />
            <SearchMultiSelect
              updateSelection={this.updateSelection("products")}
              isDrilldown={currentDrilldown === "products" ? true : false}
              itemType="Product"
              items={productsForDropdown}
              toggleDrilldown={this.toggleDrilldown("products")} />
            <SearchMultiSelect
              updateSelection={this.updateSelection("destinations")}
              isDrilldown={currentDrilldown === "destinations" ? true : false}
              itemType="Destination Country"
              items={countriesForDropdown}
              toggleDrilldown={this.toggleDrilldown("destinations")} />
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
            {predictionData.length
              ? <PredictionViz
                data={predictionData}
                loading={loading}
                updateKey={updateKey}
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
  fetchData("countries", "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&time=year.latest&drilldowns=Exporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Exporter+Country+ISO+3"),
  fetchData("productsHs4", "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&time=year.latest&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false")
];

Prediction.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object
};


export default hot(withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    countries: state.data.countries,
    productsHs4: state.data.productsHs4
  }))(Prediction)
));
