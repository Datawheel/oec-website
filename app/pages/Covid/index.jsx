import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import Helmet from "react-helmet";
import axios from "axios";
import {LinePlot} from "d3plus-react";
import {formatAbbreviate} from "d3plus-format";

import style from "style.yml";

import CovidLegend from "components/CovidLegend";
import Loading from "components/Loading";
import OECNavbar from "components/OECNavbar";
import OECMultiSelect from "components/OECMultiSelect";
import SelectMultiHierarchy from "components/SelectMultiHierarchy";
import SimpleSelect from "components/SimpleSelect";
import Footer from "components/Footer";
import VbDownload from "components/VbDownload";

import "./Covid.css";

// Helpers
import colors from "helpers/colors";
import {currencySign, monthNames, productColor, productIcon, productLevels, spinner, subnatCubeMembers} from "helpers/covid";

const BASE = "/olap-proxy/data";
const availableFlows = [
  {
    value: 2,
    title: "Exports"
  },
  {
    value: 1,
    title: "Imports"
  }
];

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableYears: [2020],
      availableDates: [],
      countryMembers: subnatCubeMembers,
      data: [],
      flow: "Exports",
      flowId: 2,
      highlightCountries: ["nausa", "aschn"],
      loading: true,
      location: null,
      _selectedItemsCountry: Object.keys(this.props.location.query.length > 0) ? this.props.location.query["Selected Country"] ? this.props.location.query["Selected Country"] === "all" ? subnatCubeMembers : subnatCubeMembers.filter(item => this.props.location.query["Selected Country"].split(",").includes(item.value)) : subnatCubeMembers : subnatCubeMembers,
      _availableFlows: availableFlows,
      _selectedFlow: Object.keys(this.props.location.query.length > 0) ? this.props.location.query["Trade Flow"] ? availableFlows.find(d => d.value * 1 === this.props.location.query["Trade Flow"] * 1) : {value: 2, title: "Exports"} : {value: 2, title: "Exports"},
      _startDate: {
        value: 202001,
        title: "January 2020"
      },
      _ticks: [],
      productCuts: [],
      productOptions: [],
      queryProduct: "",
      _style: "",
      width: 0
    };

    this.highlightCountry = this.highlightCountry.bind(this);
  }

  componentDidMount() {
    const {query} = this.props.location;
    const {_availableFlows} = this.state;
    let {_selectedItemsCountry, flow, flowId, highlightCountries, _selectedFlow, _startDate} = this.state;

    let queryProduct = [];

    if (Object.keys(query).length !== 0) {
      const queryCountries = query["Selected Country"] ? query["Selected Country"].split(",") : false;
      const queryHighlight = query["Highlight Country"] ? query["Highlight Country"].split(",") : false;
      const queryFlow = query["Trade Flow"] ? query["Trade Flow"] : false;
      const queryDate = query.Time ? query.Time < 201801 ? 201801 : query.Time * 1 : false;
      queryProduct = Object.keys(query).map(d => d).find(key => productLevels.includes(key)) || [];

      if (queryProduct.length > 0) {
        queryProduct = [
          {
            type: queryProduct,
            id: query[queryProduct]
          }
        ];
      }

      _selectedItemsCountry = queryCountries ? queryCountries[0] === "all" ? subnatCubeMembers : subnatCubeMembers.filter(item => queryCountries.includes(item.value)) : subnatCubeMembers;
      highlightCountries =  queryHighlight ? queryHighlight[0] === "all" ? subnatCubeMembers.map(d => d.value) : queryHighlight : highlightCountries;
      flowId = queryFlow ? [1, 2].includes(queryFlow * 1) ? queryFlow * 1 : 2 : flowId;
      _selectedFlow = queryFlow ? _availableFlows.find(flow => flow.value * 1 === queryFlow * 1) : _selectedFlow;
      flow = queryFlow ? _availableFlows.find(item => item.value * 1 === queryFlow * 1).title : flow;
      _startDate = queryDate ? this.createDates(queryDate) : _startDate;
    }

    this.setState({
      _selectedFlow,
      _selectedItemsCountry,
      _startDate,
      highlightCountries,
      flow,
      flowId,
      width: window.innerWidth
    });
    this.setState({location: window.location});

    this.fetchData(_selectedItemsCountry, flowId, _startDate.value, queryProduct, highlightCountries);
  }

  buildLink = () => {
    const {flowId, _startDate, _selectedItemsCountry, highlightCountries, productCuts} = this.state;

    const path = this.props.location.pathname;

    const queryDict = {
      "Trade Flow": flowId,
      "Time": _startDate.value,
      "Selected Country": _selectedItemsCountry ? _selectedItemsCountry.length === subnatCubeMembers.length ? "all" : _selectedItemsCountry.map(d => d.value) : "all",
      "Highlight Country": _selectedItemsCountry ? _selectedItemsCountry.length === highlightCountries.length ? "all" : highlightCountries : "all"
    };

    if (productCuts && productCuts.length > 0) {
      Object.assign(queryDict, {[productCuts[0].type]: productCuts[0].id});
    }

    const queryString = Object.keys(queryDict).map(key => `${key}=${queryDict[key]}`).join("&");

    return `/${path}?${queryString}`;
  }

  changeStyle = () => {
    let {_style} = this.state;

    _style = _style === "is-light" ? "" : "is-light";

    this.setState({
      _style
    });
  }

  createDates = date => {
    let monthId = date.toString().slice(-2) * 1 - 1;

    monthId = monthId >= 11 ? 11 : monthId;

    const _monthId = `0${monthId + 1}`.slice(-2);

    const month = monthNames[monthId];
    const year = date.toString().slice(0, 4) * 1;

    const _date = `${year}${_monthId  }` * 1;

    const formattedDate = {
      value: _date,
      title: `${month} ${year}`
    };

    return formattedDate;
  }

  fetchData = (urls, flowId, dateId, productCuts, countries) => {
    let {availableDates, availableYears, productOptions} = this.state;
    let _productCut = [];

    if (productCuts && productCuts.length > 0) {
      urls = urls.filter(d => d.product_category === "hs" && d.avialablesDepth.includes(productCuts[0].type));
      _productCut = urls.map(d => `&${d.depthDict[productCuts[0].type] || productCuts[0].type}=${productCuts[0].id}`);
    }

    const promisesList = urls
      .map((url, i) => {

        const timeDrilldown = url.cube === "trade_s_chl_d_hs" ? "Month" : "Time";

        return _productCut.length > 0
          ? `${BASE}?cube=${url.cube}&drilldowns=${timeDrilldown}&measures=Trade+Value&Trade+Flow=${flowId}&parents=true&sparse=false${_productCut[i]}&q=`
          : `${BASE}?cube=${url.cube}&drilldowns=${timeDrilldown}&measures=Trade+Value&Trade+Flow=${flowId}&parents=true&sparse=false`;
      });

    if (this.state.loading) {
      promisesList.push("/api/productsList");
    }

    const allPromises = [];

    Promise.all(promisesList.map(url => axios.get(url))).then(responses => {
      responses.map((res, j) => {
        let _data = res.data.data;
        let i = j;

        if (j !== responses.length - 1) {
          i = urls.map(d => d.cube).findIndex(d => d === res.data.source[0].name);
        }

        if (i === responses.length - 1 && this.state.loading) {
          productOptions = _data;
        }
        else {

          if (urls[i].cube === "trade_s_chl_d_hs") {
            _data.forEach(d => {
              d.Time = `${d.Year}${`0${d["Month ID"]}`.slice(-2)}` * 1;
            });
          }

          _data = _data.filter(d => d.Time * 1 >= 201801);

          if (this.state.loading) {
            _data.map(d => availableDates ? !availableDates.find(h => h.value * 1 === d.Time * 1) ? availableDates.push(this.createDates(d.Time)) : false : false);
          }

          _data.forEach(d => {
            d.color = countries.includes(urls[i].value) ? urls[i].color : "#737373";
            d["Continent ID"] = urls[i].parent_id;
            d.Continent = urls[i].parent;
            d["ISO 2"] = urls[i].iso2;
            d["ISO 3"] = urls[i].label.toUpperCase();
            d["Country ID"] = urls[i].value;
            d.Country = urls[i].title;
            d.Date = `${d.Time.toString().slice(-2)}/01/${d.Time.toString().slice(0, 4)}`;
            d["Previous Year"] = d.Year - 1;
            d["Trade Value Previous"] = _data.find(h => h.Time === dateId * 1) ? _data.find(h => h.Time === dateId * 1)["Trade Value"] : 0;
          });

          _data.forEach(d => {
            d["Trade Value Growth"] = this.growth(d["Trade Value Previous"], d["Trade Value"]);
            d["Trade Value Growth Value"] = d["Trade Value"] - d["Trade Value Previous"];
          });

          allPromises.push(_data.filter(d => d.Time >= dateId * 1 && isFinite(d["Trade Value Growth"])));
        }
      });

      if (this.state.loading) {
        availableDates = availableDates.slice(0, -1);
      }

      availableYears = [...new Set(allPromises.flat().map(d => d.Year))];

      const _tickDates = this.tickBuilder(allPromises.flat());

      if (productCuts && productCuts.length > 0 && this.state.loading) {
        const _productCuts = productOptions.find(d => d[`${productCuts[0].type} ID`] * 1 === productCuts[0].id * 1);
        if (_productCuts) {
          productCuts = [{
            color: colors.Section[_productCuts["Section ID"]],
            icon: `/images/icons/hs/hs_${_productCuts["Section ID"]}.svg`,
            id: productCuts[0].id,
            label: productCuts[0].id,
            name: _productCuts[productCuts[0].type],
            searchIndex: `${_productCuts[productCuts[0].type]}|${productCuts[0].id}`,
            type: productCuts[0].type
          }];
        }
      }

      this.setState({
        availableDates,
        availableYears,
        data: allPromises.flat(),
        loading: false,
        productCuts,
        productOptions,
        _tickDates
      });
    }).catch(error => {
      console.error("COVID API's calls failed", error);
      return [];
    });
  }

  growth(prev, curr) {
    const value = (curr - prev) / prev;
    return value * 100;
  }

  handleItemMultiSelect = (key, d) => {
    const {_selectedItemsCountry, _startDate, countryMembers, flowId, highlightCountries, productCuts} = this.state;

    this.setState({
      [key]: Array.isArray(d) ? d : new Array(d)
    });

    if (key === "_selectedItemsCountry") {

      const addedCountry = _selectedItemsCountry.length > 0 ? d.filter(h => !_selectedItemsCountry.includes(h)) : d;

      if (addedCountry.length > 0) {
        highlightCountries.push(addedCountry[0].value);
      }

      this.fetchData(d.map(item => item), flowId, _startDate.value, productCuts, highlightCountries);

      this.setState({
        highlightCountries
      });
    }
    else {
      this.fetchData(_selectedItemsCountry.length > 0 ? _selectedItemsCountry : countryMembers, flowId, _startDate.value, new Array(d), highlightCountries);

      if (_selectedItemsCountry.length === 0) {
        this.setState({
          _selectedItemsCountry: countryMembers
        });
      }
    }
  };

  highlightCountry = item => {
    const {_selectedItemsCountry, flowId, _startDate, productCuts} = this.state;
    let {highlightCountries} = this.state;

    if (highlightCountries.includes(item)) {
      highlightCountries = highlightCountries.filter(d => d !== item);
    }
    else highlightCountries.push(item);

    this.fetchData(_selectedItemsCountry, flowId, _startDate.value, productCuts, highlightCountries);

    this.setState({
      highlightCountries
    });
  }

  legendCreator = items => {
    const legend = items.map(d => `/images/icons/country/country_${d.label}.png`);

    return legend;
  }

  listFormatter = items => items.reduce((str, item, i) => {

    if (!i) str += item;
    else if (i === items.length - 1 && i === 1) str += ` and ${item}`;
    else if (i === items.length - 1) str += `, and ${item}`;
    else str += `, ${item}`;
    return str;
  }, "")

  removeItemMultiSelect = (key, value) => {
    const {_selectedItemsCountry, countryMembers, _startDate, flowId, productCuts, highlightCountries} = this.state;

    if (key === "_selectedItemsCountry") {
      this.fetchData(countryMembers, flowId, _startDate.value, productCuts, highlightCountries);
    }
    else {
      this.fetchData(_selectedItemsCountry, flowId, _startDate.value, [], highlightCountries);
    }

    this.setState({
      [key]: value
    });
  }

  removeSelectedItem = () => {
    const {_selectedItemsCountry, _startDate, flowId, highlightCountries} = this.state;
    let {productCuts} = this.state;

    productCuts = [];

    this.fetchData(_selectedItemsCountry, flowId, _startDate.value, productCuts, highlightCountries);

    this.setState({
      productCuts
    });
  }

  tickBuilder = data => {
    const ticks = [];

    data.map(d => !ticks.includes(d.Date) ? ticks.push(d.Date) : false);

    return ticks;
  }

  updateFilter = (key, value) => {
    const {_selectedItemsCountry, flowId, highlightCountries, productCuts} = this.state;

    this.fetchData(_selectedItemsCountry, flowId, value.value, productCuts, highlightCountries);

    this.setState({
      [key]: value
    });
  };

  render() {
    const {_selectedFlow, _selectedItemsCountry, _startDate, _tickDates, availableDates, availableYears, countryMembers, data, flow, highlightCountries, loading, location, productCuts, productOptions, width} = this.state;

    return (
      <div className="covid-profile">
        <OECNavbar />
        <Helmet title="Latest Trends Explorer" />
        <div className="covid-content">
          <div className="covid-columns">
            <div className="covid-column aside">
              <div className="content">
                <div className="columns">
                  <h3 className="covid-subtitle">Lastest Trends Explorer</h3>
                  <div className="column-1">
                    <SimpleSelect
                      items={availableFlows}
                      state="flowId"
                      selectedItem={_selectedFlow}
                      title={"Flow"}
                      callback={(key, value) => {
                        this.fetchData(_selectedItemsCountry, value.value, _startDate.value, productCuts, highlightCountries);
                        this.setState({
                          _selectedFlow: value,
                          flow: value.title,
                          flowId: value.value
                        });
                      }}
                    />
                    <SimpleSelect
                      items={availableDates}
                      title={"Reference Period"}
                      state="_startDate"
                      selectedItem={_startDate}
                      callback={this.updateFilter}
                    />
                  </div>
                  <div className="column-1">
                    <OECMultiSelect
                      items={countryMembers}
                      itemType={"country"}
                      selectedItems={_selectedItemsCountry}
                      placeholder={"Select a country..."}
                      title={"Country"}
                      onClear={() => {
                        this.removeItemMultiSelect("_selectedItemsCountry", []);
                      }}
                      callback={d => {
                        this.handleItemMultiSelect("_selectedItemsCountry", d);
                      }}
                    />
                  </div>
                  <div className="column-1">
                    <h3 className="covid-selector-title">Product</h3>
                    <SelectMultiHierarchy
                      getColor={productColor}
                      getIcon={productIcon}
                      inputRightIcon={loading && spinner}
                      items={productOptions}
                      levels={productLevels}
                      placeholder={"Select a product..."}
                      selectedItems={productCuts}
                      onClear={() => {
                        this.removeItemMultiSelect("productCuts", []);
                      }}
                      onItemSelect={d => this.handleItemMultiSelect("productCuts", d)}
                      onItemRemove={item => {
                        this.removeSelectedItem("productCuts", item);
                      }}
                    />
                  </div>
                  <div className="column-1">
                    {!loading && <VbDownload
                      className="covid-vdownloader"
                      customAPI={this.buildLink()}
                      data={data}
                      dropCols={["Quarter ID", "Quarter", "Time", "color", "ISO 2", "ISO 3", "Date", "Previous Year"]}
                      location={location}
                      title="download"
                    />}
                  </div>
                </div>
              </div>
            </div>
            <div className="covid-column">
              <h1 className="covid-title">How has COVID-19 affected international trade patterns?</h1>
              <h2 className="covid-reference">Monthly {flow.toLowerCase()} in {this.listFormatter(availableYears)} compared to {_startDate.title}</h2>
              {loading &&
              <div className="covid-chart">
                <Loading />
              </div>}
              {!loading &&
              <React.Fragment>
                <div className="covid-chart">
                  <LinePlot
                    config={{
                      data,
                      discrete: "x",
                      groupBy: width < 768 ? ["Continent ID", "ISO 3"] : ["Continent ID", "Country"],
                      highlightCountries,
                      legend: false,
                      legendTooltip: {
                        tbody: []
                      },
                      lineLabels: true,
                      shapeConfig: {
                        Line: {
                          labelConfig: {
                            fontSize: d => highlightCountries.includes(d["Country ID"]) ? width < 1920 ? 10 : width < 2560 ? 15 : width < 3840 ? 20 : 25 : width < 1920 ? 5 : width < 2560 ? 10 : width < 3840 ? 15 : 20,
                            fontStroke: style["dark-2"],
                            fontStrokeWidth: d => highlightCountries.includes(d["Country ID"]) ? 0.4 : 0.5,
                            fontWeight: 800,
                            padding: 3
                          },
                          stroke: d => highlightCountries.includes(d["Country ID"]) ? d.color : "#737373",
                          strokeWidth: d => highlightCountries.includes(d["Country ID"]) ? 3 : 0.5
                        },
                        sort: (a, b) => {
                          if (!highlightCountries.includes(b["Country ID"])) return 1; else return -1;
                        }
                      },
                      time: "Date",
                      timeline: false,
                      tooltipConfig: {
                        title: d => {
                          let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
                          tooltip += `<div class="icon"><img src="/images/icons/country/country_${d["ISO 3"].toLowerCase()}.png" /></div>`;
                          tooltip += `<div class="title"><span>${d.Country}</span></div>`;
                          tooltip += "</div>";
                          return tooltip;
                        },
                        tbody: [
                          ["Period", d => `${d.Month} ${d.Year}`],
                          ["Reference Period", () => _startDate.title],
                          [`Relative ${flow} Growth`, d => `${currencySign[d["Country ID"]]} ${formatAbbreviate(d["Trade Value Growth Value"])}`],
                          [`Relative ${flow} Growth (%)`, d => `${formatAbbreviate(d["Trade Value Growth"])}%`]
                        ]
                      },
                      total: false,
                      x: "Date",
                      xConfig: {
                        labels: _tickDates
                      },
                      y: "Trade Value Growth",
                      yConfig: {
                        scale: "linear",
                        tickFormat: d => `${d}%`
                      }
                    }}
                  />
                </div>
                <div className="covid-legend">
                  {_selectedItemsCountry.map((d, i) =>
                    <CovidLegend
                      key={i}
                      country={d.value}
                      countryName={d.title}
                      activeList={highlightCountries}
                      icon={`/images/icons/country/country_${d.label}.png`}
                      onItemSelect={d => this.highlightCountry(d)}
                    />)}
                </div>
              </React.Fragment>
              }
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(Covid);
