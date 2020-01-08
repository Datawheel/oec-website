import React from "react";
import {hot} from "react-hot-loader/root";

import {Classes, InputGroup, Tab, Tabs} from "@blueprintjs/core";

import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import SubnationalList from "./SubnationalList";

import "./SubnationalMap.css";

class SubnationalMap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const {metadata, options} = this.props;
    console.log(metadata);
    console.log(options);
    return <div className="subnational-map">
      <h2>{metadata.name}</h2>
      <Tabs
        animate={true}
        id="TabsExample"
        key={"horizontal"}
        renderActiveTabPanelOnly={false}
        vertical={false}
      >
        {metadata.geoLevels.map(gl =>
          <Tab key={gl.level} id={`tab-${gl.level}`} title={gl.name} panel={<SubnationalList options={options && options[gl.level] ? options[gl.level] : []} />} />
        )}
        <Tabs.Expander />
        <InputGroup className={Classes.FILL} type="text" placeholder="Search..." />
      </Tabs>
    </div>;
  }
}


SubnationalMap.need = [];

export default hot(withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale
  }))(SubnationalMap)
));
