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
import SelectMultiSection from "components/SelectMultiSection";
import TariffTable from "pages/Tariffs/TariffTable";
import {DEFAULT_PREDICTION_COLOR, TARIFF_DATASETS} from "helpers/consts";
import {Alignment, AnchorButton, Button, Collapse, Navbar, Tabs, Tab} from "@blueprintjs/core";
import "./Tariffs.css";

class Tariffs extends React.Component {

  constructor(props) {
    super();
    this.state = {
      scrolled: false,
      dataset: TARIFF_DATASETS[0],
      tariffData: []
    };
  }

  componentDidMount() {
    const {dataset} = this.state;
    const selectionApiUrls = dataset.selections.map(d => axios.get(d.dataUrl));
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

        const currentDrilldown = drillDownFound ? parsedQueryString.drilldown : null;
        this.setState({dataset, currentDrilldown}, this.buildPrediction);
      }));
  }

  updateSelection = selectionId => newItems => {
    // selectionId is the argument you passed to the function
    // newItems is the array returned
    const {dataset} = this.state;
    let {advParams, currentDrilldown} = this.state;
    const {router} = this.context;
    const datasetSelections = dataset.selections.map(selection => {
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
    });
    dataset.selections = datasetSelections;
    // set query params for this selection
    const queryArgs = queryString.parse(this.props.router.location.search, {arrayFormat: "comma"});
    queryArgs[selectionId] = newItems.map(d => d.id);
    const stringifiedQueryArgs = queryString.stringify(queryArgs, {arrayFormat: "comma"});
    router.replace(`/en/tariffs/?${stringifiedQueryArgs}`);
    this.setState({advParams, currentDrilldown, dataset});
  };

  buildPrediction = () => {
    this.setState({error: false, loading: true});
    const {dataset} = this.state;
    let apiUrls = [];
    const apiUrlRoot = "https://api.oec.world/tesseract/data.jsonrecords?cube=tariffs_i_wits_a_hs&measures=Ad+Valorem&parents=false&sparse=false";
    const selections = dataset.selections.filter(selection => selection.selected.length);
    const productSelection = selections.find(selection => selection.name === "Product");
    const nonProductSelections = selections.filter(selection => selection.name !== "Product");
    const nonProductdrilldowns = nonProductSelections.map(selection => selection.dimName);
    const nonProductcuts = nonProductSelections.map(selection => `${selection.dimName}=${selection.selected.map(d => d.id)}`);
    if (productSelection) {
      const prodDrilldowns = [...new Set(productSelection.selected.map(d => d.type))];
      console.log("prodDrilldowns!", prodDrilldowns);
      apiUrls = prodDrilldowns.map(drill => {
        const prodIds = productSelection.selected.filter(d => d.type === drill).map(d => d.id);
        return `${apiUrlRoot}&drilldowns=Year,Measure,${nonProductdrilldowns},${drill}&${nonProductcuts.join("&")}&${drill}=${prodIds}`;
      });
      console.log("apiUrls!", apiUrls);
    }
    else {
      return;
    }

    axios.all(apiUrls.map(url => axios.get(url)))
      .then(axios.spread((...responses) => {
        let allResults = [];
        const errors = [];
        const newAdvParams = [];
        responses.forEach((resp, i) => {
          // console.log("resp.data", resp.data);
          if (resp.data.error) {
            errors.push(resp.data);
          }
          else {
            allResults = allResults.concat(resp.data.data);
          }
        });
        if (errors.length === apiUrls.length) {
          this.setState({loading: false, error: true});
        }
        else {
          this.setState({loading: false, error: false, tariffData: allResults || []});
        }
        console.log("allResults", allResults);
      }));
  }

  render() {
    const {dataset, error, loading, scrolled, tariffData} = this.state;

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
                <h1>Tariffs Explorer</h1>
              </Navbar.Heading>
            </Navbar.Group>
          </Navbar>

          {/* prediction selection dropdowns */}
          <div className="prediction-controls">
            {dataset.selectionsLoaded
              ? dataset.selections.slice(0, 2).map(selection =>
                <SearchMultiSelect
                  key={selection.id}
                  updateSelection={this.updateSelection(selection.id)}
                  initialItems={selection.selected}
                  isDrilldown={null}
                  itemType={selection.name}
                  items={selection.data} />)
              : null}
            <div className="prediction-control">
              <h3>Select a Product...</h3>
              <SelectMultiSection
                items={dataset.selections[2].data}
                onItemSelect={item => {
                  // item: SelectedItem
                  // make sure they're uniuqe!
                  const nextItems = dataset.selections[2].selected.concat([item]).filter((thisItem, index, self) =>
                    index === self.findIndex(t =>
                      t.id === thisItem.id
                    )
                  );
                  // const nextItems = dataset.selections[2].selected.concat([item]);
                  this.updateSelection(dataset.selections[2].id)(nextItems);
                }}
                onItemRemove={(evt, item) => {
                  // evt: MouseEvent<HTMLButtonElement>
                  // item: SelectedItem
                  evt.stopPropagation();
                  const nextItems = dataset.selections[2].selected.filter(i => i !== item);
                  this.updateSelection(dataset.selections[2].id)(nextItems);
                }}
                onClear={() => {
                  this.updateSelection(dataset.selections[2].id)([]);
                }}
                selectedItems={dataset.selections[2].selected}
              />
            </div>
            <Button className="build-prediction-btn" rightIcon="arrow-right" text="Build" minimal={true} onClick={this.buildPrediction} />
          </div>

          {/* tariffs data table */}
          <div className="tariffs-datatable-container">
            {tariffData.length
              ? <TariffTable
                data={tariffData}
                error={error}
                loading={loading}
                currencyFormat={dataset.currencyFormat}
              /> : null }
          </div>

        </div> {/* /end prediction-container-outer */}

      </div> {/* /end welcome */}

    </div>;

  }
}

Tariffs.need = [
];

Tariffs.contextTypes = {
  formatters: PropTypes.object,
  router: PropTypes.object
};


export default hot(withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale
  }))(Tariffs)
));
