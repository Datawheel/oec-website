import React from "react";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";

import "./Vizbuilder.css";
import VbTabs from "../../components/VbTabs";
import VbChart from "../../components/VbChart";
import VirtualSelector from "../../components/VirtualSelector";
import OECMultiSelect from "../../components/OECMultiSelect";
import VbTitle from "../../components/VbTitle";
import axios from "axios";
import colors from "../../helpers/colors";
import OECMultiSelectV2 from "../../components/OECMultiSelectV2";

import {nest} from "d3-collection";

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

const scatterYAxisOptions = [
  {value: "gdp", title: "GDP"},
  {value: "gdp_constant", title: "GDP (constant '10 US$)"},
  {value: "gdp_pc_current", title: "GDPpc (current US$)"},
  {value: "gdp_pc_constant", title: "GDPpc (constant '10 US$)"},
  {value: "gdp_pc_current_ppp", title: "GDPpc PP (current US$)"},
  {value: "gdp_pc_constant_ppp", title: "GDPpc PP (constant '11 US$)"}
];

const years = [...Array(56).keys()].map(d => ({value: 2019 - d, title: 2019 - d}));

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
      _yAxis: params && params.flow
        ? scatterYAxisOptions.find(d => d.value === params.flow) || scatterYAxisOptions[0]
        : scatterYAxisOptions[0],
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

      testing: []
    };
  }


  componentDidMount() {
    const {routeParams} = this.props;
    const {country, cube, partner, time, viztype} = routeParams;
    window.addEventListener("scroll", this.handleScroll);

    // Gets members of HS products, Countries and Technologies
    axios.all([
      axios.get("/members/products_hs92.json"),
      axios.get("/members/country.json"),
      axios.get("/members/technology.json")
    ]).then(axios.spread((resp1, resp2, resp3) => {
      const productData = resp1.data.map(d => ({
        ...d, color: colors.Section[d.parent_id]}));
      const countryData = resp2.data.map(d => ({
        ...d, color: colors.Continent[d.parent_id]}));
      const technologyData = resp3.data.map(d => ({
        ...d, color: colors["CPC Section"][d.parent_id]}));

      // Sorts alphabetically country names
      countryData.sort((a, b) => a.title > b.title ? 1 : -1);

      this.updateFilterSelected({
        country: countryData,
        product: productData,
        technology: technologyData
      }, true);
    }));

    axios.get("https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false").then(resp => {
      const data = resp.data.data;
      const testing = [];
      nest()
        .key(d => `${d["Section ID"]}|${d.Section}`)
        .key(d => `${d["HS2 ID"]}|${d.HS2}`)
        .key(d => `${d["HS4 ID"]}|${d.HS4}`)
        // .rollup(d => console.log(d))
        .entries(data)
        .forEach(d => testing.push(d));

      testing.forEach(d => {
        const fullName = d.key.split("|");
        delete d.key;
        const parent = fullName[0];
        d.id = fullName[0];
        d.name = fullName[1];
        d.icon = `/images/icons/hs/hs_${parent}.png`;
        const color = colors.Section[parent];
        d.color = color;
        d.values.forEach(h => {
          const fullName = h.key.split("|");
          delete h.key;
          h.id = fullName[0];
          h.name = fullName[1];
          h.icon = `/images/icons/hs/hs_${parent}.png`;
          h.color = color;
          h.values.forEach(x => {
            const fullName = x.key.split("|");
            delete x.key;
            x.id = fullName[0];
            x.name = fullName[1];
            x.icon = `/images/icons/hs/hs_${parent}.png`;
            x.color = color;
            delete x.values;
          });
        });
      });
      console.log(testing);
      this.setState({testing});
    });

  }



  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    throttle(() => {
      if (window.scrollY > 220) {
        this.setState({scrolled: true});
      }
      else {
        this.setState({scrolled: false});
      }
    }, 30);
  };

  handleTabOption = d => {
    const {router} = this.props;
    this.setState(d, () => this.updateFilterSelected());
    router.push(d.permalink);
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
        : _selectedItemsProduct.map(d => d.value).join(".")
      : "show";

    const dataset = isTechnologyFilter ? "cpc" : _dataset.value;
    let flow = isTechnologyFilter ? "uspto" : _flow.value;

    /** Creates permalink config for scatter plot */
    if (chart === "scatter") {
      flow = _yAxis.value;
      countryIds = "show";
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
    const productData = usePrevState ? prevState.product : this.state.product;
    const {routeParams} = this.props;

    let {country, cube, flow, partner, time, viztype} = routeParams;
    if (prevState && prevState.permalink) {
      [cube, flow, country, partner, viztype, time] = prevState.permalink.slice(1).split("/").slice(3);
    }
    console.log(country);
    const _selectedItemsCountry = countryData
      .filter(d => country.split(".").includes(d.label));
    const _selectedItemsPartner = countryData
      .filter(d => partner.split(".").includes(d.label));
    const _selectedItemsYear = years
      .filter(d => time.split(".").includes(d.value.toString()));
    const _selectedItemsProduct = !["cpc"].includes(cube) ? productData
      .filter(d => viztype.split(".").includes(d.value.toString())) : [];
    const _selectedItemsTechnology = ["cpc"].includes(cube) ? technologyData
      .filter(d => viztype.split(".").includes(d.value)) : [];

    const _yAxis = scatterYAxisOptions.find(d => d.value === flow) || scatterYAxisOptions[0];

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
      _yAxis
    });
  }

  handleItemMultiSelect = (key, d) => {
    this.setState({[key]: d});
  }

  render() {
    const {activeTab, scrolled} = this.state;
    const {routeParams, t} = this.props;
    const {chart, cube} = routeParams;

    const isTrade = cube.includes("hs");
    const isTechnology = !isTrade;

    return <div id="vizbuilder">
      <OECNavbar
        className={scrolled ? "background" : ""}
        title={"Hello"}
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

            {!["network", "scatter"].includes(chart) && isTrade && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.product}
                  selectedItems={this.state._selectedItemsProduct}
                  title={"Product"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsProduct", d)}
                />
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

            {!["scatter", "geomap"].includes(chart) && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.country}
                  itemType={"country"}
                  selectedItems={this.state._selectedItemsCountry}
                  title={"Country"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsCountry", d)}
                />
              </div>
            </div>}

            {!["network", "rings", "scatter", "geomap"].includes(chart) && isTrade && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.country}
                  itemType="country"
                  selectedItems={this.state._selectedItemsPartner}
                  title={"Partner"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsPartner", d)}
                />
              </div>
            </div>}

            {/* <div className="columns">
              <div className="column-1">
                <OECMultiSelectV2
                  items={this.state.testing}
                  selectedItems={this.state._selectedItemsPartner}
                  title={"Partner"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsPartner", d)}
                />
              </div>
            </div> */}

            {["scatter"].includes(chart) && <div className="column-1-2">
              <VirtualSelector
                items={scatterYAxisOptions}
                title={"Y Axis"}
                state="_yAxis"
                selectedItem={this.state._yAxis}
                run={this.updateFilter}
              />
            </div>}

            <div className="columns">
              <div className="column-1-2">
                <VirtualSelector
                  items={datasets}
                  title={"Dataset"}
                  state="_dataset"
                  selectedItem={this.state._dataset}
                  run={this.updateFilter}
                />
              </div>

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
              selectedItemsPartner={this.state._selectedItemsCountryTitle}
              selectedItemsTechnology={this.state._selectedItemsTechnologyTitle}
              routeParams={routeParams}
            />
            <VbChart
              countryData={this.state.country}
              permalink={this.state.permalink}
              routeParams={routeParams}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>;
  }
}

export default withNamespaces()(connect()(Vizbuilder));
