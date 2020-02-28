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
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Exports"),
                          permalink: "hs92/export/chl/all/show/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/export\/[a-z.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports"),
                          permalink: "hs92/import/chl/all/show/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/import\/[a-z.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Export Destinations"),
                          permalink: "hs92/export/chl/show/all/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/export\/[a-z.-]+\/show\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Import Origins"),
                          permalink: "hs92/import/chl/show/all/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/import\/[a-z.-]+\/show\/all\/[0-9.-]+\//)
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
                          permalink: "hs92/export/show/all/10101/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/export\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: "hs92/import/show/all/10101/2017/",
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
                          permalink: "hs92/export/chl/arg/show/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/export\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports from Origin"),
                          permalink: "hs92/import/chl/arg/show/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/import\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports by Product"),
                          permalink: "hs92/export/chl/show/10101/2017/",
                          regexp: new RegExp(/tree_map\/\w+\/export\/\w{3}\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports by Product"),
                          permalink: "hs92/import/chl/show/10101/2017/",
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
              className={activeTab === "stacked" ? "is-selected" : ""}
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
                          permalink: "hs92/export/chl/all/show/2014.2017/",
                          regexp: new RegExp(/stacked\/\w+\/export\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports"),
                          permalink: "hs92/import/chl/all/show/2014.2017/",
                          regexp: new RegExp(/stacked\/\w+\/import\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Export Destinations"),
                          permalink: "hs92/export/chl/show/all/2014.2017/",
                          regexp: new RegExp(/stacked\/\w+\/export\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Import Origins"),
                          permalink: "hs92/import/chl/show/all/2014.2017/",
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
                          permalink: "hs92/export/show/all/10101/2014.2017/",
                          regexp: new RegExp(/stacked\/\w+\/export\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: "hs92/import/show/all/10101/2014.2017/",
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
                          permalink: "hs92/export/chl/arg/show/2012.2017/",
                          regexp: new RegExp(/stacked\/\w+\/export\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports from Origin"),
                          permalink: "hs92/import/chl/arg/show/2012.2017/",
                          regexp: new RegExp(/stacked\/\w+\/import\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports by Product"),
                          permalink: "hs92/export/chl/show/10101/2012.2017/",
                          regexp: new RegExp(/stacked\/\w+\/export\/\w{3}\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports by Product"),
                          permalink: "hs92/import/chl/show/10101/2012.2017/",
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
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Product Space"),
                          permalink: "hs92/export/deu/all/show/2017/",
                          regexp: new RegExp(/network\/\w+\/export\/\w+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Opportunity Gain Space"),
                          permalink: "hs92/pgi/deu/all/show/2017/",
                          regexp: new RegExp(/network\/\w+\/pgi\/\w+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Relatedness Space"),
                          permalink: "hs92/relatedness/deu/all/show/2017/",
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

              className={activeTab === "rings" ? "is-selected" : ""}
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
                          permalink: "hs92/export/chl/all/10101/2017/",
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
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Product"), nest: [
                        {
                          name: t("Exporters"),
                          permalink: "hs92/export/show/all/10101/2017/",
                          regexp: new RegExp(/geomap\/\w+\/export\/show\/all\/\w+\/\w+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: "hs92/import/show/all/10101/2017/",
                          regexp: new RegExp(/geomap\/\w+\/import\/show\/all\/\w+\/\w+\//)
                        }
                      ]
                    }
                    // {
                    //   name: t("Technology"), nest: [
                    //     {
                    //       name: t("Patenters"),
                    //       permalink: "cpc/uspto/show/all/A21/2019/",
                    //       regexp: new RegExp(/geomap\/cpc\/uspto\/show\/all\/\w+\/\w+\//)
                    //     }
                    //   ]
                    // }
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
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Country"), nest: [
                        {
                          name: t("Trade Balance"),
                          permalink: "hs92/show/chl/all/all/1995.2017/",
                          regexp: new RegExp(/line\/\w+\/show\/[a-z0-9.-]+\/all\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports"),
                          permalink: "hs92/export/arg/all/show/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/export\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports"),
                          permalink: "hs92/import/arg/all/show/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/import\/[a-z0-9.-]+\/all\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Export Destinations"),
                          permalink: "hs92/export/arg/show/all/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/export\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("Import Origins"),
                          permalink: "hs92/import/arg/show/all/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/import\/[a-z0-9.-]+\/show\/all\/[0-9.-]+\//)
                        }
                      ]
                    },
                    {
                      name: t("Product"), nest: [
                        {
                          name: t("Exporters"),
                          permalink: "hs92/export/show/all/10101/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/export\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        },
                        {
                          name: t("Importers"),
                          permalink: "hs92/import/show/all/10101/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/import\/show\/all\/[a-z0-9.-]+\/[0-9.-]+\//)
                        }
                      ]
                    },
                    {
                      name: t("Bilateral"), nest: [
                        {
                          name: t("Exports to Destination"),
                          permalink: "hs92/export/chl/arg/show/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/export\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports from Origin"),
                          permalink: "hs92/import/chl/arg/show/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/import\/((?!.*all).*)\/((?!.*all).*)\/show\/[0-9.-]+\//)
                        },
                        {
                          name: t("Exports by Product"), // ((?!.*(all|show)).*)
                          permalink: "hs92/export/chl/show/10101/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/export\/[a-z0-9.-]+\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Imports by Product"),
                          permalink: "hs92/import/chl/show/10101/2014.2017/",
                          regexp: new RegExp(/line\/\w+\/import\/[a-z0-9.-]+\/show\/((?!.*(all|show)).*)\/[0-9.-]+\//)
                        },
                        {
                          name: t("Trade Balance"),
                          permalink: "hs92/show/chl/chn/all/1995.2017/",
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
                  callback={d => this.props.callback(d)}
                  items={[
                    {
                      name: t("Economic Complexity"), nest: [
                        {
                          name: t("vs GDP"),
                          permalink: "hs92/OEC.ECI/NY.GDP.MKTP.CD/all/all/2012/",
                          regexp: new RegExp(/scatter\/\w+\/OEC.ECI\/NY.GDP.MKTP.CD\/all\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("vs GDPpc (constant '10 US$)"),
                          permalink: "hs92/OEC.ECI/NY.GDP.PCAP.KD/all/all/2012/",
                          regexp: new RegExp(/scatter\/\w+\/OEC.ECI\/NY.GDP.PCAP.KD\/all\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("vs GDPpc (current US$)"),
                          permalink: "hs92/OEC.ECI/NY.GDP.PCAP.CD/all/all/2012/",
                          regexp: new RegExp(/scatter\/\w+\/OEC.ECI\/NY.GDP.PCAP.CD\/all\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("vs GDPpc PPP (constant '11)"),
                          permalink: "hs92/OEC.ECI/NY.GDP.PCAP.PP.KD/all/all/2012/",
                          regexp: new RegExp(/scatter\/\w+\/OEC.ECI\/NY.GDP.PCAP.PP.KD\/all\/all\/[0-9.-]+\//)
                        },
                        {
                          name: t("vs GDPpc PPP (current)"),
                          permalink: "hs92/OEC.ECI/NY.GDP.PCAP.PP.CD/all/all/2012/",
                          regexp: new RegExp(/scatter\/\w+\/OEC.ECI\/NY.GDP.PCAP.PP.CD\/all\/all\/[0-9.-]+\//)
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
    </div>;
  }
}

export default withNamespaces()(VbTabs);
