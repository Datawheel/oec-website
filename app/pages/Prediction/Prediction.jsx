import React from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import axios from "axios";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import queryString from "query-string";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import SearchMultiSelect from "components/SearchMultiSelect";
import ToggleSelect from "components/ToggleSelect";
import PredictionViz from "pages/Prediction/PredictionViz";
import AdvParamPanel from "pages/Prediction/AdvParamPanel";
import PredictionTable from "pages/Prediction/PredictionTable";
import {DEFAULT_PREDICTION_COLOR, PREDICTION_DATASETS} from "helpers/consts";
import "./Prediction.css";
import {Alignment, AnchorButton, Button, Collapse, Icon, IconNames, Navbar, Tabs, Tab} from "@blueprintjs/core";

class Prediction extends React.Component {

  constructor(props) {
    super();
    const parsedQueryString = queryString.parse(props.router.location.search, {arrayFormat: "comma"});
    this.state = {
      activeTabId: null,
      advParams: [{
        changepointPriorScale: 0.05,
        changepointRange: 0.80,
        seasonalityMode: "multiplicative"
      }],
      currentDrilldown: null,
      dataset: parsedQueryString.dataset
        ? PREDICTION_DATASETS.find(d => d.slug === parsedQueryString.dataset) || PREDICTION_DATASETS[0]
        : PREDICTION_DATASETS[0],
      datasetSelections: [],
      datatableOpen: false,
      destinations: [],
      drilldowns: [],
      error: false,
      loading: true,
      origins: [],
      predictionData: [],
      products: [],
      scrolled: false,
      updateKey: null
    };
  }

  componentDidMount() {
    const {BASE} = this.props.env;
    // window.addEventListener("scroll", this.handleScroll);
    const {dataset} = this.state;
    const selectionApiUrls = dataset.selections.map(d => axios.get(`${BASE}.jsonrecords${d.dataUrl}`));
    const parsedQueryString = queryString.parse(this.props.router.location.search, {arrayFormat: "comma"});
    let drillDownFound = false;
    axios.all(selectionApiUrls)
      .then(axios.spread((...responses) => {

        // populate dropdowns
        responses.forEach((resp, i) => {
          const {data} = resp.data;
          const selectionId = dataset.selections[i].id;
          drillDownFound = parsedQueryString.drilldown === selectionId || drillDownFound;
          const thisSelectionQParams = parsedQueryString[selectionId];
          dataset.selections[i].data = data
            .map(dataset.selections[i].dataMap)
            .sort((a, b) => a.name.localeCompare(b.name));
          dataset.selections[i].data.forEach(d => {
            if (thisSelectionQParams && thisSelectionQParams.includes(`${d.id}`)) {
              dataset.selections[i].selected.push(d);
            }
          });
        });
        dataset.selectionsLoaded = true;

        // populate toggles from dropdown
        if (dataset.toggles) {
          dataset.toggles.forEach(toggle => {
            drillDownFound = parsedQueryString.drilldown === toggle.id || drillDownFound;
            toggle.data.forEach(d => {
              const thisToggleQParams = parsedQueryString[toggle.id];
              if (thisToggleQParams && thisToggleQParams.includes(`${d.id}`)) {
                toggle.selected = toggle.selected.find(ts => `${ts.id}` === `${d.id}`)
                  ? toggle.selected
                  : toggle.selected.concat([d]);
              }
            });
          });
        }
        // qSelections.forEach(qs => {
        //   const selectionSlug = qs[0];
        //   const selectionDataId = qs[1];
        //   const thisSelection = dataset.selections.find(s => s.id === selectionSlug);
        //   const x = thisSelection.data.find(d => d.id === selectionDataId);
        //   thisSelection.selected.push(x);
        // });

        const currentDrilldown = drillDownFound ? parsedQueryString.drilldown : null;
        this.setState({dataset, currentDrilldown}, this.buildPrediction);
      }));
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

  updateSelection = selectionId => newItems => {
    // selectionId is the argument you passed to the function
    // newItems is the array returned
    const {dataset} = this.state;
    let {advParams, currentDrilldown} = this.state;
    const {router} = this.context;
    const selectionMap = selection => {
      if (selection.id === selectionId) {
        selection.selected = newItems;
        // if deleting items and new selected array is empty
        // we need to turn off the drilldown toggle for this selection
        // and reset the advanced parameters
        if (selection.selected.length === 0 && selection.id === currentDrilldown) {
          currentDrilldown = null;
          advParams = [{
            changepointPriorScale: 0.05,
            changepointRange: 0.80,
            seasonalityMode: "multiplicative"
          }];
        }
      }
      return selection;
    };
    const datasetSelections = dataset.selections.map(selectionMap);
    dataset.selections = datasetSelections;
    if (dataset.toggles) {
      const datasetToggles = dataset.toggles.map(selectionMap);
      dataset.toggles = datasetToggles;
    }
    // set query params for this selection
    const queryArgs = queryString.parse(this.props.router.location.search, {arrayFormat: "comma"});
    queryArgs[selectionId] = newItems.map(d => d.id);
    const stringifiedQueryArgs = queryString.stringify(queryArgs, {arrayFormat: "comma"});
    router.replace(`/en/prediction/?${stringifiedQueryArgs}`);
    this.setState({advParams, currentDrilldown, dataset});
  };

  grabIds = item => item.id;

  buildPrediction = () => {
    this.setState({error: false, loading: true});
    const {currentDrilldown, dataset} = this.state;
    let myAdvParamStrings = [];
    const advParams = this.state.advParams && this.state.advParams.length
      ? this.state.advParams
      : [{
        changepointPriorScale: 0.05,
        changepointRange: 0.80,
        seasonalityMode: "multiplicative"
      }];
    const advParamStrings = advParams.map(advParam => `&seasonality_mode=${advParam.seasonalityMode}&changepoint_prior_scale=${advParam.changepointPriorScale}&changepoint_range=${advParam.changepointRange}`);
    const updateKey = advParams.map(advParam => `sm-${advParam.seasonalityMode}-cps-${advParam.changepointPriorScale}-cr-${advParam.changepointRange}`);
    // step 1: build api URLs
    const apiUrlRoot = `/api/predict?cube=${dataset.cube}&drilldowns=${dataset.dateDrilldown}&measures=Trade+Value`;
    let apiUrls = [apiUrlRoot];
    let drilldowns = [{name: "Aggregate", color: DEFAULT_PREDICTION_COLOR, id: "xx"}];
    // Are there any drilldowns?
    const drillSelection = dataset.toggles ? dataset.toggles.concat(dataset.selections).find(s => s.id === currentDrilldown) : dataset.selections.find(s => s.id === currentDrilldown);
    if (drillSelection) {
      apiUrls = [];
      drilldowns = drillSelection.selected.slice();
      myAdvParamStrings = advParams.length === drilldowns.length ? advParamStrings : drilldowns.map(() => `&seasonality_mode=${advParams[0].seasonalityMode}&changepoint_prior_scale=${advParams[0].changepointPriorScale}&changepoint_range=${advParams[0].changepointRange}`);
      // first get all non drilldown selections:
      let nonDrillSelections = dataset.selections.filter(s => s.id !== currentDrilldown);
      if (dataset.toggles) {
        nonDrillSelections = nonDrillSelections.concat(dataset.toggles.filter(s => s.id !== currentDrilldown));
      }
      let drillApiUrlBase = `${apiUrlRoot}`;
      nonDrillSelections.forEach(s => {
        if (s.selected.length) {
          drillApiUrlBase = `${drillApiUrlBase}&${s.dimName}=${s.selected.map(this.grabIds)}`;
        }
      });
      drillSelection.selected.forEach((s, i) => {
        apiUrls.push(`${drillApiUrlBase}&${drillSelection.dimName}=${s.id}${myAdvParamStrings[i]}`);
      });
    }
    else {
      let selectionCount = 0;
      let singlePotentialDrilldown = null;
      let totalTrade = true;
      const selectionsAndToggles = dataset.toggles ? dataset.selections.concat(dataset.toggles) : dataset.selections;
      selectionsAndToggles.forEach(selection => {
        if (selection.selected.length) {
          selectionCount += selection.selected.length;
          singlePotentialDrilldown = selection.selected[0];
          apiUrls[0] = `${apiUrls[0]}&${selection.dimName}=${selection.selected.map(this.grabIds)}`;
          totalTrade = false;
        }
      });
      if (selectionCount === 1) {
        drilldowns = [singlePotentialDrilldown];
      }
      else if (totalTrade) {
        drilldowns = [{name: "Total Trade", color: DEFAULT_PREDICTION_COLOR, id: "xxwld"}];
      }
      apiUrls[0] = `${apiUrls[0]}${advParamStrings[0]}`;
    }
    // console.log("apiUrls!", apiUrls);
    // Step 2: make XHR requests:
    axios.all(apiUrls.map(url => axios.get(url)))
      .then(axios.spread((...responses) => {
        let allResults = [];
        const errors = [];
        const newAdvParams = [];
        responses.forEach((resp, i) => {
          console.log("resp.data", resp.data);
          if (resp.data.error) {
            errors.push(resp.data);
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
        if (errors.length === apiUrls.length) {
          this.setState({activeTabId: drilldowns[0].id, drilldowns, loading: false, error: true});
        }
        else {
          this.setState({activeTabId: drilldowns[0].id, advParams: newAdvParams, drilldowns, loading: false, error: false, predictionData: allResults || [], updateKey: updateKey.join(",")});
        }
      }));
  }

  toggleAdvControls = () => this.setState({advControlIsOpen: !this.state.advControlIsOpen});

  toggleDrilldown = selectorType => e => {
    // first check if any items have been added:
    const {currentDrilldown, dataset} = this.state;
    const {router} = this.context;
    let newDrilldown = currentDrilldown;
    const drillSelection = dataset.toggles ? dataset.toggles.concat(dataset.selections).find(s => s.id === selectorType) : dataset.selections.find(s => s.id === selectorType);
    if (drillSelection.selected.length) {
      newDrilldown = e.target.checked ? selectorType : null;
    }
    this.setState({currentDrilldown: newDrilldown});
    // console.log("newDrilldown!!", newDrilldown);

    // set query params for this selection
    const queryArgs = queryString.parse(this.props.router.location.search, {arrayFormat: "comma"});
    queryArgs.drilldown = newDrilldown;
    if (newDrilldown === null) delete queryArgs.drilldown;
    const stringifiedQueryArgs = queryString.stringify(queryArgs, {arrayFormat: "comma"});
    router.replace(`/en/prediction/?${stringifiedQueryArgs}`);
  };

  handleControlTabChange = newTabId => this.setState({activeTabId: newTabId})

  toggleDatatable = () => this.setState({datatableOpen: !this.state.datatableOpen})

  updateAdvParams = index => newParams => {
    const {advParams} = this.state;
    advParams[index] = newParams;
    this.setState({advParams});
  }

  render() {
    const {activeTabId, currentDrilldown, dataset, datatableOpen,
      drilldowns, error, loading, predictionData, scrolled, updateKey} = this.state;

    return <div className="prediction" onScroll={this.handleScroll}>
      <OECNavbar
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

          <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
              <Navbar.Heading>
                <h1>Predictions</h1>
              </Navbar.Heading>
              <Navbar.Divider />
              {PREDICTION_DATASETS.map(dset =>
                <AnchorButton
                  href={`?dataset=${dset.slug}`}
                  key={dset.slug}
                  active={dataset.slug === dset.slug}
                  className="bp3-minimal"
                  text={dset.name} />
              )}
            </Navbar.Group>
          </Navbar>

          {/* prediction selection dropdowns */}
          {dataset.selectionsLoaded
            ? <div className="prediction-controls">
              {dataset.selections.map(selection =>
                <SearchMultiSelect
                  key={selection.id}
                  updateSelection={this.updateSelection(selection.id)}
                  initialItems={selection.selected}
                  isDrilldown={currentDrilldown === selection.id ? true : false}
                  itemType={selection.name}
                  items={selection.data}
                  toggleDrilldown={this.toggleDrilldown(selection.id)} />)
              }
              {dataset.toggles
                ? dataset.toggles.map(toggle =>
                  <ToggleSelect
                    key={toggle.id}
                    updateSelection={this.updateSelection(toggle.id)}
                    initialItems={toggle.selected}
                    isDrilldown={currentDrilldown === toggle.id ? true : false}
                    itemType={toggle.name}
                    items={toggle.data}
                    toggleDrilldown={this.toggleDrilldown(toggle.id)} />)
                : null}
              <Button className="build-prediction-btn" rightIcon="arrow-right" text="Build" minimal={true} onClick={this.buildPrediction} />
            </div>
            : null}

          {/* prediction viz line chart */}
          <div className="prediction-viz-container">
            <PredictionViz
              data={predictionData}
              error={error}
              loading={loading}
              updateKey={updateKey}
              currencyFormat={dataset.currencyFormat}
            />
          </div>

          {/* prediction advanced controls */}
          <div className="prediction-controls-container">
            {drilldowns.length
              ? <Tabs animate={true} id="ControlTabs" onChange={this.handleControlTabChange} selectedTabId={activeTabId} renderActiveTabPanelOnly={false}>
                {drilldowns.map((drill, index) => <Tab key={drill.id} id={drill.id} title={drill.name} panel={<AdvParamPanel updateAdvParams={this.updateAdvParams(index)} />} />)}
              </Tabs>
              : null}
          </div>

          {/* prediction data table */}
          <div className="prediction-datatable-container">
            <Button onClick={this.toggleDatatable} minimal={false} icon={"th"}>
              {datatableOpen ? "Hide" : "Show"} Data Table
            </Button>
            <Collapse isOpen={datatableOpen}>
              <PredictionTable
                data={predictionData}
                error={error}
                loading={loading}
                currencyFormat={dataset.currencyFormat}
              />
            </Collapse>
          </div>

          {/* prediction about text */}
          <div className="prediction-about-container">
            <h2>About OEC Trade Predictions</h2>
            <p>
              The predictions shown in this tool use a long short-term memory model or LSTM. The LSTM approach is a form of machine learning which utilizes a recurrent neural network. In the case of the predictions shown on this page we are using a data time series (based on the user selected dataset) as input for the model. The model is then able to learn order dependence and produce a sequence prediction.
            </p>
            <h2>How to use this tool</h2>
            <p>
              The first step to creating your custom prediction is to choose a dataset from the options above. We strive to include as many datasets from the OEC as possible in this tool but you will notice some are missing.
            </p>
            <div className="info-card">
              <div className="info-card-icon">
                <Icon icon="warning-sign" iconSize={40} />
              </div>
              <div className="info-card-text">
                <h3><a href="#">Why are some datasets missing?</a></h3>
                <p>The reason is that some datasets do not contain enough historical data to produce a meaningful prediction.</p>
              </div>
            </div>
            <p>
              The next step is to choose your selection. Any selection box that is left empty will be marginalized over and aggregated. For example, in the annual trade data, choosing an origin country and product without selecting a destination country will show a prediction of the total export amount of the chosen country in the chosen product. You will also notice a toggle underneath each selection box to switch between &ldquo;Aggregate&rdquo; and &ldquo;Drilldown&ldquo;. If multiple selections are chosen, choosing the aggregate option will sum all the values of these selections while choosing the drilldown option will maintain them as separate prediciton.
            </p>
            <h2>Visual Representation</h2>
            <p>
              Each prediction made using the selection boxes will be displayed using 3 distinct visual indicators in the chart that is produced. The dots will represent the actual observed values in the dataset. The line prepresents the prediction using the advanced parameters below. And finally the shaded region surrounding each line represents the upper and lower bound confidence estimates of the prediction.
            </p>
            <h2>Advanced Parameters</h2>
            <p>
              <strong>Seasonality Mode:</strong> By default the prediction fits additive seasonalities, meaning the effect of the seasonality is added to the trend to get the forecast. When the seasonality mode is set to multiplicative, seasonal effects will also be modeled as multiplicative. A good candidate for using a multiplicative seasonality mode predction would be a time series with a clear yearly cycle, in which the seasonality in the forecast is too large at the start and too small at the end.
            </p>
            <p>
              <strong>Changepoint Prior Scale:</strong> In general increasing this value will produce a more flexible model. By increasing the value of the changepoint prior scale, each changepoint in the trend will be allowed to change by a greater degree of freedom. Like many prediction parameters, if this value is too large you run the risk of over-fitting your model or trend changes, whereas if the changepoint prior scale is too small then the model may under-fit.
            </p>
            <p>
              <strong>Changepoint Range:</strong> This parameter determines how much of the observed (or historical) data will be used to make the prediction. By default this is set to 80%, meaning the model will use the first 80% of the time series to calculate the prediction.
            </p>
          </div>

        </div>

      </div>

      <Footer />
    </div>;
  }
}


Prediction.need = [
];

Prediction.contextTypes = {
  formatters: PropTypes.object,
  router: PropTypes.object
};


export default hot(withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    env: state.env
  }))(Prediction)
));
