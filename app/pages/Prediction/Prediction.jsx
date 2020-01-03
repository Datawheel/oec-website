import React from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";

import {fetchData} from "@datawheel/canon-core";
import axios from "axios";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import Navbar from "components/Navbar";
import Footer from "components/Footer";
import PredictionViz from "pages/Prediction/PredictionViz";
import AdvParamPanel from "pages/Prediction/AdvParamPanel";
import {toHS} from "helpers/funcs.js";
import colors from "helpers/colors";
import "./Prediction.css";

import {Button, Tabs, Tab} from "@blueprintjs/core";

import SearchMultiSelect from "components/SearchMultiSelect";

class Prediction extends React.Component {
  state = {
    activeTabId: null,
    advParams: [{
      changepointPriorScale: 0.05,
      changepointRange: 0.80,
      seasonalityMode: "multiplicative"
    }],
    currentDrilldown: null,
    destinations: [],
    drilldowns: [],
    error: false,
    loading: false,
    origins: [],
    predictionData: [],
    products: [],
    scrolled: false,
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
    this.setState({error: false, loading: true});
    const {advParams, currentDrilldown, origins, destinations, products} = this.state;
    let apiUrls = [];
    let drilldowns = [];
    let myAdvParamStrings = [];
    const originFilter = origins.length ? `&Exporter+Country=${origins.map(this.grabIds)}` : "";
    const destinationFilter = destinations.length ? `&Importer+Country=${destinations.map(this.grabIds)}` : "";
    const productFilter = products.length ? `&HS4=${products.map(this.grabIds)}` : "";
    const advParamStrings = advParams.map(advParam => `&seasonality_mode=${advParam.seasonalityMode}&changepoint_prior_scale=${advParam.changepointPriorScale}&changepoint_range=${advParam.changepointRange}`);
    const updateKey = advParams.map(advParam => `sm-${advParam.seasonalityMode}-cps-${advParam.changepointPriorScale}-cr-${advParam.changepointRange}`);
    if (!currentDrilldown) {
      drilldowns = [{name: "Aggregate", color: "red", id: "xx"}];
      apiUrls = [`/api/predict?cube=trade_i_baci_a_92${originFilter}${destinationFilter}${productFilter}&drilldowns=Year&measures=Trade+Value${advParamStrings[0]}`];
    }
    else if (currentDrilldown === "origins") {
      drilldowns = origins.slice();
      myAdvParamStrings = advParams.length === drilldowns.length ? advParamStrings : drilldowns.map(() => `&seasonality_mode=${advParams[0].seasonalityMode}&changepoint_prior_scale=${advParams[0].changepointPriorScale}&changepoint_range=${advParams[0].changepointRange}`);
      apiUrls = origins.map((origin, i) => {
        const originCut = `&Exporter+Country=${origin.id}`;
        return `/api/predict?cube=trade_i_baci_a_92${originCut}${destinationFilter}${productFilter}&drilldowns=Year&measures=Trade+Value${myAdvParamStrings[i]}`;
      });
    }
    else if (currentDrilldown === "products") {
      drilldowns = products.slice();
      myAdvParamStrings = advParams.length === drilldowns.length ? advParamStrings : drilldowns.map(() => `&seasonality_mode=${advParams[0].seasonalityMode}&changepoint_prior_scale=${advParams[0].changepointPriorScale}&changepoint_range=${advParams[0].changepointRange}`);
      apiUrls = products.map((product, i) => {
        const productCut = `&HS4=${product.id}`;
        return `/api/predict?cube=trade_i_baci_a_92${originFilter}${destinationFilter}${productCut}&drilldowns=Year&measures=Trade+Value${myAdvParamStrings[i]}`;
      });
    }
    else if (currentDrilldown === "destinations") {
      drilldowns = destinations.slice();
      myAdvParamStrings = advParams.length === drilldowns.length ? advParamStrings : drilldowns.map(() => `&seasonality_mode=${advParams[0].seasonalityMode}&changepoint_prior_scale=${advParams[0].changepointPriorScale}&changepoint_range=${advParams[0].changepointRange}`);
      apiUrls = destinations.map((destination, i) => {
        const destinationCut = `&Importer+Country=${destination.id}`;
        return `/api/predict?cube=trade_i_baci_a_92${originFilter}${destinationCut}${productFilter}&drilldowns=Year&measures=Trade+Value${myAdvParamStrings[i]}`;
      });
    }
    console.log("apiUrls!!!", apiUrls);
    axios.all(apiUrls.map(url => axios.get(url)))
      .then(axios.spread((...responses) => {
        let allResults = [];
        let error = false;
        const newAdvParams = [];
        responses.forEach((resp, i) => {
          console.log("resp.data", resp.data);
          if (resp.data.error) {
            error = true;
          }
          else {
            allResults = allResults.concat(resp.data.data.map(d => ({...d, Drilldown: drilldowns[i]})));
            newAdvParams.push({
              changepointPriorScale: parseFloat(resp.data.params.changepoint_prior_scale),
              changepointRange: parseFloat(resp.data.params.changepoint_range),
              seasonalityMode: resp.data.params.seasonality_mode
            });
          }
        });
        if (error) {
          this.setState({activeTabId: drilldowns[0].id, drilldowns, loading: false, error: true});
        }
        else {
          this.setState({activeTabId: drilldowns[0].id, advParams: newAdvParams, drilldowns, loading: false, error: false, predictionData: allResults || [], updateKey: updateKey.join(",")});
        }
      }));
  }

  toggleAdvControls = () => this.setState({advControlIsOpen: !this.state.advControlIsOpen});

  toggleDrilldown = selectorType => e => this.setState({currentDrilldown: e.target.checked ? selectorType : null});

  handleControlTabChange = newTabId => this.setState({activeTabId: newTabId})

  updateAdvParams = index => newParams => {
    const {advParams} = this.state;
    advParams[index] = newParams;
    console.log("advParams!!!", advParams);
    this.setState({advParams});
  }

  render() {
    const {countries, productsHs4} = this.props;
    const {activeTabId, currentDrilldown, drilldowns, error, loading, predictionData, scrolled, updateKey} = this.state;
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

          {/* prediction viz line chart */}
          <div className="prediction-viz-container">
            {predictionData.length
              ? <PredictionViz
                data={predictionData}
                error={error}
                loading={loading}
                updateKey={updateKey}
              />
              : null}
          </div>

          {/* prediction advanced controls */}
          <div className="prediction-controls-container">
            {drilldowns.length
              ? <Tabs animate={true} id="ControlTabs" onChange={this.handleControlTabChange} selectedTabId={activeTabId} renderActiveTabPanelOnly={false}>
                {drilldowns.map((drill, index) => <Tab key={drill.id} id={drill.id} title={drill.name} panel={<AdvParamPanel updateAdvParams={this.updateAdvParams(index)} />} />)}
              </Tabs>
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
