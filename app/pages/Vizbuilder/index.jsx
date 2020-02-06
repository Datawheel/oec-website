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
import {Client} from "@datawheel/olap-client";
import OECMultiSelect from "../../components/OECMultiSelect";
import VbTitle from "../../components/VbTitle";
import axios from "axios";
import colors from "../../helpers/colors";


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

class Vizbuilder extends React.Component {
  constructor(props) {
    super(props);
    const {params} = this.props;

    this.state = {
      activeTab: params ? params.chart : "tree_map",
      country: [],
      product: [],
      technology: [],

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
      _selectedItemsYear: []
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

  buildViz = () => {
    const {router} = this.props;
    const {
      activeTab,
      _countryId,
      _flow,
      _yearId,
      _dataset,
      _selectedItemsCountry,
      _selectedItemsPartner,
      _selectedItemsYear,
      _selectedItemsProduct,
      _selectedItemsTechnology
    } = this.state;

    const countryIds = _selectedItemsCountry.map(d => d.label).join(".");
    const partnerIds = _selectedItemsPartner && _selectedItemsPartner.length > 0
      ? _selectedItemsPartner.map(d => d.label).join(".")
      : "all";

    const isTechnologyFilter = _selectedItemsTechnology.length > 0;
    const isTradeFilter = _selectedItemsProduct.length > 0;

    const filterIds = isTechnologyFilter || isTradeFilter
      ? isTechnologyFilter
        ? _selectedItemsTechnology.map(d => d.value).join(".")
        : _selectedItemsProduct.map(d => d.value).join(".")
      : "show";

    const dataset = isTechnologyFilter ? "cpc" : _dataset.value;
    const flow = isTechnologyFilter ? "uspto" : _flow.value;

    const permalink = `/en/visualize/tree_map/${dataset}/${flow}/${countryIds}/${partnerIds}/${filterIds}/${_selectedItemsYear.map(d => d.value).join(".")}/`;

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
    const {country, cube, partner, time, viztype} = routeParams;

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

    this.setState({
      ...prevState,
      _selectedItemsCountry,
      _selectedItemsPartner,
      _selectedItemsProduct,
      _selectedItemsTechnology,
      _selectedItemsYear
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

            {!["network"].includes(chart) && isTrade && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.product}
                  selectedItems={this.state._selectedItemsProduct}
                  title={"Product"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsProduct", d)}
                />
              </div>
            </div>}

            {!["network"].includes(chart) && isTechnology && <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.technology}
                  selectedItems={this.state._selectedItemsTechnology}
                  title={"Technology"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsTechnology", d)}
                />
              </div>
            </div>}

            <div className="columns">
              <div className="column-1">
                <OECMultiSelect
                  items={this.state.country}
                  itemType={"country"}
                  selectedItems={this.state._selectedItemsCountry}
                  title={"Country"}
                  callback={d => this.handleItemMultiSelect("_selectedItemsCountry", d)}
                />
              </div>
            </div>

            {!["network", "rings"].includes(chart) && isTrade && <div className="columns">
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

              <div className="column-1-2">
                <VirtualSelector
                  items={flow}
                  title={"Trade Flow"}
                  state="_flow"
                  selectedItem={this.state._flow}
                  run={this.updateFilter}
                />

              </div>
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
                  onClick={() => this.buildViz()}
                >
                  {t("Build Visualization")}
                </button>
              </div>
            </div>
          </div>
          <div className="vb-column">
            <VbTitle
              countryData={this.state.country}
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
