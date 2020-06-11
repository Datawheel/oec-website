import React from "react";
import {withNamespaces} from "react-i18next";
import classNames from "classnames";
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

  shouldComponentUpdate = prevProps =>
    JSON.stringify(prevProps.permalinkIds) !== JSON.stringify(this.props.permalinkIds) ||
    prevProps.activeTab !== this.props.activeTab ||
    prevProps.activeOption !== this.props.activeOption ||
    prevProps.isSubnat !== this.props.isSubnat;

  render() {
    const {activeOption, activeTab, isSubnat, permalinkIds, t} = this.props;
    const {cube, flow, country, partner, viztype, time, timePlot, scatterFlow, scatterCountry} = permalinkIds;

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
              className={classNames({"is-selected": activeTab === "tree_map"})}
              title={<TabTitle icon="tree_map" title="Tree Map" />}
              panel={
                <VbTab
                  activeOption={activeOption}
                  chart="tree_map"
                  callback={d => this.props.callback(d)}
                  items={[
                    isSubnat ? {
                      name: t("State/Province"), nest: [
                        {
                          name: t("Exports"),
                          permalink: `${cube}/export/all/all/show/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/export\/all\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports"),
                          permalink: `${cube}/import/all/all/show/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/import\/all\/all\/show\/[0-9.-]+\//)
                        }
                      ]
                    } : undefined,
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Exports"),
                          permalink: `${cube}/export/${country}/all/show/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/export\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports"),
                          permalink: `${cube}/import/${country}/all/show/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/import\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Export Destinations"),
                          permalink: `${cube}/export/${country}/show/all/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/export\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Import Origins"),
                          permalink: `${cube}/import/${country}/show/all/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/import\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        }
                        // {
                        //   name: t("Technology"),
                        //   permalink: "cpc/uspto/chl/all/show/2019/",
                        //   regexp: new RegExp(/tree_map\/cpc\/uspto\/[a-z.-]+\/all\/show\/[0-9.-]+\//)
                        // }
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {
                          name: t("Exporters"),
                          permalink: `${cube}/export/show/all/${viztype}/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/export\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: `${cube}/import/show/all/${viztype}/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/import\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        }
                      ]
                    },
                    // {
                    //   name: t("Technology"), nest: [
                    //     {
                    //       name: t("Patenters"),
                    //       permalink: "cpc/uspto/show/all/A21/2019/",
                    //       regexp: new RegExp(/tree_map\/cpc\/uspto\/show\/all\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                    //     }]
                    // },
                    {
                      name: t("Bilateral"), nest: [
                        {
                          name: t("Exports to Destination"),
                          permalink: `${cube}/export/${country}/${partner}/show/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/export\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports from Origin"),
                          permalink: `${cube}/import/${country}/${partner}/show/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/import\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports by Product"),
                          permalink: `${cube}/export/${country}/show/${viztype}/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/export\/\w{3}\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports by Product"),
                          permalink: `${cube}/import/${country}/show/${viztype}/${time}/`,
                          regexp: new RegExp(/tree_map\/\w+\/import\/\w{3}\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        }
                      ]
                    }
                    // {
                    //   name: t("Bilateral Technology"), nest: [
                    //     {name: t("Countries by Technology"), permalink: "cpc/export/all/all/H01/2019/"},
                    //     {name: t("Technologies by Country"), permalink: "cpc/export/chl/all/show/2019/"}
                    //   ]
                    // }
                  ]}
                />
              }
            />
            <Tab
              id="stacked"
              className={classNames({"is-selected": activeTab === "stacked"})}
              title={<TabTitle icon="stacked" title="Stacked" />}
              panel={
                <VbTab
                  chart="stacked"
                  activeOption={activeOption}
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Exports"),
                          permalink: `${cube}/export/${country}/all/show/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/export\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports"),
                          permalink: `${cube}/import/${country}/all/show/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/import\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Export Destinations"),
                          permalink: `${cube}/export/${country}/show/all/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/export\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Import Origins"),
                          permalink: `${cube}/import/${country}/show/all/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/import\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        }
                        // {
                        //   name: t("Technology"),
                        //   permalink: "cpc/export/chl/all/show/2019/",
                        //   regexp: new RegExp(/\w{2}\/visualize\/stacked\/cpc\/\w+\/\w+\/show\/all\/[0-9.-]+\//)
                        // }
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {
                          name: t("Exporters"),
                          permalink: `${cube}/export/show/all/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/export\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: `${cube}/import/show/all/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/import\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        }
                      ]
                    },
                    // {
                    //   name: t("Technology"), nest: [
                    //     {
                    //       name: t("Patenters"),
                    //       permalink: "cpc/import/chl/all/all/2019/",
                    //       regexp: new RegExp(/stacked\/cpc\/uspto\/show\/all\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                    //     }]
                    // },
                    {
                      name: t("Bilateral"), nest: [
                        {
                          name: t("Exports to Destination"),
                          permalink: `${cube}/export/${country}/${partner}/show/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/export\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports from Origin"),
                          permalink: `${cube}/import/${country}/${partner}/show/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/import\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports by Product"),
                          permalink: `${cube}/export/${country}/show/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/export\/\w{3}\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports by Product"),
                          permalink: `${cube}/import/${country}/show/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/stacked\/\w+\/import\/\w{3}\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        }
                      ]
                    }
                  ]}
                />
              }
            />
          </Tabs>
        </div>
      </div>

      {!isSubnat && <div className="columns is-tabs">
        <div className="column-1 tab">
          <Tabs
            key="tabs_network_rings_map"
            onChange={this.handleTabChange}
            selectedTabId={activeTab}
          >
            <Tab
              id="network"
              className={classNames({"is-selected": activeTab === "network"})}
              title={<TabTitle icon="network" title="Network" />}
              panel={
                <VbTab
                  chart="network"
                  activeOption={activeOption}
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Product Space"),
                          permalink: `${cube}/export/${country}/all/show/${time}/`,
                          regexp: new RegExp(/network\/\w+\/export\/\w+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Opportunity Gain Space"),
                          permalink: `${cube}/ogi/${country}/all/show/${time}/`,
                          regexp: new RegExp(/network\/\w+\/ogi\/\w+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Relatedness Space"),
                          permalink: `${cube}/relatedness/${country}/all/show/${time}/`,
                          regexp: new RegExp(/network\/\w+\/relatedness\/\w+\/all\/show\/[0-9.-]+\//)
                        }
                      ]
                    }
                  ]}
                />
              }
            />
            <Tab
              id="rings"

              className={classNames({"is-selected": activeTab === "rings"})}
              title={<TabTitle icon="rings" title="Rings" />}
              panel={
                <VbTab
                  chart="rings"
                  activeOption={activeOption}
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Product Connections"),
                          permalink: `${cube}/export/${country}/all/${viztype}/${time}/`,
                          regexp: new RegExp(/rings\/\w+\/export\/[a-z0-9.-]+\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        }
                      ]
                    }
                  ]}
                />
              }
            />
          </Tabs>
        </div>
      </div>}

      <div className="columns is-tabs">
        <div className="column-1 tab">
          <Tabs
            key="tabs_line_geo_map"
            onChange={this.handleTabChange}
            selectedTabId={activeTab}
          >
            <Tab
              id="geomap"
              className={classNames({"is-selected": activeTab === "geomap"})}
              title={<TabTitle icon="geo_map" title="Geo Map" />}
              panel={
                <VbTab
                  chart="geomap"
                  activeOption={activeOption}
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Export Destinations"),
                          permalink: `${cube}/export/${country}/show/all/${time}/`,
                          regexp: new RegExp(/geomap\/\w+\/export\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Import Origins"),
                          permalink: `${cube}/import/${country}/show/all/${time}/`,
                          regexp: new RegExp(/geomap\/\w+\/import\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        }
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {
                          name: t("Exporters"),
                          permalink: `${cube}/export/show/all/${viztype}/${time}/`,
                          regexp: new RegExp(/geomap\/\w+\/export\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: `${cube}/import/show/all/${viztype}/${time}/`,
                          regexp: new RegExp(/geomap\/\w+\/import\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        }
                      ]
                    },
                    {
                      name: t("Bilateral"), nest: [
                        {
                          name: t("Exports by Product"), // ((?!.*(all|show)).*)
                          permalink: `${cube}/export/${country}/show/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/geomap\/\w+\/export\/[a-z0-9.-]+\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports by Product"),
                          permalink: `${cube}/import/${country}/show/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/geomap\/\w+\/import\/[a-z0-9.-]+\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        }
                      ]
                    }
                  ]}
                />
              }
            />
            <Tab
              id="line"
              className={classNames({"is-selected": activeTab === "line"})}
              title={<TabTitle icon="line" title="Line" />}
              panel={
                <VbTab
                  activeOption={activeOption}
                  chart="line"
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Trade Balance"),
                          permalink: `${cube}/show/${country}/all/all/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/show\/[a-z0-9.-]+\/all\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports"),
                          permalink: `${cube}/export/${country}/all/show/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/export\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports"),
                          permalink: `${cube}/import/${country}/all/show/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/import\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Export Destinations"),
                          permalink: `${cube}/export/${country}/show/all/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/export\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Import Origins"),
                          permalink: `${cube}/import/${country}/show/all/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/import\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        }
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {
                          name: t("Exporters"),
                          permalink: `${cube}/export/show/all/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/export\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: `${cube}/import/show/all/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/import\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        }
                      ]
                    },
                    {
                      name: t("Bilateral"), nest: [
                        {
                          name: t("Exports to Destination"),
                          permalink: `${cube}/export/${country}/${partner}/show/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/export\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports from Origin"),
                          permalink: `${cube}/import/${country}/${partner}/show/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/import\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports by Product"), // ((?!.*(all|show)).*)
                          permalink: `${cube}/export/${country}/show/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/export\/[a-z0-9.-]+\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports by Product"),
                          permalink: `${cube}/import/${country}/show/${viztype}/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/import\/[a-z0-9.-]+\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Trade Balance"),
                          permalink: `${cube}/show/${country}/${partner}/all/${timePlot}/`,
                          regexp: new RegExp(/line\/\w+\/show\/[a-z0-9.-]+\/(?!all\/)(.*)\/all\/[0-9.-]+\//)
                        }
                      ]
                    }
                    // {
                    //   name: t("ECI Rankings"), nest: [
                    //     {name: t("All Countries")},
                    //     {name: t("Specific Country")}
                    //   ]
                    // }
                  ]}
                />
              }
            />
          </Tabs>
        </div>
      </div>
      {!isSubnat && <div className="columns is-tabs">
        <div className="column-1 tab">
          <Tabs
            key="tabs_scatter_map"
            onChange={this.handleTabChange}
            selectedTabId={activeTab}
          >
            <Tab
              id="scatter"
              className={classNames({"is-selected is-fullwidth": activeTab === "scatter"})}
              title={<TabTitle icon="scatter" title="Scatter" />}
              panel={
                <VbTab
                  activeOption={activeOption}
                  chart="scatter"
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Select"), nest: [
                        {
                          name: t("Show options"),
                          permalink: `hs92/${scatterFlow}/${scatterCountry}/all/all/${time}/`,
                          // `${cube}/${flow}/${country}/all/all/${time}/`
                          regexp: new RegExp(/scatter/)
                        }
                      ]
                    }
                  ]}
                />
              }
            />

          </Tabs>
        </div>
      </div>}
    </div>;
  }
}

export default withNamespaces()(VbTabs);
