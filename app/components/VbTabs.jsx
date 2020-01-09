import React from "react";
import {withNamespaces} from "react-i18next";
import {Tab, Tabs} from "@blueprintjs/core";

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
    const {activeOption, activeTab, t} = this.props;

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
                <VbTab
                  activeOption={activeOption}
                  chart="tree_map"
                  callback={activeOption => this.props.callback({activeOption})}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {name: t("Exports")},
                        {name: t("Imports")},
                        {name: t("Export Destinations")},
                        {name: t("Import Origins")}
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {name: t("Exporters")},
                        {name: t("Importers")}
                      ]
                    },
                    {
                      name: t("Bilateral"), nest: [
                        {name: t("Exports to Destination")},
                        {name: t("Imports from Origin")},
                        {name: t("Exports by Product")},
                        {name: t("Imports by Product")}
                      ]
                    }
                  ]}
                />
              }
            />
            <Tab
              id="stacked"
              className={activeTab === "stacked" ? "is-selected" : ""}
              title={<TabTitle icon="stacked" title="Stacked" />}
              panel={
                <VbTab
                  chart="stacked"
                  activeOption={activeOption}
                  callback={activeOption => this.props.callback({activeOption})}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {name: t("Exports")},
                        {name: t("Imports")},
                        {name: t("Export Destinations")},
                        {name: t("Import Origins")}
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {name: t("Exporters")},
                        {name: t("Importers")}
                      ]
                    },
                    {
                      name: t("Bilateral"), nest: [
                        {name: t("Exports to Destination")},
                        {name: t("Imports from Origin")},
                        {name: t("Exports by Product")},
                        {name: t("Imports by Product")}
                      ]
                    }
                  ]}
                />
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
                <VbTab
                  chart="network"
                  activeOption={activeOption}
                  callback={activeOption => this.props.callback({activeOption})}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {name: t("Product Space")},
                        {name: t("PGI Product Space")}
                      ]
                    }
                  ]}
                />
              }
            />
            <Tab
              id="rings"

              className={activeTab === "rings" ? "is-selected" : ""}
              title={<TabTitle icon="rings" title="Rings" />}
              panel={
                <VbTab
                  chart="rings"
                  activeOption={activeOption}
                  callback={activeOption => this.props.callback({activeOption})}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {name: t("Product Connections")}
                      ]
                    }
                  ]}
                />
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
                <VbTab
                  chart="geomap"
                  activeOption={activeOption}
                  callback={activeOption => this.props.callback({activeOption})}
                  items={[
                    {
                      name: t("Product"), nest: [
                        {name: t("Exporters")},
                        {name: t("Importers")}
                      ]
                    }
                  ]}
                />
              }
            />
            <Tab
              id="line"
              className={activeTab === "line" ? "is-selected" : ""}
              title={<TabTitle icon="line" title="Line" />}
              panel={
                <VbTab
                  activeOption={activeOption}
                  chart="line"
                  callback={activeOption => this.props.callback({activeOption})}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {name: t("Exports")},
                        {name: t("Imports")},
                        {name: t("Export Destinations")},
                        {name: t("Import Origins")}
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {name: t("Exporters")},
                        {name: t("Importers")}
                      ]
                    },
                    {
                      name: t("Bilateral"), nest: [
                        {name: t("Exports to Destination")},
                        {name: t("Imports from Origin")},
                        {name: t("Exports by Product")},
                        {name: t("Imports by Product")},
                        {name: t("Trade Balance")}
                      ]
                    },
                    {
                      name: t("ECI Rankings"), nest: [
                        {name: t("All Countries")},
                        {name: t("Specific Country")}
                      ]
                    }
                  ]}
                />
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
                <VbTab
                  activeOption={activeOption}
                  chart="scatter"
                  callback={activeOption => this.props.callback({activeOption})}
                  items={[
                    {
                      name: t("Economic Complexity"), nest: [
                        {name: t("vs GDP")},
                        {name: t("vs GDPpc (constant '05 US$)")},
                        {name: t("vs GDPpc (current US$)")},
                        {name: t("vs GDPpc PPP (constant '11)")},
                        {name: t("vs GDPpc PPP (current)")}
                      ]
                    }
                  ]}
                />
              }
            />

          </Tabs>
        </div>
      </div>
    </div>;
  }
}

export default withNamespaces()(VbTabs);
