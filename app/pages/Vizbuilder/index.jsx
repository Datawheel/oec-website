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
import SelectMultiSection from "components/SelectMultiSection";
import SimpleSelect from "components/SimpleSelect";

import {Button, Switch} from "@blueprintjs/core";

import "./Vizbuilder.css";
import {getVbTitle} from "../../helpers/vbTitle";

const datasets = [
  {value: "hs92", title: "HS92"},
  {value: "hs96", title: "HS96"},
  {value: "hs02", title: "HS02"},
  {value: "hs07", title: "HS07"},
  {value: "sitc", title: "SITC"}
  // {value: "cpc", title: "Technology"}
];

const flowItems = [
  {value: "export", title: "Exports"},
  {value: "import", title: "Imports"}
];

const years = [...Array(54).keys()].map(d => ({value: 2017 - d, title: 2017 - d}));

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

const parseIdsToURL = (data, key = "id") => data.map(d => d[key]).join(".");

class Vizbuilder extends React.Component {
  constructor(props) {
    super(props);
    const {location, params} = this.props;
    this.state = {
      activeTab: params ? params.chart : "tree_map",
      controls: location.query.controls
        ? location.query.controls === "true" : true,
      country: [],
      product: [],
      technology: [],
      permalink: undefined,

      _product: undefined,
      _country: undefined,
      _countryId: "all",
      _dataset: datasets[0],
      _flow: flowItems[0],
      _partner: undefined,
      _partnerId: "all",
      _year: undefined,
      _yearId: "2017",
      _endYear: {title: 2017, value: 2017},
      _endYearTitle: {title: 2017, value: 2017},
      _startYear: {title: 2017, value: 2017},
      _startYearTitle: {title: 2017, value: 2017},
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
      axios.get("https://api.oec.world/tesseract/data.jsonrecords?cube=indicators_i_wdi_a&drilldowns=Indicator&measures=Measure&parents=false&sparse=false")
      // axios.get("/members/technology.json")
    ]).then(axios.spread((resp1, resp2, resp3) => {
      const productData = resp1.data.data;
      const productKeys = createItems(productData, ["Section", "HS2", "HS4"], "/images/icons/hs/hs_");

      const countryData = resp2.data.map(d => ({
        ...d, color: colors.Continent[d.parent_id]}));
      // const technologyData = resp4.data.map(d => ({
      //   ...d, color: colors["CPC Section"][d.parent_id]}));
      const technologyData = [];

      // Sorts alphabetically country names
      countryData.sort((a, b) => a.title > b.title ? 1 : -1);

      const wdi = resp3.data.data
        .map(d => ({value: d["Indicator ID"], title: d.Indicator}))
        .sort((a, b) => a.title > b.title ? 1 : -1);
      const data = [{value: "OEC.ECI", title: "Economic Complexity Index (ECI)", scale: "Linear"}]
        .concat(wdi);

      this.updateFilterSelected({
        country: countryData,
        product: productData,
        productKeys,
        technology: technologyData,
        wdiIndicators: data
      }, true);
    }));


  }

  // componentDidUpdate = (prevProps, prevState) => {
  //   console.log(prevState.permalink, this.state.permalink);
  // }

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * Creates a visualization after to click "Build Visualization" button
   * By default, creates a chart for the same type of visualization
   */
  buildViz = () => {
    const {router, routeParams} = this.props;
    const {chart} = routeParams;
    const {
      _dataset,
      _endYear,
      _flow,
      _selectedItemsCountry,
      _selectedItemsPartner,
      _selectedItemsProduct,
      _selectedItemsTechnology,
      _selectedItemsYear,
      _startYear,
      _xAxis,
      _yAxis
    } = this.state;

    let countryIds = _selectedItemsCountry && _selectedItemsCountry.length > 0
      ? parseIdsToURL(_selectedItemsCountry, "label")
      : "show";
    let partnerIds = _selectedItemsPartner && _selectedItemsPartner.length > 0
      ? parseIdsToURL(_selectedItemsPartner, "label")
      : "all";

    const isTechnologyFilter = _selectedItemsTechnology.length > 0;
    const isTradeFilter = _selectedItemsProduct.length > 0;

    let filterIds = isTechnologyFilter || isTradeFilter
      ? isTechnologyFilter
        ? parseIdsToURL(_selectedItemsTechnology, "value")
        : parseIdsToURL(_selectedItemsProduct)
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

    const timeSeriesChart = ["line", "stacked"].includes(chart);
    const timeIds = timeSeriesChart
      ? `${_startYear.value}.${_endYear.value}`
      : _selectedItemsYear.map(d => d.value).join(".");

    const permalinkItems = [
      "en",
      "visualize",
      chart,
      dataset,
      flow,
      countryIds,
      partnerIds,
      filterIds,
      timeIds
    ];
    const permalink = `/${permalinkItems.join("/")}/`;
    this.updateFilterSelected({permalink});
    router.push(permalink);
  };

  handleControls = () => this.setState({controls: !this.state.controls})

  handleItemMultiSelect = (key, d) => {
    this.setState({[key]: d});
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
    const wdiIndicators = usePrevState ? prevState.wdiIndicators : this.state.wdiIndicators;
    const {routeParams} = this.props;

    let {country, cube, flow, partner, time, viztype} = routeParams;
    const {chart} = routeParams;
    if (prevState && prevState.permalink) {
      [cube, flow, country, partner, viztype, time] = prevState.permalink.slice(1).split("/").slice(3);
    }

    const isTimeSeriesChart = ["line", "stacked"].includes(chart);

    const _xAxis = wdiIndicators.find(d => d.value === flow) || {};
    const _yAxis = wdiIndicators.find(d => d.value === country) || {};

    // Get selected countries
    const filterCountry = type => countryData.filter(d => type.split(".").includes(d.label));
    const _selectedItemsCountry = filterCountry(country);
    const _selectedItemsPartner = filterCountry(partner);

    const _selectedItemsYear = years
      .filter(d => time.split(".").includes(d.value.toString()));
    const _selectedItemsProduct = isFinite(viztype.split(".")[0])
      ? viztype.split(".").map(d => productKeys[d]) : [];

    const _selectedItemsTechnology = ["cpc"].includes(cube) ? technologyData
      .filter(d => viztype.split(".").includes(d.value)) : [];

    const timeIds = time.split(".").map(d => ({value: d * 1, title: d * 1}));
    const _startYear = isTimeSeriesChart ? timeIds[0] : {};
    const _endYear = isTimeSeriesChart ? timeIds[1] : {};

    if (["export", "import"].includes(flow)) prevState._flow = flowItems.find(d => d.value === flow);

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
      _yAxisScale: _yAxis.scale || "Log",
      _endYear,
      _startYear,
      _endYearTitle: _endYear,
      _startYearTitle: _startYear
    });
  }

  render() {
    const {activeTab, scrolled} = this.state;
    const {routeParams, t} = this.props;
    const {chart, cube, country, viztype, time} = routeParams;

    const isCountry = !["show", "all"].includes(country);
    const isProduct = isFinite(viztype.split(".")[0]);
    const isScatterChart = ["scatter"].includes(chart);
    const isTimeSeriesChart = ["line", "stacked"].includes(chart);
    const isTrade = cube.includes("hs");
    const isTechnology = !isTrade;

    const productSelector = isProduct && !isScatterChart;
    const countrySelector = isCountry && !isScatterChart;
    const partnerSelector = countrySelector && !productSelector;

    const timeIndex = years.findIndex(d => d.value === time * 1);
    const prevTime = !isTimeSeriesChart ? years[timeIndex + 1] : undefined;
    const nextTime = !isTimeSeriesChart ? years[timeIndex - 1] : undefined;

    const {vbTitle, vbParams} = getVbTitle(
      routeParams,
      this.state._selectedItemsCountryTitle,
      this.state._selectedItemsPartnerTitle,
      this.state._selectedItemsProductTitle,
      this.state._selectedItemsTechnologyTitle,
      this.state._xAxisTitle,
      this.state._yAxisTitle
    );

    return <div id="vizbuilder">
      <OECNavbar
        className={scrolled ? "background" : ""}
        title={t(vbTitle, Object.assign(vbParams, {interpolation: {escapeValue: false}}))}
        scrolled={scrolled}
      />

      <div className="vb-profile">
        <div className="vb-columns">
          <div className="vb-column aside" style={!this.state.controls ? {marginLeft: -250} : {}}>
            <div className="controls">
              <Switch
                checked={this.state.controls}
                onChange={this.handleControls}
                alignIndicator="right"
              />
            </div>
            {this.state.controls && <div className="content">
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
                    title={t("Technology")}
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

              {isScatterChart && <div className="column-1-2">
                <VirtualSelector
                  items={this.state.wdiIndicators}
                  run={this.updateFilter}
                  scale
                  selectedItem={this.state._xAxis}
                  state="_xAxis"
                  title={t("X Axis")}
                  callbackButton={(key, value) => this.setState({[key]: value})}
                />
              </div>}

              {isScatterChart && <div className="column-1-2">
                <VirtualSelector
                  items={this.state.wdiIndicators}
                  run={this.updateFilter}
                  scale
                  selectedItem={this.state._yAxis}
                  state="_yAxis"
                  title={t("Y Axis")}
                  callbackButton={(key, value) => this.setState({[key]: value})}
                />
              </div>}

              <div className="columns">
                {!isScatterChart && <div className="column-1-2">
                  <SimpleSelect
                    items={datasets}
                    title={t("Dataset")}
                    state="_dataset"
                    selectedItem={this.state._dataset}
                    callback={this.updateFilter}
                  />
                </div>}

                {!isScatterChart && <div className="column-1-2">
                  <SimpleSelect
                    items={flowItems}
                    title={t("Trade Flow")}
                    state="_flow"
                    selectedItem={this.state._flow}
                    callback={this.updateFilter}
                  />
                </div>}

              </div>

              {!["line", "stacked"].includes(chart) ? <div className="columns">
                <div className="column-1">
                  <OECMultiSelect
                    items={years}
                    selectedItems={this.state._selectedItemsYear}
                    title={t("Year")}
                    callback={d => this.handleItemMultiSelect("_selectedItemsYear", d)}
                  />
                </div>
              </div> : <div className="columns">
                <div className="column-1-2">
                  <SimpleSelect
                    items={years}
                    title={t("Start Year")}
                    state="_startYear"
                    selectedItem={this.state._startYear}
                    callback={this.updateFilter}
                  />
                </div>
                <div className="column-1-2">
                  <SimpleSelect
                    items={years}
                    title={t("End Year")}
                    state="_endYear"
                    selectedItem={this.state._endYear}
                    callback={this.updateFilter}
                  />
                </div>
              </div>}

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
            </div>}
          </div>
          <div className="vb-column">
            <div className="vb-title-wrapper">
              <div className="vb-title-button">
                {prevTime && <Button
                  icon="chevron-left"
                  minimal={true}
                  onClick={() => {
                    this.setState({_selectedItemsYear: [prevTime]}, () => this.buildViz());
                  }}
                  text={prevTime.title}
                />}
              </div>
              <VbTitle
                params={vbParams}
                title={vbTitle}
              />
              <div className="vb-title-button">
                {nextTime && <Button
                  minimal={true}
                  onClick={() => {
                    this.setState({_selectedItemsYear: [nextTime]}, () => this.buildViz());
                  }}
                  rightIcon="chevron-right"
                  text={nextTime.title}
                />}
              </div>
            </div>
            <VbChart
              countryData={this.state.country}
              permalink={this.state.permalink}
              routeParams={routeParams}
              router={this.props.router}
              selectedProducts={this.state._selectedItemsProductTitle}
              xScale={this.state._xAxisScale}
              yScale={this.state._yAxisScale}
              callback={d => {
                const permalink = {permalink: d};
                this.setState(
                  permalink,
                  () => this.updateFilterSelected(permalink)
                );
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>;
  }
}

export default withNamespaces()(connect()(Vizbuilder));
