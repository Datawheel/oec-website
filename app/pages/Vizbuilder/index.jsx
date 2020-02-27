import React from "react";
import axios from "axios";
import {withNamespaces} from "react-i18next";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {connect} from "react-redux";
import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";

import VbTabs from "components/VbTabs";
import VbChart from "components/VbChart";
import VirtualSelector from "components/VirtualSelector";
import OECMultiSelect from "components/OECMultiSelect";
import VbTitle from "components/VbTitle";
import colors from "helpers/colors";
import OECMultiSelectV2 from "components/OECMultiSelectV2";
import SelectMultiSection from "components/SelectMultiSection";

import "./Vizbuilder.css";

const datasets = [
  {value: "hs92", title: "HS92"},
  {value: "hs96", title: "HS96"},
  {value: "hs02", title: "HS02"},
  {value: "hs07", title: "HS07"},
  {value: "sitc", title: "SITC"},
  {value: "cpc", title: "Technology"}
];

const flow = [
  {value: "export", title: "Exports"},
  {value: "import", title: "Imports"}
];

const years = [...Array(56).keys()].map(d => ({value: 2019 - d, title: 2019 - d}));

/** */
function createItems(data, levels, iconUrl) {
  return data.reduce((obj, d) => {
    levels.forEach(type => {
      const id = d[`${type} ID`];
      if (!(id in obj)) {
        const sId = d["Section ID"];
        obj[id] = {
          color: colors.Section[sId],
          icon: `${iconUrl}${sId}.png`,
          id,
          name: d[type],
          type
        };
      }
    });
    return obj;
  }, {});
}

class Vizbuilder extends React.Component {
  constructor(props) {
    super(props);
    const {params} = this.props;

    this.state = {
      activeTab: params ? params.chart : "tree_map",
      country: [],
      product: [],
      technology: [],
      permalink: undefined,

      _product: undefined,
      _country: undefined,
      _countryId: "all",
      _dataset: datasets[0],
      _flow: flow[0],
      _partner: undefined,
      _partnerId: "all",
      _year: undefined,
      _yearId: "2017",
      scrolled: false,

      _selectedItemsProduct: [],
      _selectedItemsCountry: [],
      _selectedItemsPartner: [],
      _selectedItemsTechnology: [],
      _selectedItemsYear: [],
      _selectedItemsProductTitle: [],
      _selectedItemsCountryTitle: [],
      _selectedItemsPartnerTitle: [],
      _selectedItemsTechnologyTitle: [],
      _selectedItemsYearTitle: [],

      wdiIndicators: [],
      _yAxis: {},
      _xAxis: {},
      _xAxisTitle: {},
      _yAxisTitle: {},
      _xAxisScale: "Log",
      _yAxisScale: "Log"
    };
  }

  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll);

    // Gets members of HS products, Countries and Technologies
    axios.all([
      axios.get("https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false"),
      axios.get("/members/country.json"),
      axios.get("/members/technology.json")
    ]).then(axios.spread((resp1, resp2, resp3) => {
      const productData = resp1.data.data;
      const productKeys = createItems(productData, ["Section", "HS2", "HS4"], "/images/icons/hs/hs_");

      const countryData = resp2.data.map(d => ({
        ...d, color: colors.Continent[d.parent_id]}));
      const technologyData = resp3.data.map(d => ({
        ...d, color: colors["CPC Section"][d.parent_id]}));

      // Sorts alphabetically country names
      countryData.sort((a, b) => a.title > b.title ? 1 : -1);

      this.updateFilterSelected({
        country: countryData,
        product: productData,
        productKeys,
        technology: technologyData
      }, true);
    }));

    axios.get("https://api.oec.world/tesseract/data.jsonrecords?cube=indicators_i_wdi_a&drilldowns=Indicator&measures=Measure&parents=false&sparse=false").then(resp => {
      const data = [{value: "OEC.ECI", title: "Economic Complexity Index (ECI)", scale: "Linear"}]
        .concat(resp.data.data.map(d => ({value: d["Indicator ID"], title: d.Indicator})));
      this.setState({
        wdiIndicators: data
      });
    });

  }

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    throttle(() => {
      this.setState({scrolled: window.scrollY > 220});
    }, 30);
  }

  handleTabOption = d => {
    const {router} = this.props;
    const permalink = d.permalink;
    if (permalink) {
      this.updateFilterSelected({permalink});
      router.push(permalink);
    }
    else {
      this.setState(d);
    }
  }

  /**
   * Creates a visualization after to click "Build Visualization" button
   * By default, creates a chart for the same type of visualization
   */
  buildViz = () => {
    const {router, routeParams} = this.props;
    const {chart} = routeParams;
    const {
      _flow,
      _dataset,
      _xAxis,
      _yAxis,
      _selectedItemsCountry,
      _selectedItemsPartner,
      _selectedItemsYear,
      _selectedItemsProduct,
      _selectedItemsTechnology
    } = this.state;

    let countryIds = _selectedItemsCountry.map(d => d.label).join(".");
    let partnerIds = _selectedItemsPartner && _selectedItemsPartner.length > 0
      ? _selectedItemsPartner.map(d => d.label).join(".")
      : "all";

    const isTechnologyFilter = _selectedItemsTechnology.length > 0;
    const isTradeFilter = _selectedItemsProduct.length > 0;

    let filterIds = isTechnologyFilter || isTradeFilter
      ? isTechnologyFilter
        ? _selectedItemsTechnology.map(d => d.value).join(".")
        : _selectedItemsProduct.map(d => d.id).join(".")
      : "show";

    const dataset = isTechnologyFilter ? "cpc" : _dataset.value;
    let flow = isTechnologyFilter ? "uspto" : _flow.value;

    /** Creates permalink config for scatter plot */
    if (chart === "scatter") {
      flow = _xAxis.value;
      countryIds = _yAxis.value;
      partnerIds = "all";
      filterIds = "all";
    }

    const permalink = `/en/visualize/${chart}/${dataset}/${flow}/${countryIds}/${partnerIds}/${filterIds}/${_selectedItemsYear.map(d => d.value).join(".")}/`;
    this.updateFilterSelected({permalink});
    router.push(permalink);
  };

  updateFilter = (key, value) => {
    this.setState({
      [key]: value,
      [`${key}Id`]: value.value
    });
  };

  /**
   * Updates selected options (countries, technologies, products) for Selector section
   */
  updateFilterSelected = (prevState, usePrevState = false) => {
    const countryData = usePrevState ? prevState.country : this.state.country;
    const technologyData = usePrevState ? prevState.technology : this.state.technology;
    const productKeys = usePrevState ? prevState.productKeys : this.state.productKeys;

    const {routeParams} = this.props;
    const {wdiIndicators} = this.state;
    let {country, cube, flow, partner, time, viztype} = routeParams;
    if (prevState && prevState.permalink) {
      [cube, flow, country, partner, viztype, time] = prevState.permalink.slice(1).split("/").slice(3);
    }

    const _yAxis = wdiIndicators.find(d => d.value === country) || {};
    const _xAxis = wdiIndicators.find(d => d.value === flow) || {};

    const _selectedItemsCountry = countryData
      .filter(d => country.split(".").includes(d.label));
    const _selectedItemsPartner = countryData
      .filter(d => partner.split(".").includes(d.label));
    const _selectedItemsYear = years
      .filter(d => time.split(".").includes(d.value.toString()));
    const _selectedItemsProduct = isFinite(viztype.split(".")[0])
      ? viztype.split(".").map(d => productKeys[d]) : [];

    const _selectedItemsTechnology = ["cpc"].includes(cube) ? technologyData
      .filter(d => viztype.split(".").includes(d.value)) : [];

    this.setState({
      ...prevState,
      _selectedItemsCountry,
      _selectedItemsPartner,
      _selectedItemsProduct,
      _selectedItemsTechnology,
      _selectedItemsYear,
      _selectedItemsCountryTitle: _selectedItemsCountry,
      _selectedItemsPartnerTitle: _selectedItemsPartner,
      _selectedItemsProductTitle: _selectedItemsProduct,
      _selectedItemsTechnologyTitle: _selectedItemsTechnology,
      _selectedItemsYearTitle: _selectedItemsYear,
      _xAxis,
      _yAxis,
      _xAxisTitle: _xAxis,
      _yAxisTitle: _yAxis,
      _xAxisScale: _xAxis.scale || "Log",
      _yAxisScale: _yAxis.scale || "Log"
    });
  }

  handleItemMultiSelect = (key, d) => {
    this.setState({[key]: d});
  }

  render() {
    const {activeTab, scrolled} = this.state;
    const {routeParams, t} = this.props;
    const {chart, cube, country, viztype} = routeParams;

    const isTrade = cube.includes("hs");
    const isTechnology = !isTrade;

    const isProduct = isFinite(viztype.split(".")[0]);
    const productSelector = isProduct && !["scatter"].includes(chart);
    const countrySelector = !["show", "all"].includes(country) && !["scatter"].includes(chart);
    const partnerSelector = countrySelector && !productSelector;

    return <div id="vizbuilder">
      <OECNavbar
        className={scrolled ? "background" : ""}
        title={"OEC"}
        scrolled={scrolled}
      />

      <div className="vb-profile">
        <div className="vb-columns">
          <div className="vb-column aside">
            <VbTabs
              activeOption={this.props.location.pathname}
              activeTab={activeTab}
              callback={d => this.handleTabOption(d)}
            />

            {productSelector && <div className="columns">
              <div className="column-1">
                <div className="select-multi-section-wrapper">
                  <h4 className="title">{t("Product")}</h4>
                  <SelectMultiSection
                    items={this.state.product}
                    onItemSelect={item => {
                      const nextItems = this.state._selectedItemsProduct.concat(item);
                      this.setState({_selectedItemsProduct: nextItems});
                    }}
                    onItemRemove={(evt, item) => {
                    // evt: MouseEvent<HTMLButtonElement>
                    // item: SelectedItem
                      evt.stopPropagation();
                      const nextItems = this.state._selectedItemsProduct.filter(i => i !== item);
                      this.setState({_selectedItemsProduct: nextItems});
                    }}
                    onClear={() => {
                    // setSelectedItems([]);
                    }}
                    selectedItems={this.state._selectedItemsProduct}
                  />
                </div>
              </div>
            </div>}

            {!["network", "scatter"].includes(chart) && isTechnology && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.technology}
                  selectedItems={this.state._selectedItemsTechnology}
                  title={"Technology"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsTechnology", d)}
                />
              </div>
            </div>}

            {countrySelector && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.country}
                  itemType={"country"}
                  selectedItems={this.state._selectedItemsCountry}
                  title={t("Country")}
                  callback={d => this.handleItemMultiSelect("_selectedItemsCountry", d)}
                />
              </div>
            </div>}

            {partnerSelector && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.country}
                  itemType="country"
                  placeholder={t("Select a partner...")}
                  selectedItems={this.state._selectedItemsPartner}
                  title={t("Partner")}
                  callback={d => this.handleItemMultiSelect("_selectedItemsPartner", d)}
                />
              </div>
            </div>}

            {["scatter"].includes(chart) && <div className="column-1-2">
              <VirtualSelector
                items={this.state.wdiIndicators}
                run={this.updateFilter}
                scale
                selectedItem={this.state._xAxis}
                state="_xAxis"
                title={"X Axis"}
                callbackButton={(key, value) => this.setState({[key]: value})}
              />
            </div>}

            {["scatter"].includes(chart) && <div className="column-1-2">
              <VirtualSelector
                items={this.state.wdiIndicators}
                run={this.updateFilter}
                scale
                selectedItem={this.state._yAxis}
                state="_yAxis"
                title={"Y Axis"}
                callbackButton={(key, value) => this.setState({[key]: value})}
              />
            </div>}

            <div className="columns">
              {!["scatter"].includes(chart) && <div className="column-1-2">
                <VirtualSelector
                  items={datasets}
                  title={"Dataset"}
                  state="_dataset"
                  selectedItem={this.state._dataset}
                  run={this.updateFilter}
                />
              </div>}

              {!["scatter"].includes(chart) && <div className="column-1-2">
                <VirtualSelector
                  items={flow}
                  title={"Trade Flow"}
                  state="_flow"
                  selectedItem={this.state._flow}
                  run={this.updateFilter}
                />
              </div>}

            </div>

            <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={years}
                  selectedItems={this.state._selectedItemsYear}
                  title={"Year"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsYear", d)}
                />
              </div>
            </div>

            <div className="columns">
              <div className="column-1 tab">
                <button
                  className="button build click"
                  onClick={this.buildViz}
                >
                  {t("Build Visualization")}
                </button>
              </div>
            </div>
          </div>
          <div className="vb-column">
            <VbTitle
              countryData={this.state.country}
              selectedItemsCountry={this.state._selectedItemsCountryTitle}
              selectedItemsProduct={this.state._selectedItemsProductTitle}
              selectedItemsPartner={this.state._selectedItemsPartnerTitle}
              selectedItemsTechnology={this.state._selectedItemsTechnologyTitle}
              routeParams={routeParams}
              xScale={this.state._xAxisTitle}
              yScale={this.state._yAxisTitle}
            />
            <VbChart
              countryData={this.state.country}
              permalink={this.state.permalink}
              xScale={this.state._xAxisScale}
              yScale={this.state._yAxisScale}
              routeParams={routeParams}
              router={this.props.router}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>;
  }
}

export default withNamespaces()(connect()(Vizbuilder));
