import React from "react";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import Navbar from "components/Navbar";
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
  {value: "sitc", title: "SITC"}
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
      _flow: undefined,
      _partner: undefined,
      _year: undefined,
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

  buildViz = () => {
    const {
      chart,
      endTimeTemp,
      scale,
      startTimeTemp,
      timeTemp,
      flowTemp,
      productTemp,
      partnerTemp,
      timeDimension
    } = this.state;
    const {lng, timeDimensions} = this.props;

    const allTime = timeDimensions[timeDimension];

    const latestMonth = timeDimensions.Month[0].value.split("-");
    const _year = latestMonth[0] * 1;
    const _month = latestMonth[1] * 1;
    const timeLabels = allTime.map(d => d.value).sort((a, b) => a > b ? 1 : -1);

    const _latestYear = _month === 12 ? _year : _year - 1;
    const _latestQuarter = _month % 3 === 0 ? timeDimensions.Quarter[0].value : timeDimensions.Quarter[1].value;

    const compare = timeDimension === "Year"
      ? _latestYear
      : timeDimension === "Quarter"
        ? _latestQuarter : timeDimensions.Month[0].value;

    const idx = timeLabels.findIndex(d => d.toString() === compare.toString());

    const {router} = this.props;

    const t = ["line", "stacked"].includes(chart);

    const sameTime = startTimeTemp === endTimeTemp;

    const vbKey = {
      chart,
      flow: flowTemp ? flowTemp.flow : undefined,
      partner: partnerTemp ? partnerTemp.value : undefined,
      product: productTemp ? productTemp.value : undefined,
      scale,
      time: t ? sameTime ? `${timeLabels[idx - 5]}.${timeLabels[idx]}` : `${startTimeTemp}.${endTimeTemp}` : timeTemp,
      lng
    };

    router.push(permalink(vbKey));

  };

  updateFilter = (key, value) => {
    if (key === "timeDimension") {
      const v = value.value;
      return this.setState({
        [key]: v,
        timeTemp: this.props.timeDimensions[v][0].value,
        startTimeTemp: this.props.timeDimensions[v][1].value,
        endTimeTemp: this.props.timeDimensions[v][0].value
      });
    }
    return this.setState({[key]: value === "all" ? null : value});
  }

  render() {
    const {activeOption, activeTab, scrolled} = this.state;
    const {routeParams, t} = this.props;

    return <div id="vizbuilder">
      <Navbar
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
              callback={d => this.setState(d)}
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
