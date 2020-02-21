const toHS = require("helpers/funcs.js").toHS;
const colors = require("helpers/colors.js");
const d3_composite = require("d3-composite-projections");
const d3plus_format = require("d3plus-format");
const locale = "en";
const DEFAULT_PREDICTION_COLOR = "#209292";

module.exports = {
  EMAIL: "support@oec.world",
  DEFAULT_PREDICTION_COLOR,
  NAV: [
    // profiles
    {title: "Profiles", items: [
      {title: "Location", items: [
        {title: "Country",            url: `/${locale}/profile/country/`},
        {title: "Subnational",        url: `/${locale}/subnational/`, pro: true},
        {title: "Country to country", url: `/${locale}/profile/bilateral-country/`, pro: true}
      ]},
      {title: "Product", items: [
        {title: "Product",            url: `/${locale}/profile/hs92/`},
        {title: "Product in country", url: `/${locale}/profile/bilateral-product/`, pro: true}
      ]},
      {title: "Research", items: [
        {title: "Technology",         url: `/${locale}/profile/technology`},
        {title: "Firm",               url: `/${locale}/profile/firm`}
      ]}
    ]},
    {title: "Subnational", items: [
      {title: "🇧🇷 Brazil", url: `/${locale}/subnational/#subnational-country-block-bra`},
      {title: "🇧🇴 Bolivia", url: `/${locale}/subnational/#subnational-country-block-bol`},
      {title: "🇨🇦 Canada", url: `/${locale}/subnational/#subnational-country-block-can`},
      {title: "🇨🇱 Chile", url: `/${locale}/subnational/#subnational-country-block-chl`},
      {title: "🇨🇳 China", url: `/${locale}/subnational/#subnational-country-block-chn`},
      {title: "🇨🇴 Colombia", url: `/${locale}/subnational/#subnational-country-block-col`},
      {title: "🇫🇷 France", url: `/${locale}/subnational/#subnational-country-block-fra`},
      {title: "🇩🇪 Germany", url: `/${locale}/subnational/#subnational-country-block-deu`},
      {title: "🇮🇳 India", url: `/${locale}/subnational/#subnational-country-block-ind`},
      {title: "🇯🇵 Japan", url: `/${locale}/subnational/#subnational-country-block-jpn`},
      {title: "🇷🇺 Russia", url: `/${locale}/subnational/#subnational-country-block-rus`},
      {title: "🇿🇦 S. Africa", url: `/${locale}/subnational/#subnational-country-block-zaf`},
      {title: "🇪🇸 Spain", url: `/${locale}/subnational/#subnational-country-block-esp`},
      {title: "🇹🇷 Turkey", url: `/${locale}/subnational/#subnational-country-block-tur`},
      {title: "🇺🇾 Uruguay", url: `/${locale}/subnational/#subnational-country-block-ury`},
      {title: "🇺🇸 USA", url: `/${locale}/subnational/#subnational-country-block-usa`},
      {title: "🇬🇧 UK", url: `/${locale}/subnational/#subnational-country-block-gbr`}
    ]},
    // visualizations
    {title: "Visualizations", items: [
      {title: "Tree map",     url: `/${locale}/visualize/tree_map/hs92/export/deu/all/show/2017/`, icon: "visualizations/tree-map"},
      {title: "Stacked area", url: `/${locale}/visualize/stacked/hs92/export/pry/all/show/1995.2017/`, icon: "visualizations/stacked"},
      {title: "Line chart",   url: `/${locale}/visualize/line/hs92/export/pry/all/show/1995.2017/`, icon: "visualizations/line"},
      {title: "Network",      url: `/${locale}/visualize/network/hs92/export/deu/all/show/2017/`, icon: "visualizations/network"},
      {title: "Ring",         url: `/${locale}/visualize/rings/hs92/export/deu/all/show/2017/`, icon: "visualizations/ring"},
      {title: "Scatter plot", url: `/${locale}/visualize/scatter`, icon: "visualizations/scatter"},
      {title: "Geo map",      url: `/${locale}/visualize/geo-map`, icon: "visualizations/geo-map"}
    ]},
    // rankings
    {title: "Rankings", items: [
      {title: "Country rankings", url: `/${locale}/rankings/country/eci/`},
      {title: "Product rankings", url: `/${locale}/rankings/product/hs92/`}
    ]},
    // about
    {title: "Resources", items: [
      {title: "About the OEC",  url: `/${locale}/resources/about`},
      {title: "Methodology",    url: `/${locale}/resources/methodology`},
      {title: "FAQs",           url: `/${locale}/resources/faq`},
      {title: "Publications",   url: `/${locale}/resources/publications`},
      {title: "Data Sources",   url: `/${locale}/resources/data/`},
      {title: "API",            url: `/${locale}/resources/api`},
      {title: "Permissions",    url: `/${locale}/resources/permissions`},
      {title: "Privacy Policy", url: `/${locale}/resources/privacy`},
      {title: "Terms",          url: `/${locale}/resources/terms`}
    ]},
    // predictions
    {title: "Predictions", items: [
      {title: "🌐 World Trade Predictions (annual)", url: `/${locale}/prediction?dataset=trade-annual`},
      {title: "🌐 World Trade Predictions (monthly)", url: `/${locale}/prediction?dataset=trade-monthly`},
      {title: "🇨🇦 Canada Subnational Predictions", url: `/${locale}/prediction?dataset=subnat-can`},
      {title: "🇩🇪 Germany Subnational Predictions", url: `/${locale}/prediction?dataset=subnat-deu`},
      {title: "🇯🇵 Japan Subnational Predictions", url: `/${locale}/prediction?dataset=subnat-jpn`},
      {title: "🇷🇺 Russia Subnational Predictions", url: `/${locale}/prediction?dataset=subnat-rus`},
      {title: "🇪🇸 Spain Subnational Predictions", url: `/${locale}/prediction?dataset=subnat-esp`}
    ]},
    // tariffs
    {title: "Tariff Explorer", url: `/${locale}/tariffs/?destinations=xxwld`}
  ],
  SUBNATIONAL_COUNTRIES: [
    {
      name: "Brazil",
      code: "bra",
      cube: "trade_s_bra_mun_m_hs",
      dimension: "Subnat Geography",
      limit: 7000,
      geoLevels: [

        /* {name: "Region", level: "Region", slug: "regions"},*/
        {name: "States", level: "State", slug: "states", ignoreIdsList: ["93", "95"]},
        {name: "Municipalities", level: "Subnat Geography", slug: "municipalities"}
      ]
    },
    {
      name: "Japan",
      code: "jpn",
      cube: "trade_s_jpn_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Area", slug: "regions"},
        {name: "Prefectures", level: "Subnat Geography", slug: "prefectures"}
      ]
    },
    {
      name: "Russia",
      code: "rus",
      cube: "trade_s_rus_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {
          name: "Districts",
          level: "District",
          slug: "districts",
          extraMapConfig: {
            projectionRotate: [-70, 0]
          }
        },
        {
          name: "Regions",
          level: "Subnat Geography",
          slug: "regions",
          extraMapConfig: {
            projectionRotate: [-90, 0]
          }
        }
      ]
    },
    {
      name: "Canada",
      code: "can",
      cube: "trade_s_can_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces", ignoreIdsList: ["1"]}
      ]
    },
    {
      name: "Uruguay",
      code: "ury",
      cube: "trade_s_ury_a_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Corridor", level: "Corridor", slug: "corridors", ignoreIdsList: ["na"]},
        {name: "Departments", level: "Subnat Geography", slug: "departments", ignoreIdsList: ["5"]}
      ]
    },
    {
      name: "Germany",
      code: "deu",
      cube: "trade_s_deu_m_egw",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Subnat Geography", slug: "regions"}
      ]
    },
    {
      name: "USA",
      code: "usa",
      cube: "trade_s_usa_district_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {
          name: "States",
          level: "State",
          slug: "states",
          ignoreIdsMap: [
            "04000US60", "04000US69", "04000US66"
          ],
          extraMapConfig: {
            projection: d3_composite.geoAlbersUsaTerritories()
          }
        },
        {
          name: "Districts",
          level: "Subnat Geography",
          slug: "districts",
          extraMapConfig: {
            projection: d3_composite.geoAlbersUsaTerritories()
          }
        }
      ]
    },
    {
      name: "Turkey",
      code: "tur",
      cube: "trade_s_tur_m_countries",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
      ]
    },
    {
      name: "Spain",
      code: "esp",
      cube: "trade_s_esp_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {
          name: "Autonomous Communities", level: "Autonomous Communities", slug: "autonomous",
          extraMapConfig: {
            projection: d3_composite.geoConicConformalSpain()
          }
        },
        {
          name: "Provinces", level: "Subnat Geography", slug: "provinces",
          extraMapConfig: {
            projection: d3_composite.geoConicConformalSpain()
          }
        }
      ]
    },
    {
      name: "South Africa",
      code: "zaf",
      cube: "trade_s_zaf_m_hs",
      dimension: "Port of Entry",
      geoLevels: [
        {name: "Ports", level: "Port of Entry", slug: "ports"}
      ]
    },
    {
      name: "China",
      code: "chn",
      cube: "trade_s_chn_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
      ]
    }
    // TODO: CHL, ECU, FRA
    // TBD: ZAF -> ports, take a look , SWE -> no units, ignore it.
  ],

  PREDICTION_DATASETS: [
    {
      name: "🌐 Trade (annual)",
      slug: "trade-annual",
      cube: "trade_i_baci_a_92",
      selectionsLoaded: false,
      dateDrilldown: "Year",
      currencyFormat: d => `$${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&time=year.latest&drilldowns=Exporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Exporter+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Exporter Country",
          id: "origins",
          name: "Origin Country",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&time=year.latest&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&time=year.latest&drilldowns=Exporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Exporter+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Importer Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ]
    },
    {
      name: "🌐 Trade (monthly)",
      slug: "trade-monthly",
      cube: "trade_i_comtrade_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `$${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_comtrade_m_hs&drilldowns=Reporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Reporter+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Reporter Country",
          id: "origins",
          name: "Origin Country",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_comtrade_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_comtrade_m_hs&drilldowns=Partner+Country&measures=Trade+Value&parents=true&sparse=false&properties=Partner+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ]
    },
    {
      name: "🇨🇦 Canada Subnational",
      slug: "subnat-can",
      cube: "trade_s_can_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `CAN ${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_can_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Province or Territory",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_can_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_can_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ]
    },
    {
      name: "🇩🇪 Germany Subnational",
      slug: "subnat-deu",
      cube: "trade_s_deu_m_egw",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `€${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_deu_m_egw&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Province or Territory",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_deu_m_egw&Year=2017&drilldowns=Product&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["Product ID"], displayId: d["Product ID"], name: d.Product, color: DEFAULT_PREDICTION_COLOR}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_deu_m_egw&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ]
    },
    {
      name: "🇯🇵 Japan Subnational",
      slug: "subnat-jpn",
      cube: "trade_s_jpn_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `¥ ${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_jpn_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Prefecture",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_jpn_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_jpn_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ]
    },
    {
      name: "🇷🇺 Russia Subnational",
      slug: "subnat-rus",
      cube: "trade_s_rus_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `${d3plus_format.formatAbbreviate(d)} ₽`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_rus_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Russian Region",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_rus_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_rus_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ]
    },
    {
      name: "🇪🇸 Spain Subnational",
      slug: "subnat-esp",
      cube: "trade_s_esp_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `€${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_esp_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "City",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_esp_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_s_esp_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ]
    }
  ],

  TARIFF_DATASETS: [
    {
      name: "Trade (annual)",
      slug: "trade-annual",
      cube: "tariffs_i_wits_a_hs",
      selectionsLoaded: false,
      dateDrilldown: "Year",
      currencyFormat: d => `$${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=tariffs_i_wits_a_hs&drilldowns=Reporter+Country&measures=Ad+Valorem&parents=true&sparse=false&properties=Reporter+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Reporter Country",
          id: "origins",
          name: "Exporting Country",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=tariffs_i_wits_a_hs&drilldowns=Partner+Country&measures=Ad+Valorem&parents=true&sparse=false&properties=Partner+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        },
        {
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=tariffs_i_wits_a_hs&time=year.latest&drilldowns=HS4&measures=Ad+Valorem&parents=true&sparse=false",
          data: [],
          // dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dataMap: d => ({...d, id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        }
      ]
    }
  ]
};
