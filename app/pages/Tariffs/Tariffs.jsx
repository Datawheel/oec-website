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
import {TARIFF_DATASETS} from "helpers/consts";
import {Alignment, AnchorButton, Button, ButtonGroup, Navbar} from "@blueprintjs/core";
import "./Tariffs.css";

class Tariffs extends React.Component {

  constructor(props) {
    super();
    const parsedQueryString = queryString.parse(props.router.location.search, {arrayFormat: "comma"});
    this.state = {
      scrolled: false,
      dataset: TARIFF_DATASETS[0],
      drilldownx: parsedQueryString.drilldown && ["country", "hs2", "hs4", "hs6"].indexOf(parsedQueryString.drilldown) > -1
        ? parsedQueryString.selection_type === "country"
          ? "Reporter+Country"
          : parsedQueryString.drilldown
        : "hs4",
      drilldown: parsedQueryString.drilldown && ["country", "hs2", "hs4", "hs6"].indexOf(parsedQueryString.drilldown) > -1
        ? parsedQueryString.drilldown
        : parsedQueryString.selection_type === "product"
          ? "Reporter+Country"
          : "hs4",
      selectionType: parsedQueryString.selection_type && ["reporter", "product"].indexOf(parsedQueryString.selection_type) > -1
        ? parsedQueryString.selection_type
        : "reporter",
      tariffData: []
    };
  }

  // On mount of component asynchronously fetch both countries and products to show
  // in dropdown selections.
  componentDidMount() {
    const {dataset} = this.state;

    // Parse query string to determine if there are pre-defined selections
    const parsedQueryString = queryString.parse(this.props.router.location.search, {arrayFormat: "comma"});

    // API requests for dropdown content (ie Countries + Products)
    const selectionApiUrls = dataset.selections.map(d => axios.get(d.dataUrl));
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
              if (selectionId === "products") {
                const enrichedProduct = {...d,
                  icon: `/images/icons/hs/hs_${d["Section ID"]}.png`,
                  type: ["HS6", "HS4", "HS2", "Section"].find(dd => dd in d),
                  searchIndex: `${d.id}|${d.name}`
                };
                dataset.selections[i].selected.push(enrichedProduct);
              }
              else {
                dataset.selections[i].selected.push(d);
              }
              console.log("selectionId!", selectionId, dataset.selections[i].selected);
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
    let {drilldown} = this.state;
    const {router} = this.context;
    const datasetSelections = dataset.selections.map(selection => {
      if (selection.id === selectionId) {
        selection.selected = newItems;
        // if deleting items and new selected array is empty
        // we need to turn off the drilldown toggle for this selection
        // and reset the advanced parameters
        if (selection.selected.length === 0 && selection.id === drilldown) {
          drilldown = null;
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
    this.setState({drilldown, dataset});
  };

  buildPrediction = () => {
    this.setState({error: false, loading: true});
    const {dataset, drilldown, selectionType} = this.state;
    let apiUrls = [];
    const apiUrlRoot = "https://api.oec.world/tesseract/data.jsonrecords?cube=tariffs_i_wits_a_hs&measures=Ad+Valorem&parents=false&sparse=false";
    const selections = dataset.selections.filter(selection => selection.selected.length);
    const productSelection = selections.find(selection => selection.name === "Product");
    const nonProductSelections = selections.filter(selection => selection.name !== "Product");
    const nonProductdrilldowns = nonProductSelections.map(selection => selection.dimName);
    const nonProductCuts = nonProductSelections.map(selection => `${selection.dimName}=${selection.selected.map(d => d.id)}`);
    if (selectionType === "product") {
      if (productSelection) {
        const prodDrilldowns = [...new Set(productSelection.selected.map(d => d.type))];
        apiUrls = prodDrilldowns.map(productLevelDrill => {
          const prodIds = productSelection.selected.filter(d => d.type === productLevelDrill).map(d => d.id);
          return `${apiUrlRoot}&drilldowns=Year,Measure,${nonProductdrilldowns},${drilldown},${productLevelDrill}&${nonProductCuts.join("&")}&${productLevelDrill}=${prodIds}`;
        });
      }
      else {
        apiUrls = [`${apiUrlRoot}&drilldowns=Year,Measure,${nonProductdrilldowns},${drilldown}&${nonProductCuts.join("&")}`];
      }
    }
    else {
      apiUrls = [`${apiUrlRoot}&drilldowns=Year,Measure,${nonProductdrilldowns},${drilldown.toUpperCase()}&${nonProductCuts.join("&")}`];
    }
    console.log("apiUrls!", apiUrls);
    // return;

    axios.all(apiUrls.map(url => axios.get(url)))
      .then(axios.spread((...responses) => {
        let allResults = [];
        const errors = [];
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
      }));
  }

  setDrilldown = drilldown => e => {
    const {router} = this.context;
    this.setState({drilldown});

    // set query params for this selection
    const queryArgs = queryString.parse(this.props.router.location.search, {arrayFormat: "comma"});
    queryArgs.drilldown = drilldown;
    const stringifiedQueryArgs = queryString.stringify(queryArgs, {arrayFormat: "comma"});
    router.replace(`/en/tariffs/?${stringifiedQueryArgs}`);
  };

  render() {
    const {dataset, drilldown, error, loading, scrolled, selectionType, tariffData} = this.state;

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
              <Navbar.Divider />
              <AnchorButton
                href={"?selection_type=reporter"}
                key="by-country"
                active={selectionType === "reporter"}
                className="bp3-minimal"
                text={"by Country"} />
              <AnchorButton
                href={"?selection_type=product"}
                key="by-product"
                active={selectionType === "product"}
                className="bp3-minimal"
                text={"by Product"} />
            </Navbar.Group>
          </Navbar>

          {/* prediction selection dropdowns */}
          <div className="prediction-controls">
            {dataset.selectionsLoaded
              ? dataset.selections.slice(0, 2).map(selection =>
                <SearchMultiSelect
                  disabled={selectionType === "product"}
                  key={selection.id}
                  updateSelection={this.updateSelection(selection.id)}
                  initialItems={selection.selected}
                  isDrilldown={null}
                  itemType={selection.name}
                  items={selection.data} />)
              : null}
            <div className="prediction-control">
              <h3>Product</h3>
              {selectionType === "product"
                ? <SelectMultiSection
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
                    console.log("nextItems!!!", nextItems);
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
                : <ButtonGroup minimal={false}>
                  <Button onClick={this.setDrilldown("hs2")} icon="more" active={drilldown === "hs2"}>All HS2</Button>
                  <Button onClick={this.setDrilldown("hs4")} icon="layout-sorted-clusters" active={drilldown === "hs4"}>All HS4</Button>
                  <Button onClick={this.setDrilldown("hs6")} icon="layout-skew-grid" active={drilldown === "hs6"}>All HS6</Button>
                </ButtonGroup>}
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

      <Footer />
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
