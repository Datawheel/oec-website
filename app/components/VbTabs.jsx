import React from "react";
import {Tab, Tabs, Icon} from "@blueprintjs/core";

import VbTab from "./VbTab";

import "./VbTabs.css";

/** */
function TabTitle(props) {
  const {icon, title} = props;
  return (
    <div className="tab-title">
      <img className="tab-image" src={`/images/icons/app/app_${icon}.png`} />{" "}
      {title}
    </div>
  );

}


class VbTabs extends React.Component {
  handleTabChange = activeTab => {
    this.props.callback({activeTab});
  };

  render() {
    const {activeTab} = this.props;
    return <div>
      <div className="columns is-tabs">
        <div className="column-1 tab">
          <Tabs
            key="tabs_tree_map_stacked"
            onChange={this.handleTabChange}
            selectedTabId={activeTab}
          >
            <Tab
              id="tree_map"
              className={activeTab === "tree_map" ? "is-selected" : ""}
              title={<TabTitle icon="tree_map" title="Tree Map" />}
              panel={
                <VbTab />
              }
            />
            <Tab
              id="stacked"
              className={activeTab === "stacked" ? "is-selected" : ""}
              title={<TabTitle icon="stacked" title="Stacked" />}
              panel={
                <VbTab />
              }
            />
          </Tabs>
        </div>
      </div>

      <div className="columns is-tabs">
        <div className="column-1 tab">
          <Tabs
            key="tabs_network_rings_map"
            onChange={this.handleTabChange}
            selectedTabId={activeTab}
          >
            <Tab
              id="network"
              className={activeTab === "network" ? "is-selected" : ""}
              title={<TabTitle icon="network" title="Network" />}
              panel={
                <VbTab />
              }
            />
            <Tab
              id="rings"
              className={activeTab === "rings" ? "is-selected" : ""}
              title={<TabTitle icon="rings" title="Rings" />}
              panel={
                <VbTab />
              }
            />
          </Tabs>
        </div>
      </div>

      <div className="columns is-tabs">
        <div className="column-1 tab">
          <Tabs
            key="tabs_line_geo_map"
            onChange={this.handleTabChange}
            selectedTabId={activeTab}
          >
            <Tab
              id="geomap"
              className={activeTab === "geomap" ? "is-selected" : ""}
              title={<TabTitle icon="geo_map" title="Geo Map" />}
              panel={
                <VbTab />
              }
            />
            <Tab
              id="line"
              className={activeTab === "line" ? "is-selected" : ""}
              title={<TabTitle icon="line" title="Line" />}
              panel={
                <VbTab />
              }
            />
          </Tabs>
        </div>
      </div>
      <div className="columns is-tabs">
        <div className="column-1 tab">
          <Tabs
            key="tabs_scatter_map"
            onChange={this.handleTabChange}
            selectedTabId={activeTab}
          >
            <Tab
              id="scatter"
              className={activeTab === "scatter" ? "is-fullwidth is-selected" : ""}
              title={<TabTitle icon="scatter" title="Scatter" />}
              panel={
                <VbTab />
              }
            />

          </Tabs>
        </div>
      </div>
    </div>;
  }
}

export default VbTabs;
