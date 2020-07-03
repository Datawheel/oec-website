import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import Helmet from "react-helmet";
import axios from "axios";
import {LinePlot} from "d3plus-react";
import {formatAbbreviate} from "d3plus-format";


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
      availableDates: [],
      countryMembers: subnatCubeMembers,
      data: [],
      flow: "Exports",
      flowId: 2,
      loading: true,
      _selectedItemsCountry: subnatCubeMembers,
      _selectedFlow: {
        value: 2,
        title: "Exports"
      },
      _startDate: {
        value: 201905,
        title: "May 2019"
      },
      productCuts: [],
      productOptions: []
    };
  }

  componentDidMount() {
    const {countryMembers, flowId, _startDate, productCuts} = this.state;
    this.fetchData(countryMembers, flowId, _startDate.value, productCuts);
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

  fetchData = (urls, flowId, dateId, productCuts) => {
    let {availableDates, productOptions} = this.state;
    let _productCut = [];

    if (productCuts && productCuts.length > 0) {
      urls = urls.filter(d => d.product_category === "hs" && d.avialablesDepth.includes(productCuts[0].type));
      _productCut = urls.map(d => `&${d.depthDict[productCuts[0].type] || productCuts[0].type}=${productCuts[0].id}`);
    }

    const promisesList = urls
      .map((url, i) => _productCut.length > 0
        ? `${BASE}?cube=${url.cube}&drilldowns=Time&measures=Trade+Value&Trade+Flow=${flowId}&parents=true&sparse=false${_productCut[i]}`
        : `${BASE}?cube=${url.cube}&drilldowns=Time&measures=Trade+Value&Trade+Flow=${flowId}&parents=true&sparse=false`);

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

          _data = _data.filter(d => d.Time >= 201801);

          if (this.state.loading) {
            _data.map(d => availableDates ? !availableDates.find(h => h.value === d.Time) ? availableDates.push(this.createDates(d.Time)) : false : false);
          }

          _data.forEach(d => {
            d["Previous Year"] = d.Year - 1;
            d["Continent ID"] = urls[i].parent_id;
            d.Continent = urls[i].parent;
            d["Country ID"] = urls[i].value;
            d.Country = urls[i].title;
            d.Date = `${d.Time.toString().slice(-2)}/01/${d.Time.toString().slice(0, 4)}`;
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

      this.setState({
        availableDates,
        data: allPromises.flat(),
        loading: false,
        productOptions
      });
    });
  }

  growth(prev, curr) {
    const value = (curr - prev) / prev;
    return value * 100;
  }

  handleItemMultiSelect = (key, d) => {
    const {_selectedItemsCountry, _startDate, countryMembers, flowId, productCuts} = this.state;

    this.setState({[key]: Array.isArray(d) ? d : new Array(d)});

    if (key === "_selectedItemsCountry") {
      this.fetchData(d.map(item => item), flowId, _startDate.value, productCuts);
    }
    else {
      this.fetchData(_selectedItemsCountry.length > 0 ? _selectedItemsCountry : countryMembers, flowId, _startDate.value, new Array(d));

      if (_selectedItemsCountry.length === 0) {
        this.setState({
          _selectedItemsCountry: countryMembers
        });
      }
    }
  };

  removeItemMultiSelect = (key, value) => {
    const {_selectedItemsCountry, countryMembers, _startDate, flowId, productCuts} = this.state;

    if (key === "_selectedItemsCountry") {
      this.fetchData(countryMembers, flowId, _startDate.value, productCuts);
    }
    else {
      this.fetchData(_selectedItemsCountry, flowId, _startDate.value, []);
    }

    this.setState({
      [key]: value
    });
  }

  removeSelectedItem = () => {
    const {_selectedItemsCountry, _startDate, flowId} = this.state;
    let {productCuts} = this.state;

    productCuts = [];

    this.fetchData(_selectedItemsCountry, flowId, _startDate.value, productCuts);

    this.setState({
      productCuts
    });
  }

  updateFilter = (key, value) => {
    const {_selectedItemsCountry, flowId, productCuts} = this.state;

    this.fetchData(_selectedItemsCountry, flowId, value.value, productCuts);

    this.setState({
      [key]: value
    });
  };

  render() {
    const {_selectedFlow, _selectedItemsCountry, _startDate, availableDates, countryMembers, data, flow, loading, productCuts, productOptions} = this.state;

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
                        this.fetchData(_selectedItemsCountry, value.value, _startDate.value);
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
              <h1 className="covid-title">How has COVID affected international trade patterns?</h1>
              {loading &&
              <div className="covid-chart">
                <Loading />
              </div>}
              {!loading &&
              <div className="covid-chart">
                <LinePlot
                  config={{
                    data,
                    discrete: "x",
                    groupBy: ["Continent ID", "Country"],
                    heigth: 400,
                    legendTooltip: {
                      tbody: []
                    },
                    lineLabels: true,
                    time: "Date",
                    timeline: false,
                    tooltipConfig: {
                      tbody: [
                        ["Period", d => `${d.Month} ${d.Year}`],
                        ["Reference Period", () => _startDate.title],
                        [`Relative ${flow} Growth`, d => `${currencySign[d["Country ID"]]} ${formatAbbreviate(d["Trade Value Growth Value"])}`],
                        [`Relative ${flow} Growth (%)`, d => `${formatAbbreviate(d["Trade Value Growth"])}%`]
                      ]
                    },
                    total: false,
                    x: "Date",
                    y: "Trade Value Growth",
                    yConfig: {
                      scale: "linear",
                      tickFormat: d => `${d}%`
                    }
                  }}
                />
              </div>
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
