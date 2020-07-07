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

import "./Covid.css";

// Helpers
import {currencySign, monthNames, productColor, productIcon, productLevels, spinner, subnatCubeMembers} from "helpers/covid";

const BASE = "/olap-proxy/data";

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
      _selectedItemsCountry: subnatCubeMembers,
      _selectedFlow: {
        value: 2,
        title: "Exports"
      },
      _startDate: {
        value: 202001,
        title: "January 2020"
      },
      _ticks: [],
      productCuts: [],
      productOptions: [],
      _style: "",
      width: 0
    };

    this.highlightCountry = this.highlightCountry.bind(this);
  }

  componentDidMount() {
    const {countryMembers, flowId, highlightCountries, _startDate, productCuts} = this.state;
    this.fetchData(countryMembers, flowId, _startDate.value, productCuts, highlightCountries);

    this.setState({
      width: window.innerWidth
    });
  }

  changeStyle = () => {
    let {_style} = this.state;

    _style = _style === "is-light" ? "" : "is-light";

    this.setState({
      _style
    });
  }

  createDates = date => {
    const monthId = date.toString().slice(-2) * 1 - 1;
    const month = monthNames[monthId];
    const year = date.toString().slice(0, 4) * 1;

    const formattedDate = {
      value: date,
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
      responses.map((res, i) => {
        let _data = res.data.data;

        if (i === responses.length - 1 && this.state.loading) {
          productOptions = _data;
        }
        else {

          if (urls[i].cube === "trade_s_chl_d_hs") {
            _data.forEach(d => {
              d.Time = `${d.Year}${`0${d["Month ID"]}`.slice(-2)}` * 1;
            });
          }

          _data = _data.filter(d => d.Time >= 201801);

          if (this.state.loading) {
            _data.map(d => availableDates ? !availableDates.find(h => h.value === d.Time) ? availableDates.push(this.createDates(d.Time)) : false : false);
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
            d["Trade Value Previous"] = _data.find(h => h.Time === dateId) ? _data.find(h => h.Time === dateId)["Trade Value"] : 0;
          });

          _data.forEach(d => {
            d["Trade Value Growth"] = this.growth(d["Trade Value Previous"], d["Trade Value"]);
            d["Trade Value Growth Value"] = d["Trade Value"] - d["Trade Value Previous"];
          });

          allPromises.push(_data.filter(d => d.Time >= dateId && isFinite(d["Trade Value Growth"])));
        }
      });

      if (this.state.loading) {
        availableDates = availableDates.slice(0, -1);
      }

      availableYears = [...new Set(allPromises.flat().map(d => d.Year))];

      const _tickDates = this.tickBuilder(allPromises.flat());

      this.setState({
        availableDates,
        availableYears,
        data: allPromises.flat(),
        loading: false,
        productOptions,
        _tickDates
      });
    }).catch(error => {
      console.error("COVID API's calls failed", error);
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
    const {_selectedFlow, _selectedItemsCountry, _startDate, _tickDates, availableDates, availableYears, countryMembers, data, flow, highlightCountries, loading, productCuts, productOptions, width} = this.state;

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
                  <div className="column-1 ">
                    <SimpleSelect
                      items={[
                        {
                          value: 2,
                          title: "Exports"
                        },
                        {
                          value: 1,
                          title: "Imports"
                        }
                      ]}
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
                      callback={d => this.handleItemMultiSelect("_selectedItemsCountry", d)}
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
                </div>
              </div>
            </div>
            <div className="covid-column">
              <h1 className="covid-title">How has COVID-19 affected international trade patterns?</h1>
              <h2 className="covid-reference">Monthly {flow.toLowerCase()} in {this.listFormatter(availableYears)} compared with {_startDate.title} </h2>
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
                            fontSize: d => highlightCountries.includes(d["Country ID"]) ? 10 : 5,
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
