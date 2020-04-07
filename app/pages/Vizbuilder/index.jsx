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
import SelectMultiHierarchy from "components/SelectMultiHierarchy";
import SimpleSelect from "components/SimpleSelect";

import {Button, Switch} from "@blueprintjs/core";
import {range} from "helpers/utils";

import "./Vizbuilder.css";
import {getVbTitle} from "../../helpers/vbTitle";
import {queryParser} from "helpers/formatters";
import subnat from "helpers/subnatVizbuilder";

const cubeData = (a, b) => range(a, b).map(d => ({value: d, title: d}));

const getHierarchyList = (items, levels) => {
  const output = items.reduce((obj, d) => {
    for (const level of levels) {
      const id = d[`${level} ID`].toString();
      if (!obj[id]) {
        const item = {
          id,
          name: d[level],
          type: level
        };
        obj[id] = item;
      }
    }
    return obj;
  }, {});
  return Object.values(output);
};

const selectedItems = (items, value, key) => {
  const output = items.filter(d => value.split(".").includes(d.id || d.value));
  return {
    [key]: output,
    [`${key}Temp`]: output
  };
};

const datasets = [
  {value: "hs92", cubeName: "trade_i_baci_a_92", title: "HS92", data: cubeData(1995, 2018), productLevel: "HS6"},
  {value: "hs96", cubeName: "trade_i_baci_a_96", title: "HS96", data: cubeData(1998, 2018), productLevel: "HS6"},
  {value: "hs02", cubeName: "trade_i_baci_a_02", title: "HS02", data: cubeData(2003, 2018), productLevel: "HS6"},
  {value: "hs07", cubeName: "trade_i_baci_a_07", title: "HS07", data: cubeData(2008, 2018), productLevel: "HS6"}
  // {value: "sitc", title: "SITC", data: cubeData(1964, 2017)}
  // {value: "cpc", title: "Technology"}
];

const flowItems = [
  {value: "export", title: "Exports"},
  {value: "import", title: "Imports"}
];

const permalinkDecode = permalink => {
  const [
    lang,
    link,
    chart,
    cube,
    flow,
    country,
    partner,
    viztype,
    time
  ] = permalink.split("/").filter(d => d !== "");
  return {lang, link, chart, cube, flow, country, partner, viztype, time};
};

/** */
export function createItems(data, levels, iconUrl) {
  return data.reduce((obj, d) => {
    levels.forEach(type => {
      const id = d[`${type} ID`];
      if (!(id in obj)) {
        const sId = d["Section ID"];
        obj[id] = {
          color: colors.Section[sId],
          icon: `${iconUrl}${sId}.svg`,
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
    const {cube, chart} = params;

    const cubeSelected = datasets.find(d => d.value === cube) || datasets[0];

    // location.query.controls
    // ? location.query.controls === "true" :
    this.state = {
      activeTab: params ? params.chart : "tree_map",
      controls: true,
      country: [],
      product: [],
      productLevel: "HS6",
      technology: [],
      permalink: undefined,

      cubeSelected,

      _product: undefined,
      _country: undefined,
      _countryId: "all",
      _dataset: cubeSelected,
      _flow: flowItems[0],
      _partner: undefined,
      _partnerId: "all",
      _year: undefined,
      _yearId: "2017",
      _endYear: {title: 2017, value: 2017},
      _endYearTitle: {title: 2017, value: 2017},
      _startYear: {title: 2014, value: 2014},
      _startYearTitle: {title: 2014, value: 2014},
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

      // Scatter plot config
      wdiIndicators: [],
      _yAxis: {},
      _xAxis: {},
      _xAxisTitle: {},
      _yAxisTitle: {},
      _xAxisScale: "Log",
      _yAxisScale: "Log",

      // Subnational config
      subnatCubeSelected: subnat[cube] || subnat.cubeSelector[0],
      subnatGeography: [],
      subnatGeographyItems: [],
      subnatProductItems: [],
      subnatProduct: [],
      subnatTime: [],
      subnatGeoLevels: [],
      subnatProductLevels: [],
      selectedSubnatGeoTemp: [],
      selectedSubnatGeo: [],
      selectedSubnatProductTemp: [],
      selectedSubnatProduct: []
    };
  }

  fetchSubnationalData = async cubeName => {
    const subnatItem = subnat.cubeSelector.find(d => d.cube === cubeName);
    const {geoLevels, productLevels} = subnatItem;
    const {routeParams} = this.props;
    const {country, viztype} = routeParams;

    const params = {
      cube: cubeName,
      measures: "Trade Value",
      parents: true
    };

    const queryStringA = queryParser({...params, drilldowns: geoLevels[geoLevels.length - 1]});
    const dataGeo = await axios.get(`/olap-proxy/data?${queryStringA}`)
      .then(resp => resp.data);

    const queryStringB = queryParser({...params, drilldowns: productLevels[productLevels.length - 1]});
    const dataProduct = await axios.get(`/olap-proxy/data?${queryStringB}`)
      .then(resp => resp.data);

    const itemsGeo = getHierarchyList(dataGeo.data, geoLevels);
    const itemsProduct = getHierarchyList(dataProduct.data, productLevels);

    const selectedGeo = selectedItems(itemsGeo, country, "selectedSubnatGeo");
    const selectedProduct = selectedItems(itemsProduct, viztype, "selectedSubnatProduct");

    this.setState({
      subnatGeography: dataGeo.data,
      subnatGeographyItems: itemsGeo,
      subnatGeoLevels: geoLevels,
      subnatProductLevels: productLevels,
      subnatProductItems: itemsProduct,
      ...selectedGeo,
      ...selectedProduct
    });
  }


  fetchProductNames = async(cubeName, levelName = "HS6", levels = ["Section", "HS2", "HS4", "HS6"]) => {
    const params = {
      cube: cubeName,
      drilldowns: levelName,
      measures: "Trade Value",
      parents: true,
      sparse: false
    };
    const {routeParams} = this.props;
    const {viztype} = routeParams;

    const queryString = queryParser(params);

    const data = await axios.get(`/olap-proxy/data?${queryString}`)
      .then(resp => resp.data);

    const productData = data.data;
    const productKeys = createItems(productData, levels, "/images/icons/hs/hs_");
    const _selectedItemsProduct = isFinite(viztype.split(".")[0])
      ? viztype.split(".").map(d => productKeys[d]) : [];

    this.setState({
      product: productData,
      productKeys,
      _selectedItemsProduct,
      _selectedItemsProductTitle: _selectedItemsProduct
    });
  }

  componentDidMount = () => {
    const {routeParams} = this.props;
    const {cube} = routeParams;
    const isSubnat = cube.includes("subnat");
    window.addEventListener("scroll", this.handleScroll);

    // if (isSubnat) {
    this.fetchSubnationalData(this.state.subnatCubeSelected.cube);
    // }
    const {productLevel, _dataset} = this.state;
    const cubeName = _dataset.cubeName;

    // Gets members of HS products, Countries and Technologies
    axios.all([
      axios.get(`/olap-proxy/data?cube=${cubeName}&drilldowns=${productLevel}&measures=Trade+Value&parents=true&sparse=false`),
      axios.get("/members/country.json"),
      axios.get("/olap-proxy/data?cube=indicators_i_wdi_a&drilldowns=Indicator&measures=Measure&parents=false&sparse=false")
      // axios.get("/members/technology.json")
    ]).then(axios.spread((resp1, resp2, resp3) => {
      const productData = resp1.data.data;
      const productKeys = createItems(productData, ["Section", "HS2", "HS4", "HS6"], "/images/icons/hs/hs_");

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

  componentDidUpdate = (prevProps, prevState) => {
    // Updates product list
    if (this.state.cubeSelected.cubeName !== prevState.cubeSelected.cubeName) {
      const {cubeName} = this.state.cubeSelected;
      this.fetchProductNames(cubeName);
    }
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

    let dataset = isTechnologyFilter ? "cpc" : _dataset.value;
    let flow = isTechnologyFilter ? "uspto" : _flow.value;

    /** Creates permalink config for scatter plot */
    if (chart === "scatter") {
      flow = _xAxis.value;
      countryIds = _yAxis.value;
      partnerIds = "all";
      filterIds = "all";
    }

    const timeSeriesChart = ["line", "stacked"].includes(chart);
    let timeIds = timeSeriesChart
      ? `${_startYear.value}.${_endYear.value}`
      : _selectedItemsYear.map(d => d.value).sort((a, b) => a > b ? 1 : -1).join(".");

    // Subnational logic
    if (this.state.controls) {
      dataset = `subnat_${this.state.subnatCubeSelected.id}`;
      countryIds = this.state.selectedSubnatGeoTemp && this.state.selectedSubnatGeoTemp.length > 0
        ? parseIdsToURL(this.state.selectedSubnatGeoTemp, "id")
        : "show";
      timeIds = 2018;
    }

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
    this.updateFilterSelected({permalink, cubeSelected: _dataset});
    router.push(permalink);
  };

  getPermalinkIds = () => {
    const {
      _selectedItemsCountryTitle,
      _selectedItemsPartnerTitle,
      _selectedItemsTechnologyTitle,
      _selectedItemsProductTitle,
      _dataset,
      _flow,
      _xAxis,
      _yAxis,
      _startYearTitle,
      _endYearTitle,
      _selectedItemsYearTitle
    } = this.state;
    const {routeParams} = this.props;
    const {chart} = routeParams;

    const countryIds = _selectedItemsCountryTitle && _selectedItemsCountryTitle.length > 0
      ? parseIdsToURL(_selectedItemsCountryTitle, "label")
      : "deu";
    const partnerIds = _selectedItemsPartnerTitle && _selectedItemsPartnerTitle.length > 0
      ? parseIdsToURL(_selectedItemsPartnerTitle, "label")
      : "usa";

    const isTechnologyFilter = _selectedItemsTechnologyTitle.length > 0;
    const isTradeFilter = _selectedItemsProductTitle.length > 0;

    const filterIds = isTechnologyFilter || isTradeFilter
      ? isTechnologyFilter
        ? parseIdsToURL(_selectedItemsTechnologyTitle, "value")
        : parseIdsToURL(_selectedItemsProductTitle)
      : "10101";
    const dataset = isTechnologyFilter ? "cpc" : _dataset.value;
    const flow = isTechnologyFilter ? "uspto" : _flow.value;

    const timeIds = _selectedItemsYearTitle
      .map(d => d.value)
      .sort((a, b) => a > b ? 1 : -1)
      .join(".");

    /** Creates permalink config for scatter plot */
    const scatterFlow = _xAxis.value;
    const scatterCountry = _yAxis.value;
    const scatterPartner = "all";
    const scatterViztype = "all";

    const outputScatter = {
      scatterFlow,
      scatterCountry,
      scatterPartner,
      scatterViztype
    };


    const output = {
      cube: dataset,
      country: countryIds,
      partner: partnerIds,
      flow,
      viztype: filterIds,
      time: timeIds,
      timePlot: `${_startYearTitle.value}.${_endYearTitle.value}`
    };

    return Object.assign(output, outputScatter);
  }

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
      [`${key}Id`]: value.value || value.id
    });
    // Update subnational selectors
    if (key === "subnatCubeSelected") {
      this.fetchSubnationalData(value.cube);
    }
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

    const years = this.state._dataset.data;

    let {country, chart, cube, flow, partner, time, viztype} = routeParams;

    if (prevState && prevState.permalink) {
      [chart, cube, flow, country, partner, viztype, time] = prevState.permalink.slice(1).split("/").slice(2);
    }

    const isTimeSeriesChart = ["line", "stacked"].includes(chart);

    const _xAxis = wdiIndicators.find(d => d.value === flow) || wdiIndicators.find(d => d.value === "OEC.ECI");
    const _yAxis = wdiIndicators.find(d => d.value === country) || wdiIndicators.find(d => d.value === "NY.GDP.MKTP.CD");

    // Get selected countries
    const filterCountry = type => countryData.filter(d => type.split(".").includes(d.label));
    const _selectedItemsCountry = filterCountry(country);
    const _selectedItemsPartner = filterCountry(partner);

    const _selectedItemsYear = years
      .filter(d => time.split(".").includes(d.value.toString()));
    const _selectedItemsProduct = isFinite(viztype.split(".")[0])
      ? viztype.split(".").map(d => productKeys[d]).filter(d => d) : [];

    const _selectedItemsTechnology = ["cpc"].includes(cube) ? technologyData
      .filter(d => viztype.split(".").includes(d.value)) : [];

    const timeIds = time.split(".").map(d => ({value: d * 1, title: d * 1}));
    const _startYear = isTimeSeriesChart ? timeIds[0] : this.state._startYear;
    const _endYear = isTimeSeriesChart ? timeIds[1] : this.state._endYear;

    if (["export", "import"].includes(flow)) prevState._flow = flowItems.find(d => d.value === flow);

    ["selectedSubnatGeo", "selectedSubnatProduct"].reduce((obj, d) => {
      if (!obj[d]) obj[d] = this.state[`${d}Temp`];
      return obj;
    }, {});

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
    const years = this.state._dataset.data.sort((a, b) => b.value - a.value);
    const {activeTab, scrolled} = this.state;
    const {routeParams, t} = this.props;
    const {chart, cube, country, viztype, time} = routeParams;

    const isCountry = !["show", "all"].includes(country);
    const isProduct = isFinite(viztype.split(".")[0]);
    const isScatterChart = ["scatter"].includes(chart);
    const isNetworkChart = ["network"].includes(chart);
    const isTimeSeriesChart = ["line", "stacked"].includes(chart);
    const isTrade = cube.includes("hs");
    const isTechnology = !isTrade;
    const isSubnat = cube.includes("subnat");

    const productSelector = isProduct && !isScatterChart;
    const countrySelector = isCountry && !isScatterChart;
    const partnerSelector = countrySelector && !productSelector && !isNetworkChart;

    const timeIndex = years.findIndex(d => d.value === time * 1);
    const prevTime = !isTimeSeriesChart ? years[timeIndex + 1] : undefined;
    const nextTime = !isTimeSeriesChart ? years[timeIndex - 1] : undefined;

    const subnatItem = subnat[cube] || {};
    const {geoLevels, productLevels} = subnatItem;
    const isSubnatPanel = this.state.controls;
    const isSubnatTitle = subnat[cube];

    const {vbTitle, vbParams} = getVbTitle(
      {
        geo: isSubnatTitle ? this.state.selectedSubnatGeo : this.state._selectedItemsCountryTitle,
        geoPartner: this.state._selectedItemsPartnerTitle,
        product: isSubnatTitle ? this.state.selectedSubnatProduct : this.state._selectedItemsProductTitle,
        technology: this.state._selectedItemsTechnologyTitle},
      {
        x: this.state._xAxisTitle,
        y: this.state._yAxisTitle
      },
      routeParams
    );

    return <div id="vizbuilder">
      <OECNavbar
        className={scrolled ? "background" : ""}
        title={t(vbTitle, Object.assign(vbParams, {interpolation: {escapeValue: false}}))}
        scrolled={scrolled}
      />

      <div className="vb-profile">
        <div className="vb-columns">
          <div
            className="vb-column aside"
            // style={!this.state.controls ? {marginLeft: -250} : {}}
          >
            <div className="controls">
              <Switch
                checked={this.state.controls}
                onChange={this.handleControls}
                alignIndicator="right"
                label="States/Provinces"
              />
            </div>
            {<div className="content">
              {this.state.controls && <div className="columns">
                <div className="column-1">
                  <SimpleSelect
                    items={subnat.cubeSelector}
                    title={t("Country")}
                    state="subnatCubeSelected"
                    selectedItem={this.state.subnatCubeSelected}
                    callback={this.updateFilter}
                  />
                </div>
              </div>}
              <VbTabs
                activeOption={this.props.location.pathname}
                activeTab={activeTab}
                callback={d => this.handleTabOption(d)}
                permalinkIds={this.getPermalinkIds()}
              />

              {isSubnat && productSelector && <div className="columns">
                <div className="column-1">
                  <div className="select-multi-section-wrapper">
                    <h4 className="title">{t("Subnat Product")}</h4>
                    <SelectMultiHierarchy
                      getColor={d => "blue"}
                      getIcon={d => "/images/icons/hs/hs_22.svg"}
                      items={this.state.subnatProductItems}
                      levels={productLevels}
                      onItemSelect={item => {
                        const nextItems = this.state.selectedSubnatProductTemp.concat(item);
                        this.setState({selectedSubnatProductTemp: nextItems});
                      }}
                      onItemRemove={(evt, item) => {
                        // evt: MouseEvent<HTMLButtonElement>
                        // item: SelectedItem
                        evt.stopPropagation();
                        const nextItems = this.state.selectedSubnatProductTemp.filter(i => i !== item);
                        this.setState({selectedSubnatProductTemp: nextItems});
                      }}
                      onClear={() => {
                        this.setState({selectedSubnatProductTemp: []});
                      }}
                      selectedItems={this.state.selectedSubnatProductTemp}
                    />
                  </div>
                </div>
              </div>}

              {isSubnatPanel && countrySelector && <div className="columns">
                <div className="column-1">
                  <div className="select-multi-section-wrapper">
                    <h4 className="title">{t("State/Province")}</h4>
                    <SelectMultiHierarchy
                      getColor={d => "blue"}
                      getIcon={d => "/images/icons/hs/hs_22.svg"}
                      items={this.state.subnatGeography}
                      levels={this.state.subnatGeoLevels || []}
                      onItemSelect={item => {
                        const nextItems = this.state.selectedSubnatGeoTemp.concat(item);
                        this.setState({selectedSubnatGeoTemp: nextItems});
                      }}
                      onItemRemove={(evt, item) => {
                        // evt: MouseEvent<HTMLButtonElement>
                        // item: SelectedItem
                        evt.stopPropagation();
                        const nextItems = this.state.selectedSubnatGeoTemp.filter(i => i !== item);
                        this.setState({selectedSubnatGeoTemp: nextItems});
                      }}
                      onClear={() => {
                        this.setState({selectedSubnatGeoTemp: []});
                      }}
                      selectedItems={this.state.selectedSubnatGeoTemp}
                    />
                  </div>
                </div>
              </div>}

              {!isSubnat && productSelector && <div className="columns">
                <div className="column-1">
                  <div className="select-multi-section-wrapper">
                    <h4 className="title">{t("Product")}</h4>
                    <SelectMultiHierarchy
                      getColor={d => colors.Section[d["Section ID"]]}
                      getIcon={d => `/images/icons/hs/hs_${d["Section ID"]}.svg`}
                      items={this.state.product}
                      levels={["Section", "HS2", "HS4", "HS6"]}
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
                        this.setState({_selectedItemsProduct: []});
                      }}
                      selectedItems={this.state._selectedItemsProduct}
                    />
                  </div>
                </div>
              </div>}

              {/* {!isNetworkChart && !isScatterChart && isTechnology && <div className="columns">
                <div className="column-1">
                  <OECMultiSelect
                    items={this.state.technology}
                    selectedItems={this.state._selectedItemsTechnology}
                    title={t("Technology")}
                    callback={d => this.handleItemMultiSelect("_selectedItemsTechnology", d)}
                  />
                </div>
              </div>} */}

              {countrySelector && !isSubnatPanel && <div className="columns">
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
                {!isScatterChart && !isSubnatPanel && <div className="column-1-2">
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
              cubeName={this.state.cubeSelected.cubeName}
              permalink={this.state.permalink}
              routeParams={routeParams}
              router={this.props.router}
              selectedProducts={this.state._selectedItemsProductTitle}
              xAxis={this.state._xAxisTitle}
              yAxis={this.state._yAxisTitle}
              xScale={this.state._xAxisScale}
              yScale={this.state._yAxisScale}
              callback={d => {
                const query = permalinkDecode(d);
                const permalink = {permalink: d, activeTab: query.chart || "tree_map"};
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
