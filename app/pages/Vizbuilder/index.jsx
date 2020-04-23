import React from "react";
import axios from "axios";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
// Components
import Footer from "components/Footer";
import LoadingChart from "components/LoadingChart";
import OECButtonGroup from "components/OECButtonGroup";
import OECMultiSelect from "components/OECMultiSelect";
import OECNavbar from "components/OECNavbar";
import SelectMultiHierarchy from "components/SelectMultiHierarchy";
import SimpleSelect from "components/SimpleSelect";
import VbChart from "components/VbChart";
import VbTabs from "components/VbTabs";
import VbTitle from "components/VbTitle";
import VirtualSelector from "components/VirtualSelector";
// Helpers
import colors from "helpers/colors";
import subnat from "helpers/subnatVizbuilder";
import {getVbTitle} from "helpers/vbTitle";
import {queryParser} from "helpers/formatters";

import "./Vizbuilder.css";


const notEmpty = items => items && items.length;

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

const datasets = subnat.datasets;

const flowItems = [
  {value: "export", title: "Exports"},
  {value: "import", title: "Imports"}
];

const parseIdsToURL = (data, key = "id") => data.map(d => d[key]).join(".");

const permalinkEncode = items => `/${items.join("/")}/`;

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

const timeOptions = {
  4: "Year",
  5: "Quarter",
  6: "Month"
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

const filterSubnat = (items, type, key = "id", time = false) => {
  const output = items.filter(d => type.split(".").includes(d[key]));
  if (!time) return output;
  return output.length > 0 ? output : time && items[0] ? [items[0]] : [];
  // items[0] ? [items[0]] :
};

class Vizbuilder extends React.Component {
  constructor(props) {
    super(props);
    const {params} = this.props;
    const {cube, country} = params;

    const cubeSelected = datasets.find(d => d.value === cube) || datasets[0];

    this.state = {
      activeTab: params ? params.chart : "tree_map",
      controls: params ? params.cube.includes("subnational") : true,
      product: [],
      productLevel: cubeSelected.productLevel,
      technology: [],
      permalink: undefined,
      permalinkCube: undefined,

      cubeSelected,
      loading: true,
      _dataset: cubeSelected,
      _flow: flowItems[0],
      _partner: undefined,
      _endYear: {title: 2018, value: 2018},
      _endYearTitle: {title: 2018, value: 2018},
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

      //
      startTime: {},
      endTime: {},
      startTimeTemp: {},
      endTimeTemp: {},

      // Scatter plot config
      _yAxis: {},
      _xAxis: {},
      _xAxisTitle: {},
      _yAxisTitle: {},
      _xAxisScale: "Log",
      _yAxisScale: "Log",

      // Subnational config
      subnatItem: {},
      subnatCubeSelected: subnat[cube] || subnat.cubeSelector.find(d => d.id === country) || subnat.cubeSelector[0],
      subnatGeography: [],
      subnatGeoItems: [],
      subnatProductItems: [],
      subnatProduct: [],
      subnatTime: [],
      // Levels Geo/Product/Time in Subnational
      subnatTimeLevels: [],
      subnatTimeLevelSelected: "",
      subnatTimeItems: [],
      subnatGeoLevels: [],
      subnatProductLevels: [],
      selectedSubnatGeoTemp: [],
      selectedSubnatGeo: [],
      selectedSubnatProductTemp: [],
      selectedSubnatProduct: [],
      selectedSubnatTimeTemp: [],
      selectedSubnatTime: []
    };

    this.fetchCache = this.fetchCache.bind(this);
    this.handleCube = this.handleCube.bind(this);
  }

  fetchSubnationalData = async(cubeName, ...args) => {
    const subnatItem = subnat.cubeSelector.find(d => d.cube === cubeName);
    const {geoLevels, productLevels, timeLevels} = subnatItem;
    const {routeParams} = this.props;
    const {country, time, viztype} = routeParams;
    const geoParam = args[0] || country;
    const timeParam = args[1] || time;
    const filterParam = args[2] || viztype;

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

    const queryStringC = queryParser({...params, drilldowns: timeLevels[timeLevels.length - 1]});
    const dataTime = await axios.get(`/olap-proxy/data?${queryStringC}`)
      .then(resp => resp.data);

    const dataTimeTemp = dataTime.data.map(d => {
      const year = d.Year;
      const item = {
        "Year ID": year,
        "Year": year,
        "Quarter ID": year * 10 + d["Quarter ID"],
        "Quarter": `${year} ${d.Quarter}`,
        "Month ID": year * 100 + d["Month ID"],
        "Month": `${year} ${d.Month}`
      };
      return item;
    });

    const itemsGeo = getHierarchyList(dataGeo.data, geoLevels);
    const itemsProduct = getHierarchyList(dataProduct.data, productLevels);
    const itemsTime = getHierarchyList(dataTimeTemp, timeLevels);

    const selectedGeo = selectedItems(itemsGeo, geoParam, "selectedSubnatGeo");
    const selectedProduct = selectedItems(itemsProduct, filterParam, "selectedSubnatProduct");
    const subnatTimeItems = itemsTime
      .map(d => ({value: d.id, title: d.name, type: d.type}))
      .sort((a, b) => b.value - a.value);

    const filteredTimeItems = subnatTimeItems
      .filter(d => timeParam.split(".").includes(d.value.toString()));

    this.setState({
      subnatItem,
      subnatGeography: dataGeo.data,
      subnatGeoItems: itemsGeo,
      subnatTimeItems,
      subnatGeoLevels: geoLevels,
      subnatProductLevels: productLevels,
      subnatTimeLevels: timeLevels,
      subnatProductItems: itemsProduct,
      selectedSubnatTimeTemp: filteredTimeItems,
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

  fetchCache = () => {
    const {productLevel, _dataset} = this.state;
    const cubeName = _dataset.cubeName;

    // Gets members of HS products, Countries and Technologies
    axios.all([
      axios.get(`/olap-proxy/data?cube=${cubeName}&drilldowns=${productLevel}&measures=Trade+Value&parents=true&sparse=false`),
      axios.get("/members/country.json"),
      axios.get("/olap-proxy/data?cube=indicators_i_wdi_a&drilldowns=Indicator&measures=Measure&parents=false&sparse=false")
    ]).then(axios.spread((...resp) => {
      const productData = resp[0].data.data;
      const productKeys = createItems(productData, ["Section", "HS2", "HS4", "HS6"], "/images/icons/hs/hs_");
      const countryMembers = resp[1].data
        .map(d => ({...d, color: colors.Continent[d.parent_id]}))
        .sort((a, b) => a.title > b.title ? 1 : -1);

      const wdi = resp[2].data.data
        .map(d => ({value: d["Indicator ID"], title: d.Indicator}))
        .sort((a, b) => a.title > b.title ? 1 : -1);
      const wdiIndicators = [{value: "OEC.ECI", title: "Economic Complexity Index (ECI)", scale: "Linear"}]
        .concat(wdi);

      // Updates redux state
      this.props.addCountryMembers(countryMembers);
      this.props.addWdiIndicators(wdiIndicators);

      this.updateFilterSelected({
        product: productData,
        productKeys,
        technology: []
      }, true);
    }));
  }

  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll);
    const {routeParams} = this.props;
    const {cube} = routeParams;
    if (cube.includes("subnational")) {
      this.fetchSubnationalData(this.state.subnatCubeSelected.cube);
    }
    this.fetchCache();
  }

  componentDidUpdate = (prevProps, prevState) => {
    // Updates product list
    if (this.state.cubeSelected.cubeName !== prevState.cubeSelected.cubeName) {
      const {cubeName} = this.state.cubeSelected;
      this.fetchProductNames(cubeName);
    }
    // Updates loading panel
    if (prevProps.params.cube !== this.props.params.cube) {
      this.setState(
        {permalinkCube: this.props.params.cube},
        () => this.handleCube(this.state.permalinkCube)
      );
    }

    if (
      this.state.permalinkCube !== prevState.permalinkCube && !this.state.permalinkCube.includes("subnational") ||
      this.state.subnatGeoItems.length !== prevState.subnatGeoItems.length && this.state.permalinkCube.includes("subnational")
    ) {
      this.handleCube(this.state.permalinkCube);
    }

    if (!this.props.loading && prevProps.loading !== this.props.loading) {
      this.setState({loading: false});
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * @description Creates a visualization after to click "Build Visualization" button
   */
  buildViz = () => {
    this.setState({loading: true});
    const {lng, router, routeParams} = this.props;
    const {chart, cube} = routeParams;
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

    let countryIds = notEmpty(_selectedItemsCountry)
      ? parseIdsToURL(_selectedItemsCountry, "label")
      : "show";
    let partnerIds = notEmpty(_selectedItemsPartner)
      ? parseIdsToURL(_selectedItemsPartner, "label")
      : "all";

    const isTechnologyFilter = notEmpty(_selectedItemsTechnology);
    const isTradeFilter = notEmpty(_selectedItemsProduct);

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

    const isTimeSeriesChart = ["line", "stacked"].includes(chart);
    let timeIds = isTimeSeriesChart
      ? `${_startYear.value}.${_endYear.value}`
      : _selectedItemsYear.map(d => d.value).sort((a, b) => a > b ? 1 : -1).join(".");

    /** Creates permalink config for subnational plot */
    if (
      notEmpty(this.state.selectedSubnatGeoTemp) ||
      cube.includes("subnational") && notEmpty(this.state.selectedSubnatProductTemp)
    ) {
      const {selectedSubnatGeoTemp, selectedSubnatProductTemp, selectedSubnatTimeTemp, subnatCubeSelected} = this.state;
      dataset = `subnational_${subnatCubeSelected.id}`;
      countryIds = notEmpty(selectedSubnatGeoTemp)
        ? parseIdsToURL(selectedSubnatGeoTemp, "id")
        : notEmpty(selectedSubnatProductTemp) ? "show" : "all";

      timeIds = isTimeSeriesChart
        ? `${this.state.startTimeTemp.value}.${this.state.endTimeTemp.value}`
        : parseIdsToURL(selectedSubnatTimeTemp, "value");

      if (notEmpty(selectedSubnatProductTemp)) {
        filterIds =  parseIdsToURL(selectedSubnatProductTemp, "id");
      }
    }

    const permalinkItems = [
      lng,
      "visualize",
      chart,
      dataset,
      flow,
      countryIds,
      partnerIds,
      filterIds,
      timeIds
    ];
    const permalink = permalinkEncode(permalinkItems);
    this.updateFilterSelected({permalink, cubeSelected: _dataset});
    router.push(permalink);
  }

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
      _selectedItemsYearTitle,
      selectedSubnatGeo,
      selectedSubnatProduct
    } = this.state;
    const {routeParams} = this.props;
    const {cube} = routeParams;

    let countryIds = notEmpty(_selectedItemsCountryTitle)
      ? parseIdsToURL(_selectedItemsCountryTitle, "label")
      : "deu";
    let partnerIds = notEmpty(_selectedItemsPartnerTitle)
      ? parseIdsToURL(_selectedItemsPartnerTitle, "label")
      : "usa";

    const isTechnologyFilter = notEmpty(_selectedItemsTechnologyTitle);
    const isTradeFilter = notEmpty(_selectedItemsProductTitle);

    let filterIds = isTechnologyFilter || isTradeFilter
      ? isTechnologyFilter
        ? parseIdsToURL(_selectedItemsTechnologyTitle, "value")
        : parseIdsToURL(_selectedItemsProductTitle)
      : "10101";
    let dataset = isTechnologyFilter ? "cpc" : _dataset.value;
    const flow = isTechnologyFilter ? "uspto" : _flow.value;

    let timeIds = _selectedItemsYearTitle
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

    let timePlot = `${_startYearTitle.value}.${_endYearTitle.value}`;

    // Generates structure of permalinks for subnational
    if (cube.includes("subnational")) {
      const {subnatGeoItems, subnatProductItems, selectedSubnatTimeTemp, startTime, endTime} = this.state;
      const geoId = subnatGeoItems.map(d => d.id)[0];
      const productId = subnatProductItems.map(d => d.id)[0];

      countryIds = notEmpty(selectedSubnatGeo) ? parseIdsToURL(selectedSubnatGeo, "id") : geoId;
      dataset = cube;
      timeIds = selectedSubnatTimeTemp
        .map(d => d.value)
        .sort((a, b) => a > b ? 1 : -1)
        .join(".");
      timePlot = `${startTime.value}.${endTime.value}`;
      filterIds = notEmpty(selectedSubnatProduct) ? parseIdsToURL(selectedSubnatProduct, "id") : productId;
      if (notEmpty(_selectedItemsPartnerTitle)) partnerIds = "deu";
    }


    const output = {
      cube: dataset,
      country: countryIds,
      partner: partnerIds,
      flow,
      viztype: filterIds,
      time: timeIds,
      timePlot
    };

    return Object.assign(output, outputScatter);
  }

  handleControls = () => this.setState({controls: !this.state.controls})

  handleItemMultiSelect = (key, d) => {
    this.setState({[key]: d});
    if (key === "_selectedItemsCountry" && subnat.cubeSelector.some(h => d[d.length - 1].label === h.id)) {
      const cube = subnat.cubeSelector.find(h => d[d.length - 1].label === h.id);
      this.setState({subnatCubeSelected: cube}, () => this.fetchSubnationalData(cube.cube));
    }
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
   * @returns {state}
   */
  updateFilterSelected = (prevState, usePrevState = false) => {
    const technologyData = usePrevState ? prevState.technology : this.state.technology;
    const productKeys = usePrevState ? prevState.productKeys : this.state.productKeys;
    const {countryMembers, wdiIndicators, routeParams} = this.props;
    const years = this.state._dataset.timeItems;

    let {country, chart, cube, flow, partner, time, viztype} = routeParams;

    if (prevState && prevState.permalink) {
      [chart, cube, flow, country, partner, viztype, time] = prevState.permalink.slice(1).split("/").slice(2);
    }

    for (const c of country.split(".")) {
      if (subnat.cubeSelector.some(d => d.id === c)) {
        this.fetchSubnationalData(this.state.subnatCubeSelected.cube, country, time, viztype);
      }
    }

    const isTimeSeriesChart = ["line", "stacked"].includes(chart);

    const _xAxis = wdiIndicators.find(d => d.value === flow) || wdiIndicators.find(d => d.value === "OEC.ECI");
    const _yAxis = wdiIndicators.find(d => d.value === country) || wdiIndicators.find(d => d.value === "NY.GDP.MKTP.CD");

    // Get selected countries
    const filterCountry = type => countryMembers.filter(d => type.split(".").includes(d.label));
    const countryItems = filterCountry(country);
    const timeItems = years.filter(d => time.split(".").includes(d.value.toString()));

    const selectedItems = {
      Country: countryItems.length
        ? countryItems
        : notEmpty(this.state.selectedSubnatGeoTemp)
          ? countryMembers.filter(d => d.label === this.state.subnatCubeSelected.id) : [],
      Partner: filterCountry(partner),
      Product: isFinite(viztype.split(".")[0])
        ? viztype.split(".").map(d => productKeys[d]).filter(d => d) : [],
      Technology: ["cpc"].includes(cube)
        ? technologyData.filter(d => viztype.split(".").includes(d.value)) : [],
      Year: timeItems.length ? timeItems : [years[0]]
    };

    console.log(selectedItems);

    const timeIds = time.split(".").map(d => ({value: d * 1, title: d * 1}));
    const _startYear = isTimeSeriesChart ? timeIds[0] : this.state._startYear;
    const _endYear = isTimeSeriesChart ? timeIds[1] : this.state._endYear;

    if (["export", "import"].includes(flow)) prevState._flow = flowItems.find(d => d.value === flow);

    const selectedSubnatItems = {
      Geo: filterSubnat(this.state.subnatGeoItems, country),
      Product: filterSubnat(this.state.subnatProductItems, viztype),
      Time: filterSubnat(this.state.subnatTimeItems, time, "value", true)
    };

    const subnatKeys = ["Geo", "Product", "Time"].reduce((obj, d) => {
      const base = `selectedSubnat${d}`;
      if (!obj[base]) {
        const data = selectedSubnatItems[d];
        obj[base] = data;
        obj[`${base}Temp`] = data;
      }
      return obj;
    }, {});

    console.log("Hello", selectedItems);
    const countryKeys = Object.keys(selectedItems).reduce((obj, d) => {
      const base = `_selectedItems${d}`;
      if (!obj[base]) {
        const data = selectedItems[d];

        obj[base] = data;
        if (data.length > 0) {
          obj[`${base}Title`] = data;
        }
      }
      return obj;
    }, {});

    const nextState = {
      ...prevState,
      ...countryKeys,
      ...subnatKeys,
      _xAxis,
      _yAxis,
      _xAxisTitle: _xAxis,
      _yAxisTitle: _yAxis,
      _xAxisScale: _xAxis.scale || "Log",
      _yAxisScale: _yAxis.scale || "Log",
      _endYear,
      _startYear,
      _endYearTitle: _endYear,
      _startYearTitle: _startYear,
      startTime: _startYear,
      startTimeTemp: _startYear,
      endTime: _endYear,
      endTimeTemp: _endYear,
      permalinkCube: cube,
      subnatTimeLevelSelected: timeOptions[time.split(".")[0].length]
    };

    this.setState(nextState);
  }

  /**
   * Updates redux state with the cube selected
   * @param {String} cube - Cube variable used on permalink
   */
  handleCube = cube => {
    const isSubnat = cube.includes("subnational");
    const cubeSelected = isSubnat ? subnat[cube] : this.state._dataset;

    if (isSubnat) {
      this.props.updateCubeSelected({
        name: cubeSelected.cube,
        geoLevels: cubeSelected.geoLevels,
        productItems: this.state.subnatProductItems,
        productLevels: cubeSelected.productLevels,
        timeLevels: cubeSelected.timeLevels,
        timeItems: this.state.subnatTimeItems,
        geoItems: this.state.subnatGeoItems,
        currency: cubeSelected.currency
      });
    }
    else {
      this.props.updateCubeSelected({
        name: cubeSelected.cubeName,
        geoLevels: cubeSelected.geoLevels,
        productItems: this.state.product,
        productLevels: cubeSelected.productLevels,
        timeLevels: cubeSelected.timeLevels,
        timeItems: cubeSelected.timeItems,
        geoItems: this.props.countryMembers
      });
    }
    this.setState({loading: false});
  }

  render() {
    const {activeTab, cubeSelected, scrolled} = this.state;
    const {auth, location, routeParams, t} = this.props;
    const {timeItems} = cubeSelected;
    const {chart, cube, country, viztype, time} = routeParams;
    const redirect = `${location.basename}${location.pathname}`;

    /** Conditions */
    const isCountry = !["show", "all"].includes(country);
    const isProduct = isFinite(viztype.split(".")[0]);
    const isGeomap = ["geomap"].includes(chart);
    const isScatterChart = ["scatter"].includes(chart);
    const isNetworkChart = ["network"].includes(chart);
    const isTimeSeriesChart = ["line", "stacked"].includes(chart);
    const isSubnat = cube.includes("subnational");

    /** Panel Selector */
    let subnatSelector =
      subnat.cubeSelector.some(d => country.split(".").includes(d.id)) ||
      subnat.cubeSelector.some(d => this.state._selectedItemsCountry.map(d => d.label).includes(d.id)) ||
      isSubnat;
    const productSelector = isProduct && !isScatterChart;
    let countrySelector = isCountry && !isScatterChart || isSubnat;
    const partnerSelector = countrySelector && !productSelector && !isNetworkChart;
    if (productSelector) {
      if (isSubnat) countrySelector = false;
      subnatSelector = false;
    }

    const timeButtons = isSubnat ? this.state.subnatTimeItems : timeItems;
    const timeIndex = timeButtons.findIndex(d => d.value * 1 === time.split(".")[0] * 1);
    const prevTime = !isTimeSeriesChart ? timeButtons[timeIndex + 1] : undefined;
    const nextTime = !isTimeSeriesChart ? timeButtons[timeIndex - 1] : undefined;

    const subnatItem = subnat[cube] || {};
    const {productLevels} = subnatItem;
    let isSubnatPanel = notEmpty(this.state.selectedSubnatGeoTemp);
    const isSubnatCube = cube.includes("subnational");
    if (productSelector && isSubnatCube) isSubnatPanel = true;
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

    const subnatTimeItems = this.state.subnatTimeItems
      .filter(d => d.type === this.state.subnatTimeLevelSelected);

    const vbChartComponent = <VbChart
      permalink={this.state.permalink}
      routeParams={routeParams}
      router={this.props.router}
      selectedProducts={isSubnat
        ? this.state.selectedSubnatProduct
        : this.state._selectedItemsProductTitle}
      xAxis={this.state._xAxisTitle}
      xScale={this.state._xAxisScale}
      yAxis={this.state._yAxisTitle}
      yScale={this.state._yAxisScale}
      callback={d => {
        const query = permalinkDecode(d);
        const permalink = {permalink: d, activeTab: query.chart || "tree_map"};
        this.setState(
          permalink,
          () => this.updateFilterSelected(permalink)
        );
      }}
    />;

    if (this.props.isEmbed) {
      return <div className="vb-embed">
        {vbChartComponent}
      </div>;
    }

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
            {<div className="content">
              <VbTabs
                activeOption={this.props.location.pathname}
                activeTab={activeTab}
                callback={d => this.handleTabOption(d)}
                isSubnat={isSubnat}
                permalinkIds={this.getPermalinkIds()}
              />

              {isSubnat && productSelector && <div className="columns">
                <div className="column-1">
                  <div className="select-multi-section-wrapper">
                    <h4 className="title">{t("Product Subnat")}</h4>
                    <SelectMultiHierarchy
                      getColor={subnatItem.productColor}
                      getIcon={subnatItem.productIcon}
                      items={this.state.subnatProductItems}
                      levels={productLevels}
                      onItemSelect={item => {
                        const nextItems = this.state.selectedSubnatProductTemp.concat(item);
                        this.setState({selectedSubnatProductTemp: nextItems});
                      }}
                      onItemRemove={(evt, item) => {
                        // evt: MouseEvent<HTMLButtonElement>
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

              {
                countrySelector && !isGeomap ? <div className="columns">
                  <div className="column-1">
                    <OECMultiSelect
                      items={this.props.countryMembers}
                      itemType={"country"}
                      selectedItems={this.state._selectedItemsCountry}
                      title={t("Country")}
                      callback={d => this.handleItemMultiSelect("_selectedItemsCountry", d)}
                    />
                  </div>
                </div> : null}

              {subnatSelector && <div className="columns">
                <div className="column-1">
                  <div className="select-multi-section-wrapper">
                    <h4 className="title is-pro">{t("State/Province")}</h4>
                    <SelectMultiHierarchy
                      getIcon={this.state.subnatItem.geoIcon}
                      isPro={true}
                      isProProps={{
                        auth, redirect
                      }}
                      items={this.state.subnatGeography}
                      levels={this.state.subnatGeoLevels || []}
                      onItemSelect={item => {
                        const nextItems = this.state.selectedSubnatGeoTemp.concat(item);
                        const nextState = {selectedSubnatGeoTemp: nextItems};
                        if (this.state.selectedSubnatGeoTemp.length === 0) {
                          const levels = this.state.subnatTimeLevels;
                          const items = this.state.subnatTimeItems;
                          nextState.subnatTimeLevelSelected = levels[levels.length - 1];
                          nextState.selectedSubnatTimeTemp = [items[0]];
                        }
                        this.setState(nextState);
                      }}
                      onItemRemove={(evt, item) => {
                        // evt: MouseEvent<HTMLButtonElement>
                        // item: SelectedItem
                        evt.stopPropagation();
                        const nextItems = this.state.selectedSubnatGeoTemp.filter(i => i !== item);
                        this.setState({selectedSubnatGeoTemp: nextItems});
                      }}
                      onClear={() => {
                        this.setState({
                          selectedSubnatGeoTemp: []
                        });
                      }}
                      placeholder={t("Select a state/province...")}
                      selectedItems={this.state.selectedSubnatGeoTemp}
                    />
                  </div>
                </div>
              </div>}

              {partnerSelector && <div className="columns">
                <div className="column-1">
                  <OECMultiSelect
                    items={this.props.countryMembers}
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
                  items={this.props.wdiIndicators}
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
                  items={this.props.wdiIndicators}
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

              {isSubnatPanel ? <div className="columns">
                <div className="column-1">
                  <div className="select-multi-section-wrapper">
                    <h4 className="title">{t("Time Dimension")}</h4>
                    <OECButtonGroup
                      items={this.state.subnatTimeLevels}
                      selected={this.state.subnatTimeLevelSelected}
                      title={undefined}
                      callback={depth => {
                        const itemSelected = this.state.subnatTimeItems
                          .filter(d => d.type === depth);
                        this.setState({
                          subnatTimeLevelSelected: depth,
                          selectedSubnatTimeTemp: itemSelected[0] ? [itemSelected[0]] : []
                        });
                      }}
                    />
                  </div>
                </div>
                {!isTimeSeriesChart && <div className="column-1">
                  <OECMultiSelect
                    items={subnatTimeItems}
                    selectedItems={this.state.selectedSubnatTimeTemp}
                    title={t(this.state.subnatTimeLevelSelected)}
                    callback={d => this.handleItemMultiSelect("selectedSubnatTimeTemp", d)}
                  />
                </div>}
              </div> : null}

              {!isTimeSeriesChart && !isSubnatPanel && <div className="columns">
                <div className="column-1">
                  <OECMultiSelect
                    items={timeItems}
                    selectedItems={this.state._selectedItemsYear}
                    title={t("Year")}
                    callback={d => this.handleItemMultiSelect("_selectedItemsYear", d)}
                  />
                </div>
              </div>}

              {isTimeSeriesChart && !isSubnatPanel ? <div className="columns">
                <div className="column-1-2">
                  <SimpleSelect
                    items={timeItems}
                    title={t("Start Year")}
                    state="_startYear"
                    selectedItem={this.state._startYear}
                    callback={this.updateFilter}
                  />
                </div>
                <div className="column-1-2">
                  <SimpleSelect
                    items={timeItems}
                    title={t("End Year")}
                    state="_endYear"
                    selectedItem={this.state._endYear}
                    callback={this.updateFilter}
                  />
                </div>
              </div> : null}

              {isTimeSeriesChart && isSubnatPanel ? <div className="columns">
                <div className="column-1-2">
                  <SimpleSelect
                    items={subnatTimeItems}
                    title={t(`Start ${this.state.subnatTimeLevelSelected}`)}
                    state="startTimeTemp"
                    selectedItem={this.state.startTimeTemp}
                    callback={this.updateFilter}
                  />
                </div>
                <div className="column-1-2">
                  <SimpleSelect
                    items={subnatTimeItems}
                    title={t(`End ${this.state.subnatTimeLevelSelected}`)}
                    state="endTimeTemp"
                    selectedItem={this.state.endTimeTemp}
                    callback={this.updateFilter}
                  />
                </div>
              </div> : null}

              {/* Build Visualization Button */}
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
          {!this.state.loading || !this.props.loading ? <div className="vb-column">
            <div className="vb-title-wrapper">
              <div className="vb-title-button">
                {prevTime && <Button
                  icon="chevron-left"
                  minimal={true}
                  onClick={() => {
                    const nextState = {};
                    if (isSubnat) nextState.selectedSubnatTimeTemp = [prevTime];
                    else nextState._selectedItemsYear = [prevTime];
                    this.setState(nextState, () => this.buildViz());
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
                    const nextState = {};
                    if (isSubnat) nextState.selectedSubnatTimeTemp = [nextTime];
                    else nextState._selectedItemsYear = [nextTime];
                    this.setState(nextState, () => this.buildViz());
                  }}
                  rightIcon="chevron-right"
                  text={nextTime.title}
                />}
              </div>
            </div>
            {vbChartComponent}
          </div> : <div className="vb-column">
            <LoadingChart />
          </div>}
        </div>
      </div>
      <Footer />
    </div>;
  }
}


const mapDispatchToProps = dispatch => ({
  // dispatching plain actions
  addCountryMembers: payload => dispatch({type: "VB_UPDATE_COUNTRY_MEMBERS", payload}),
  addWdiIndicators: payload => dispatch({type: "VB_UPDATE_WDI", payload}),
  updateCubeSelected: payload => dispatch({type: "VB_UPDATE_CUBE_SELECTED", payload})
});

/** */
function mapStateToProps(state) {
  const {countryMembers, loading, wdiIndicators} = state.vizbuilder;

  return {
    auth: state.auth,
    countryMembers,
    loading,
    wdiIndicators
  };
}

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(Vizbuilder));
