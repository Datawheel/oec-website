import React from "react";
import {hot} from "react-hot-loader/root";

import {InputGroup, Tab, Tabs} from "@blueprintjs/core";

import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import SubnationalList from "./SubnationalList";
import SubnationalMap from "./SubnationalMap";

import "./SubnationalCountryBlock.css";

class SubnationalCountryBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {...props.options},
      navbarTabId: "tab-0"
    };
    this.handleNavbarTabChange = this.handleNavbarTabChange.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  filterList(event) {
    const {options} = this.props;
    const filtered = {};
    Object.keys(options).map(level => {
      filtered[level] = options[level].filter(item => item.name.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1);
    });

    this.setState({items: filtered, searchText: event.target.value});
  }

  handleNavbarTabChange(navbarTabId) {
    this.setState({navbarTabId, items: this.props.options, searchText: ""});
  }

  render() {
    const {metadata} = this.props;
    const {items} = this.state;

    // Navbar
    const {navbarTabId, searchText} = this.state;

    const navbarTabIx = parseInt(navbarTabId.split("-")[1], 0);

    const selectedGeoLevel = metadata.geoLevels[navbarTabIx];

    const selectedName = selectedGeoLevel.name;
    const selectedLevel = selectedGeoLevel.level;

    return <div className="subnational-country-block">
      <div className="subnational-header">
        <h3 className="">{metadata.name}</h3>
      </div>
      <div className="subnational-block-content">
        <div className="subnational-tabs">
          <Tabs
            animate={true}
            id={`${metadata.code}-geolevels`}
            key={"horizontal"}
            className="subnational-tabs-component"
            renderActiveTabPanelOnly={false}
            vertical={false}
            onChange={this.handleNavbarTabChange}
            selectedTabId={navbarTabId}
          >
            {metadata.geoLevels.map((gl, ix) =>
              <Tab key={`tab-${ix}`} id={`tab-${ix}`} title={gl.name} panel={<SubnationalList options={items && items[gl.level] ? items[gl.level] : []} />} />
            )}
            <Tabs.Expander />
            <InputGroup type="text"
              id={`${metadata.code}-search`}
              placeholder={`Search ${selectedName}`}
              onChange={this.filterList}
              defaultValue={""}
              value={searchText} />
          </Tabs>
        </div>
        <div className="subnational-map-container">
          <SubnationalMap
            country={metadata.code}
            selectedGeoLevel={selectedGeoLevel}
            items={items && items[selectedLevel] ? items[selectedLevel] : []}
          />
        </div>
      </div>
    </div>;
  }
}


SubnationalCountryBlock.need = [];

export default hot(withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale
  }))(SubnationalCountryBlock)
));
