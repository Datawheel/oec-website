import React from "react";
import {hot} from "react-hot-loader/root";

import {InputGroup, Tab, Tabs} from "@blueprintjs/core";

import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import SubnationalList from "./SubnationalList";

import "./SubnationalCountryBlock.css";

class SubnationalCountryBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarTabId: false
    };
    this.handleNavbarTabChange = this.handleNavbarTabChange.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleNavbarTabChange(navbarTabId) {
    this.setState({navbarTabId});
  }

  render() {
    const {metadata, options} = this.props;
    let {navbarTabId} = this.state;
    navbarTabId = navbarTabId ? navbarTabId : "tab-0";
    const navbarTabIx = parseInt(navbarTabId.split("-")[1], 0);

    return <div className="subnational-country-block">
      <div className="subnational-sidebar">
        <h2>{metadata.name}</h2>
        <InputGroup type="text" placeholder="Search..." />
      </div>
      <div className="subnational-tabs">
        <Tabs
          animate={true}
          id="GeoLevels"
          key={"horizontal"}
          renderActiveTabPanelOnly={false}
          vertical={false}
          onChange={this.handleNavbarTabChange}
          selectedTabId={navbarTabId}
        >
          {metadata.geoLevels.map((gl, ix) =>
            <Tab key={`tab-${ix}`} id={`tab-${ix}`} title={gl.name} panel={<SubnationalList options={options && options[gl.level] ? options[gl.level] : []} />} />
          )}
        </Tabs>
      </div>
      <div className="subnational-map">
        MAP: {metadata.code} - {metadata.geoLevels[navbarTabIx].slug}
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
