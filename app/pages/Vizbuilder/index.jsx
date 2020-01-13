import React from "react";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import {parseURL, permalink} from "helpers/utils";

import "./Vizbuilder.css";
import VbTabs from "../../components/VbTabs";
import VbChart from "../../components/VbChart";
import VirtualSelector from "../../components/VirtualSelector";
import {Client} from "@datawheel/olap-client";

const datasets = [
  {value: "92", title: "HS92"},
  {value: "96", title: "HS96"},
  {value: "02", title: "HS02"},
  {value: "07", title: "HS07"},
  {value: "sitc", title: "SITC"},
  {value: "cpc", title: "Technology"}
];

const flow = [
  {value: "1", title: "Exports"},
  {value: "2", title: "Imports"}
];

const years = [...Array(56).keys()].map(d => ({value: 2017 - d, title: 2017 - d}));

class Vizbuilder extends React.Component {
  constructor(props) {
    super(props);
    const {t} = this.props;
    this.state = {
      activeTab: "tree_map",
      activeOption: `tree_map_${t("Country")}_${t("Exports")}`,
      country: [],
      product: [],
      _product: undefined,
      _country: undefined,
      _countryId: "all",
      _flow: undefined,
      _partner: undefined,
      _partnerId: "all",
      _year: undefined,
      _yearId: "2017",
      scrolled: false
    };
  }


  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);

    Client.fromURL("https://api.oec.world/tesseract")
      .then(client => client.getCube("trade_i_baci_a_92").then(cube => {
        const query = cube.query;
        query.addMeasure("Trade Value");
        return client.getMembers({level: "HS2"});

      }))
      .then(data => {
        this.setState({product: data.map(d => ({value: d.key, title: d.name}))});
      });

    Client.fromURL("https://api.oec.world/tesseract")
      .then(client => client.getCube("trade_i_baci_a_92").then(cube => {
        const query = cube.query;
        query.addMeasure("Trade Value");
        return client.getMembers({level: "Exporter Country"});

      }))
      .then(data => {
        this.setState({country: data.map(d => ({value: d.key, title: d.name}))});
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
    this.setState(d);
    router.push(d.permalink);
  }

  buildViz = () => {
    const {router} = this.props;
    const {activeTab, _countryId, _yearId} = this.state;
    const permalink = `/en/visualize/${activeTab}/hs92/export/${_countryId.slice(2, 5)}/all/show/${_yearId}/`;
    this.setState({permalink});
    router.push(permalink);
  };

  updateFilter = (key, value) => {
    console.log([`${key}Id`], value);
    this.setState({
      [key]: value,
      [`${key}Id`]: value.value
    });
  };

  render() {
    const {activeOption, activeTab, scrolled} = this.state;
    const {routeParams, t} = this.props;

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
              activeOption={activeOption}
              activeTab={activeTab}
              callback={d => this.handleTabOption(d)}
            />
            <div className="columns">
              <div className="column-1">
                <VirtualSelector
                  items={this.state.product}
                  title={"Product"}
                  selectedItem={this.state._product}
                  state="_product"
                  run={this.updateFilter}
                />
              </div>
            </div>
            <div className="columns">
              <div className="column-1">
                <VirtualSelector
                  items={this.state.country}
                  title={"Country"}
                  state="_country"
                  selectedItem={this.state._country}
                  run={this.updateFilter}
                />
              </div>
            </div>
            <div className="columns">
              <div className="column-1">
                <VirtualSelector
                  items={this.state.country}
                  title={"Partner"}
                  state="_partner"
                  selectedItem={this.state._partner}
                  run={this.updateFilter}
                />
              </div>
            </div>

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
                <VirtualSelector
                  items={years}
                  title={"Year"}
                  state="_year"
                  selectedItem={this.state._year}
                  run={this.updateFilter}
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
