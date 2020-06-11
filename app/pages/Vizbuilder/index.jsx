import React from "react";
import Helmet from "react-helmet";
import axios from "axios";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import classnames from "classnames";
// Components
import Footer from "components/Footer";
import Loading from "components/Loading";
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
import {getRandom} from "helpers/utils";
import {getVbTitle} from "helpers/vbTitle";
import {queryParser} from "helpers/formatters";
import {countryItems, hsProductItems} from "helpers/random";

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
export function createItems(data, levels, iconUrl, iconFormat = "svg") {
  const parentId = levels[0];
  return data.reduce((obj, d) => {
    levels.forEach(type => {
      const id = d[`${type} ID`];
      if (!(id in obj)) {
        const sId = d[`${parentId} ID`];
        obj[id] = {
          color: colors[parentId][sId],
          icon: `${iconUrl}${sId}.${iconFormat}`,
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

    // Gets cube selected in the permalink
    const cubeSelected = datasets.find(d => d.value === cube) || subnat[cube] || datasets[0];

    this.state = {
      activeTab: params ? params.chart : "tree_map",
      // controls: params ? params.cube.includes("subnational") : true,
      product: [],
      productLevel: cubeSelected.productLevel || cubeSelected.productLevels[cubeSelected.productLevels.length - 1],
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
      _startYear: {title: 2013, value: 2013},
      _startYearTitle: {title: 2013, value: 2013},
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

    const isGeoWildCard = args[0] === "wildcard";
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

    const selectedGeo = isGeoWildCard ? [] : selectedItems(itemsGeo, geoParam, "selectedSubnatGeo");
    const selectedProduct = selectedItems(itemsProduct, filterParam, "selectedSubnatProduct");
    const subnatTimeItems = itemsTime
      .map(d => ({value: d.id, title: d.name, type: d.type}))
      .sort((a, b) => b.value - a.value);

    const filteredTimeItems = subnatTimeItems
      .filter(d => timeParam.split(".").includes(d.value.toString()));

    const nextState = {
      subnatItem,
      subnatGeography: dataGeo.data,
      subnatGeoItems: itemsGeo,
      subnatTimeItems,
      subnatGeoLevels: geoLevels,
      subnatProductLevels: productLevels,
      subnatTimeLevels: timeLevels,
      subnatProductItems: itemsProduct,
      selectedSubnatTimeTemp: filteredTimeItems,
      // _dataset,
      ...selectedGeo,
      ...selectedProduct
    };

    if (isGeoWildCard) nextState.selectedSubnatGeo = this.state.selectedSubnatGeo;

    this.setState(nextState);
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
    const {cube, viztype} = routeParams;

    const prefixIcon = cube === "sitc" ? "/images/icons/sitc/sitc_" : "/images/icons/hs/hs_";
    const iconFormat = cube === "sitc" ? "png" : "svg";

    const queryString = queryParser(params);

    const data = await axios.get(`/olap-proxy/data?${queryString}`)
      .then(resp => resp.data);

    const productData = data.data;
    const productKeys = createItems(productData, levels, prefixIcon, iconFormat);
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
    const {routeParams} = this.props;
    const {cube} = routeParams;
    const cubeName = _dataset.cubeName || _dataset.cube;

    // Gets members of HS products, Countries and Technologies
    axios.all([
      axios.get(`/olap-proxy/data?cube=${cubeName}&drilldowns=${productLevel}&measures=Trade+Value&parents=true&sparse=false`),
      axios.get("/members/country.json"),
      axios.get("/olap-proxy/data?cube=indicators_i_wdi_a&drilldowns=Indicator&measures=Measure&parents=false&sparse=false")
    ]).then(axios.spread((...resp) => {
      const productData = resp[0].data.data;
      const {productLevels} = _dataset;
      const prefixIcon = cube === "sitc" ? "/images/icons/sitc/sitc_" : "/images/icons/hs/hs_";
      const iconFormat = cube === "sitc" ? "png" : "svg";
      const productKeys = createItems(productData, productLevels, prefixIcon, iconFormat);
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

  componentWillMount = () => {
    if (typeof window !== "undefined" && this.props.isEmbed) {
      document.querySelector("html").style.backgroundColor = "transparent";
      document.body.style.backgroundColor = "transparent";
    }
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
      const {cubeName, productLevel, productLevels} = this.state.cubeSelected;
      const level = productLevel ||
        productLevels[productLevels.length - 1] || "HS6";
      this.fetchProductNames(cubeName, level, productLevels);
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

  safeChangeHandler = (stateKey, item) => {
    const items = this.state[stateKey];
    const validItems = items.filter(d => d.type === item.type && d.id !== item.id);
    const nextItems = validItems.concat(item);
    this.setState({[stateKey]: nextItems});
  }

  /**
   * @description Creates a visualization after to click "Build Visualization" button
   */
  buildViz = (isTimeButton = false) => {
    this.setState({loading: true});
    const {lng, router, routeParams} = this.props;
    const {chart, cube, flow, country, partner, viztype} = routeParams;
    const {
      _dataset,
      _endYear,
      _flow,
      _selectedItemsCountry,
      _selectedItemsPartner,
      _selectedItemsProduct,
      _selectedItemsYear,
      _startYear,
      _xAxis,
      _yAxis
    } = this.state;

    let countryIds = notEmpty(_selectedItemsCountry)
      ? parseIdsToURL(_selectedItemsCountry, "label")
      : ["show", "all"].includes(country) ? country : "all";
    let partnerIds = notEmpty(_selectedItemsPartner)
      ? parseIdsToURL(_selectedItemsPartner, "label")
      : ["show", "all"].includes(partner) ? partner : "all";

    const isTradeFilter = notEmpty(_selectedItemsProduct);

    let filterIds = isTradeFilter
      ? parseIdsToURL(_selectedItemsProduct)
      : viztype;

    let dataset = _dataset.value || _dataset.id;
    let flowSelected = flow === "show" ? flow : _flow.value;

    /** Creates permalink config for scatter plot */
    if (chart === "scatter") {
      flowSelected = _xAxis.value;
      countryIds = _yAxis.value;
      partnerIds = "all";
      filterIds = "all";
    }

    const isTimeSeriesChart = ["line", "stacked"].includes(chart);
    let timeIds = isTimeSeriesChart
      ? `${_startYear.value}.${_endYear.value}`
      : dataset.includes("subnational")
        ? parseIdsToURL(this.state.selectedSubnatTimeTemp, "value")
        : _selectedItemsYear.map(d => d.value).sort((a, b) => a > b ? 1 : -1).join(".");

    /** Creates permalink config for subnational plot */
    const notEmptySubnatGeo = notEmpty(this.state.selectedSubnatGeoTemp);
    if (
      notEmptySubnatGeo ||
      cube.includes("subnational") && notEmpty(this.state.selectedSubnatProductTemp) && notEmptySubnatGeo
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

    const permalinkItems = isTimeButton
      ? [
        lng,
        "visualize",
        chart,
        cube,
        flow,
        country,
        partner,
        viztype,
        timeIds
      ] : [
        lng,
        "visualize",
        chart,
        dataset,
        flowSelected,
        countryIds,
        partnerIds,
        filterIds,
        timeIds
      ];
    const permalink = permalinkEncode(permalinkItems);
    this.updateFilterSelected({permalink, cubeSelected: _dataset});
    router.push(permalink);
  }

  /** Generates the permalink used in each tab */
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
    const {chart, country, cube, partner} = routeParams;

    const isCountry = new RegExp(/^(?!all).*$/).test(country);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isTimeSeriesChart = new RegExp(/(stacked|line)/).test(chart);
    const isWorld = !isCountry && !isPartner;

    const countryRandom = getRandom(countryItems);
    let partnerRandom = getRandom(countryItems);
    while (countryRandom === partnerRandom) {
      partnerRandom = getRandom(countryItems);
    }

    let countryIds = notEmpty(_selectedItemsCountryTitle)
      ? parseIdsToURL(_selectedItemsCountryTitle, "label")
      : isWorld ? "all" : countryRandom;
    let partnerIds = notEmpty(_selectedItemsPartnerTitle)
      ? parseIdsToURL(_selectedItemsPartnerTitle, "label")
      : isWorld && !notEmpty(_selectedItemsCountryTitle) ? "all" : partnerRandom;

    const isTechnologyFilter = notEmpty(_selectedItemsTechnologyTitle);
    const isTradeFilter = notEmpty(_selectedItemsProductTitle);

    let filterIds = isTechnologyFilter || isTradeFilter
      ? isTechnologyFilter
        ? parseIdsToURL(_selectedItemsTechnologyTitle, "value")
        : parseIdsToURL(_selectedItemsProductTitle)
      : getRandom(hsProductItems);

    let dataset = _dataset.value || _dataset.id;
    const flow = _flow.value;

    const timeSelected = dataset.includes("subnational")
      ? this.state.selectedSubnatTimeTemp
        .map(d => d.value)
        .sort((a, b) => a > b ? 1 : -1)
      : _selectedItemsYearTitle
        .map(d => d.value)
        .sort((a, b) => a > b ? 1 : -1);

    // Select time filter
    let timeIds = timeSelected.join(".");
    if (isTimeSeriesChart) timeIds = timeSelected[timeSelected.length - 1];

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
      const geoId = getRandom(subnatGeoItems.map(d => d.id));
      const productId = getRandom(subnatProductItems.map(d => d.id));

      const isSubnatCountrySelected = cube.slice(-3) === country;
      countryIds = isSubnatCountrySelected
        ? country
        : notEmpty(selectedSubnatGeo) ? parseIdsToURL(selectedSubnatGeo, "id") : geoId;
      dataset = cube;
      timeIds = selectedSubnatTimeTemp
        .map(d => d.value)
        .sort((a, b) => a > b ? 1 : -1)
        .join(".");
      timePlot = `${startTime.value}.${endTime.value}`;
      filterIds = notEmpty(selectedSubnatProduct) ? parseIdsToURL(selectedSubnatProduct, "id") : productId;
      if (notEmpty(_selectedItemsPartnerTitle)) partnerIds = partnerRandom || "deu";
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
    const nextState = {[key]: d};
    let callback = undefined;
    if (
      key === "_selectedItemsCountry" &&
      subnat.cubeSelector.map(h => h.id).includes(d[d.length - 1].label)
    ) {
      const cube = subnat.cubeSelector.find(h => d[d.length - 1].label === h.id);
      nextState.subnatCubeSelected = cube;
      nextState.selectedSubnatGeoTemp = [];
      // nextState.selectedSubnatGeo = [];
      callback = () => this.fetchSubnationalData(cube.cube, "wildcard");
    }

    this.setState(nextState, callback);
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
    const isSubnat = cube.includes("subnational");

    const _xAxis = wdiIndicators.find(d => d.value === flow) || wdiIndicators.find(d => d.value === "OEC.ECI");
    const _yAxis = wdiIndicators.find(d => d.value === country) || wdiIndicators.find(d => d.value === "NY.GDP.MKTP.CD");
    // Updates config of axis
    this.props.updateAxisConfig({xConfig: Object.assign(_xAxis, {selected: _xAxis.scale || "Log"})});
    this.props.updateAxisConfig({yConfig: Object.assign(_yAxis, {selected: _yAxis.scale || "Log"})});

    // Get selected countries
    const filterCountry = type => countryMembers.filter(d => type.split(".").includes(d.label));
    const countryItems = filterCountry(country);
    const years = this.state._dataset.timeItems || this.props.cubeSelected.timeItems;
    const timeItems = years.filter(d => time.split(".").includes(d.value.toString()));

    const selectedItems = {
      Country: countryItems.length
        ? countryItems
        : notEmpty(this.state.selectedSubnatGeoTemp) || isSubnat
          ? countryMembers.filter(d => d.label === this.state.subnatCubeSelected.id) : [],
      Partner: filterCountry(partner),
      Product: isFinite(viztype.split(".")[0])
        ? viztype.split(".").map(d => productKeys[d]).filter(d => d) : [],
      Technology: ["cpc"].includes(cube)
        ? technologyData.filter(d => viztype.split(".").includes(d.value)) : [],
      Year: timeItems.length ? timeItems : [years[0]]
    };

    // TODO improve this logic
    const timeItemsV2 = isSubnat ? this.state.subnatTimeItems : years;
    const timeItemsSelected = [].concat(timeItemsV2).reverse().filter(d => time.split(".").includes(d.value.toString()));
    const _startYear = isTimeSeriesChart && timeItemsSelected[0]
      ? timeItemsSelected[0] : isSubnat ? timeItemsV2[0] || {} : this.state._startYear;
    const _endYear = isTimeSeriesChart && timeItemsSelected[1]
      ? timeItemsSelected[1] :  isSubnat ? timeItemsV2[3] || {} : this.state._endYear;

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
    const {routeParams} = this.props;
    const {chart, time} = routeParams;
    const isSubnat = cube.includes("subnational");

    const cubeSelected = isSubnat ? subnat[cube] : this.state._dataset;
    const timeItems = isSubnat ? this.state.subnatTimeItems : cubeSelected.timeItems;
    const cubeName = this.props.cubeSelected.name;

    if (isSubnat && cubeName !== cubeSelected.cube) {
      this.props.updateCubeSelected({
        name: cubeSelected.cube,
        title: cubeSelected.name,
        measure: cubeSelected.measure,
        geoLevels: cubeSelected.geoLevels,
        productItems: this.state.subnatProductItems,
        productLevels: cubeSelected.productLevels,
        timeLevels: cubeSelected.timeLevels,
        timeItems,
        geoItems: this.state.subnatGeoItems,
        currency: cubeSelected.currency
      });
    }
    else if (!isSubnat && cubeName !== cubeSelected.cubeName) {
      this.props.updateCubeSelected({
        name: cubeSelected.cubeName,
        title: cubeSelected.title,
        measure: cubeSelected.measure,
        geoLevels: cubeSelected.geoLevels,
        productItems: this.state.product,
        productLevels: cubeSelected.productLevels,
        timeLevels: cubeSelected.timeLevels,
        timeItems,
        geoItems: this.props.countryMembers
      });
    }

    const isTimeSeriesChart = ["line", "stacked"].includes(chart);
    const timeItemsSelected = [].concat(timeItems)
      .reverse().filter(d => time.split(".").includes(d.value.toString()));
    const _startYear = isTimeSeriesChart
      ? timeItemsSelected[0] : isSubnat ? timeItems[3] || {} : this.state._startYear;
    const _endYear = isTimeSeriesChart && timeItemsSelected[1]
      ? timeItemsSelected[1] : isSubnat ? timeItems[0] || {} : this.state._endYear;

    const nextState = {
      loading: false,
      _endYear,
      _startYear,
      _endYearTitle: _endYear,
      _startYearTitle: _startYear,
      startTime: _startYear,
      startTimeTemp: _startYear,
      endTime: _endYear,
      endTimeTemp: _endYear
    };

    this.setState(nextState);
  }

  render() {
    const {activeTab, cubeSelected, scrolled} = this.state;
    const {auth, location, routeParams, t} = this.props;
    const {timeItems} = cubeSelected;
    const {chart, cube, country, flow, partner, viztype, time} = routeParams;
    const redirect = `${location.basename}${location.pathname}`;

    /** Conditions */
    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isProduct = isFinite(viztype.split(".")[0]);
    const isGeomap = ["geomap"].includes(chart);
    const isScatterChart = ["scatter"].includes(chart);
    const isNetworkChart = ["network"].includes(chart);
    const isTimeSeriesChart = ["line", "stacked"].includes(chart);
    const isSubnat = cube.includes("subnational");
    const isWorld = !isCountry && !isPartner || country === "wld";
    const isTradeBalanceChart = flow === "show";

    /** Panel Selector */
    const subnatSelector =
      subnat.cubeSelector.some(d => country.split(".").includes(d.id)) ||
      subnat.cubeSelector.some(d => this.state._selectedItemsCountry.map(d => d.label).includes(d.id)) ||
      isSubnat;
    const productSelector = isProduct && !isScatterChart;
    const countrySelector = isCountry && !isScatterChart || isSubnat;
    const partnerSelector = countrySelector && !productSelector && !isNetworkChart;
    if (productSelector) {
      // if (isSubnat) countrySelector = false;
      // subnatSelector = false;
    }

    const subnatTimeItems = this.state.subnatTimeItems
      .filter(d => d.type === this.state.subnatTimeLevelSelected);

    const timeButtons = isSubnat ? subnatTimeItems : timeItems;
    const timeIndex = timeButtons.findIndex(d => d.value * 1 === time.split(".")[0] * 1);
    const prevTime = !isTimeSeriesChart ? timeButtons[timeIndex + 1] : undefined;
    const nextTime = !isTimeSeriesChart ? timeButtons[timeIndex - 1] : undefined;

    const subnatItem = subnat[cube] || {};
    const {productLevels} = subnatItem;
    const isSubnatPanel = notEmpty(this.state.selectedSubnatGeoTemp);
    const isSubnatCube = cube.includes("subnational");
    let isSubnatPanelProduct = false;
    if (productSelector && isSubnatCube) isSubnatPanelProduct = true;
    const isSubnatTitle = subnat[cube];
    const isSubnatCountrySelected = cube.slice(-3) === country;

    const {vbTitle, vbParams} = getVbTitle(
      {
        geo: isSubnatTitle
          ? isSubnatCountrySelected
            ? this.state._selectedItemsCountryTitle
            : this.state.selectedSubnatGeo
          : this.state._selectedItemsCountryTitle,
        geoPartner: this.state._selectedItemsPartnerTitle,
        product: isSubnatTitle ? this.state.selectedSubnatProduct : this.state._selectedItemsProductTitle,
        technology: this.state._selectedItemsTechnologyTitle,
        isWorld,
        datasetName: this.props.cubeSelected.title
      },
      {
        x: this.props.xConfig,
        y: this.props.yConfig
      },
      routeParams
    );

    const vbChartComponent = <VbChart
      isEmbed={this.props.isEmbed}
      permalink={this.state.permalink}
      routeParams={routeParams}
      router={this.props.router}
      selectedProducts={isSubnat
        ? this.state.selectedSubnatProduct
        : this.state._selectedItemsProductTitle}
      callback={d => {
        const query = permalinkDecode(d);
        const permalink = {permalink: d, activeTab: query.chart || "tree_map"};
        this.setState(
          permalink,
          () => this.updateFilterSelected(permalink)
        );
      }}
    />;

    const vbInternalTitle = t(vbTitle, Object.assign(vbParams, {interpolation: {escapeValue: false}}));
    const vbHelmet = <Helmet title={vbInternalTitle} />;

    const subnatDataset = subnat.subnational_chn;
    const isSubnatDatasetSelected = this.state._dataset.value.includes("subnational");

    if (this.props.isEmbed) {
      return <div className="vb-embed">
        {vbHelmet}
        <VbTitle
          params={vbParams}
          title={vbTitle}
        />
        {vbChartComponent}
      </div>;
    }

    return <div id="vizbuilder">
      {vbHelmet}
      <OECNavbar
        className={scrolled ? "background" : ""}
        title={vbInternalTitle}
        scrolled={scrolled}
      />

      <div className="vb-profile">
        <div className="vb-columns">
          <div
            className="vb-column aside"
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
                  <div className="selector select-multi-section-wrapper">
                    <h4 className="title">{t("Product")}</h4>
                    <SelectMultiHierarchy
                      getColor={subnatItem.productColor}
                      getIcon={subnatItem.productIcon}
                      items={this.state.subnatProductItems}
                      levels={productLevels}
                      onItemSelect={item => this.safeChangeHandler("selectedSubnatProductTemp", item)}
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
                  <div className="selector select-multi-section-wrapper">
                    <h4 className="title">{t("Product")}</h4>
                    <SelectMultiHierarchy
                      getColor={cube === "sitc"
                        ? d => colors.Category[d["Category ID"]]
                        : d => colors.Section[d["Section ID"]]}
                      getIcon={cube === "sitc"
                        ? d => `/images/icons/sitc/sitc_${d["Category ID"]}.png`
                        : d => `/images/icons/hs/hs_${d["Section ID"]}.svg`}
                      items={this.state.product}
                      levels={chart === "rings" ? ["HS4"] : this.state._dataset.productLevels}
                      onItemSelect={item => this.safeChangeHandler("_selectedItemsProduct", item)}
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

              {countrySelector || isWorld ? <div className="columns">
                <div className="column-1">
                  <OECMultiSelect
                    items={this.props.countryMembers}
                    itemType={"country"}
                    selectedItems={this.state._selectedItemsCountry}
                    placeholder={t("Select a country...")}
                    title={t("Country")}
                    onClear={d => this.setState({_selectedItemsCountry: d})}
                    callback={d => this.handleItemMultiSelect("_selectedItemsCountry", d)}
                  />
                </div>
              </div> : null}

              {subnatSelector && <div className="columns">
                <div className="column-1">
                  <div className="selector select-multi-section-wrapper">
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
                        const items = this.state.selectedSubnatGeoTemp;
                        const validItems = items.filter(d => d.type === item.type && d.id !== item.id);
                        const nextItems = validItems.concat(item);
                        const nextState = {selectedSubnatGeoTemp: nextItems};
                        if (this.state.selectedSubnatGeoTemp.length === 0) {
                          const levels = this.state.subnatTimeLevels;
                          const items = this.state.subnatTimeItems;
                          nextState.subnatTimeLevelSelected = levels[levels.length - 1];
                          nextState.selectedSubnatTimeTemp = [items[0]];
                          nextState.endTimeTemp = items[0];
                          nextState.startTimeTemp = items[3];
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

              {partnerSelector && !isGeomap && <div className="columns">
                <div className="column-1">
                  <OECMultiSelect
                    items={this.props.countryMembers}
                    itemType="country"
                    placeholder={t("Select a partner...")}
                    selectedItems={this.state._selectedItemsPartner}
                    title={t("Partner")}
                    callback={d => this.handleItemMultiSelect("_selectedItemsPartner", d)}
                    onClear={d => this.setState({_selectedItemsPartner: d})}
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
                  callbackButton={(key, value) => {
                    this.props.updateAxisConfig({xConfig: Object.assign({selected: value})});
                    this.setState({[key]: value});
                  }}
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
                  callbackButton={(key, value) => {
                    this.props.updateAxisConfig({yConfig: Object.assign({selected: value})});
                    this.setState({[key]: value});
                  }}
                />
              </div>}

              <div className="columns">
                {!isScatterChart && !isSubnatPanel && <div className="column-1-2">
                  <SimpleSelect
                    items={subnatSelector
                      ? [subnatDataset].concat(datasets)
                      : datasets}
                    title={t("Dataset")}
                    isPro={subnatSelector}
                    state="_dataset"
                    selectedItem={this.state._dataset}
                    callback={(key, value) => {
                      const cubeSelected = value;
                      const isSubnat = cubeSelected.value.includes("subnational");
                      const timeItems = isSubnat ? this.state.subnatTimeItems : cubeSelected.timeItems;
                      if (isSubnat) {
                        this.props.updateCubeSelectedTemp({
                          name: cubeSelected.cube,
                          measure: cubeSelected.measure,
                          geoLevels: cubeSelected.geoLevels,
                          productItems: this.state.subnatProductItems,
                          productLevels: cubeSelected.productLevels,
                          timeLevels: cubeSelected.timeLevels,
                          timeItems,
                          geoItems: this.state.subnatGeoItems,
                          currency: cubeSelected.currency
                        });
                        this.setState({
                          subnatTimeLevelSelected: timeItems[0].type,
                          selectedSubnatTimeTemp: [timeItems[0]],
                          startTimeTemp: timeItems[1],
                          endTimeTemp: timeItems[0]
                        });
                      }
                      else {
                        this.setState({
                          _selectedItemsYear: [timeItems[0]],
                          _startYear: timeItems[1],
                          _endYear: timeItems[0]
                        });
                        this.props.updateCubeSelectedTemp({
                          name: cubeSelected.cubeName,
                          measure: cubeSelected.measure,
                          geoLevels: cubeSelected.geoLevels,
                          productItems: this.state.product,
                          productLevels: cubeSelected.productLevels,
                          timeLevels: cubeSelected.timeLevels,
                          timeItems,
                          geoItems: this.props.countryMembers
                        });
                      }
                      this.updateFilter(key, value);
                    }}
                  />
                </div>}

                {!isScatterChart && !isTradeBalanceChart && <div className="column-1-2">
                  <SimpleSelect
                    items={flowItems}
                    title={t("Trade Flow")}
                    state="_flow"
                    selectedItem={this.state._flow}
                    callback={this.updateFilter}
                  />
                </div>}

              </div>
              {/* isSubnatPanel TODO */}
              {isSubnatDatasetSelected ? <div className="columns">
                <div className="column-1">
                  <div className="selector select-multi-section-wrapper">
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
                          startTimeTemp: itemSelected[1],
                          endTimeTemp: itemSelected[0],
                          selectedSubnatTimeTemp: itemSelected[0] ? [itemSelected[0]] : []
                        });
                      }}
                    />
                  </div>
                </div>
                {/* subnatTimeItems */}
                {!isTimeSeriesChart && <div className="column-1">
                  <OECMultiSelect
                    items={subnatTimeItems}
                    selectedItems={this.state.selectedSubnatTimeTemp}
                    title={t(this.state.subnatTimeLevelSelected)}
                    callback={d => this.handleItemMultiSelect("selectedSubnatTimeTemp", d)}
                    onClear={() => this.setState({selectedSubnatTimeTemp: subnatTimeItems[0]})}
                  />
                </div>}
              </div> : null}

              {!isTimeSeriesChart && !isSubnatDatasetSelected && <div className="columns">
                <div className="column-1">
                  {/* MultiSelect Year used on non-subnational data */}
                  <OECMultiSelect
                    items={this.props.cubeSelectedTemp.timeItems}
                    selectedItems={this.state._selectedItemsYear}
                    title={t("Year")}
                    callback={d => this.handleItemMultiSelect("_selectedItemsYear", d)}
                  />
                </div>
              </div>}

              {/* TODO isSubnatPanel */}
              {isTimeSeriesChart && !isSubnatDatasetSelected ? <div className="columns">
                <div className="column-1-2">
                  <SimpleSelect
                    items={this.props.cubeSelectedTemp.timeItems}
                    title={t("Start Year")}
                    state="_startYear"
                    selectedItem={this.state._startYear}
                    callback={this.updateFilter}
                  />
                </div>
                <div className="column-1-2">
                  <SimpleSelect
                    items={this.props.cubeSelectedTemp.timeItems}
                    title={t("End Year")}
                    state="_endYear"
                    selectedItem={this.state._endYear}
                    callback={this.updateFilter}
                  />
                </div>
              </div> : null}

              {/* TODO isSubnatPanel */}
              {isTimeSeriesChart && isSubnatDatasetSelected ? <div className="columns">
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
                    onClick={() => this.buildViz()}
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
                    this.setState(nextState, () => this.buildViz(true));
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
                    this.setState(nextState, () => this.buildViz(true));
                  }}
                  rightIcon="chevron-right"
                  text={nextTime.title}
                />}
              </div>
            </div>
            {vbChartComponent}
          </div> : <div className={classnames("vb-column", {"loading-embed": this.props.isEmbed})}>
            <Loading isDark={this.props.isEmbed} />
          </div>}
        </div>
      </div>
      <Footer />
    </div>;
  }
}


const mapDispatchToProps = dispatch => ({
  addCountryMembers: payload => dispatch({type: "VB_UPDATE_COUNTRY_MEMBERS", payload}),
  addWdiIndicators: payload => dispatch({type: "VB_UPDATE_WDI", payload}),
  updateCubeSelected: payload => dispatch({type: "VB_UPDATE_CUBE_SELECTED", payload}),
  updateCubeSelectedTemp: payload => dispatch({type: "VB_UPDATE_CUBE_SELECTED_TEMP", payload}),
  updateAxisConfig: payload => dispatch({type: "VB_UPDATE_AXIS_CONFIG", payload})
});

/** */
function mapStateToProps(state) {
  const {axisConfig, countryMembers, cubeSelected, cubeSelectedTemp, data, loading, wdiIndicators} = state.vizbuilder;
  const {xConfig, yConfig} = axisConfig;
  return {
    auth: state.auth,
    data,
    xConfig,
    yConfig,
    countryMembers,
    cubeSelected,
    cubeSelectedTemp,
    loading,
    wdiIndicators
  };
}

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(Vizbuilder));
