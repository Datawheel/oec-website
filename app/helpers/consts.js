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
    {title: "Reports", items: [
      {title: "Countries",          url: `/${locale}/profile/country/`},
      {title: "Products",           url: `/${locale}/profile/hs92/`},
      {title: "States/Provinces",   url: `/${locale}/subnational/`, pro: true},
      {title: "Country to Country", url: `/${locale}/profile/bilateral-country/`, pro: true},
      {title: "Product in Country", url: `/${locale}/profile/bilateral-product/`, pro: true}
    ]},
    // rankings
    {title: "Rankings", items: [
      {title: "Country", url: `/${locale}/rankings/`},
      {title: "Product", url: `/${locale}/rankings/`}
    ]},
    // tools
    {title: "Tools", items: [
      {title: "Predictions",     url: `/${locale}/prediction?dataset=trade-annual`},
      {title: "Tariff Explorer", url: `/${locale}/tariffs/?destinations=xxwld`},
      {title: "Visualizations",  url: `/${locale}/visualize/tree_map/hs92/export/deu/all/show/2018/`},
      {title: "Data Download",   url: `/${locale}/resources/data/`},
      {title: "API",             url: `/${locale}/resources/api`}
    ]},
    // academy
    {title: "Academy", items: [
      {title: "Definitions",  url: `/${locale}/resources/definitions`},
      {title: "Library",  url: `/${locale}/resources/library`},
      {title: "FAQs",         url: `/${locale}/resources/faq`},
      {title: "Publications", url: `/${locale}/resources/publications`}
    ]},
    // about
    {title: "About", items: [
      {title: "About the OEC",  url: `/${locale}/resources/about`},
      {title: "Permissions",    url: `/${locale}/resources/permissions`},
      {title: "Privacy Policy", url: `/${locale}/resources/privacy`},
      {title: "Terms",          url: `/${locale}/resources/terms`}
    ]}
  ],
  SUBNATIONAL_COUNTRIES: [
    // {
    //   name: "Brazil",
    //   code: "bra",
    //   cube: "trade_s_bra_mun_m_hs",
    //   dimension: "Subnat Geography",
    //   limit: 7000,
    //   geoLevels: [

    //     /* {name: "Region", level: "Region", slug: "regions"},*/
    //     {name: "States", overrideCube: "trade_s_bra_ncm_m_hs", profileSlug: "subnational_bra_state", level: "Subnat Geography", slug: "states", ignoreIdsList: ["93", "95"]},
    //     {name: "Municipalities", profileSlug: "subnational_bra_municipality", level: "Subnat Geography", slug: "municipalities"}
    //   ]
    // },
    {
      name: "Japan",
      code: "jpn",
      cube: "trade_s_jpn_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Region", slug: "regions"},
        {name: "Prefectures", level: "Subnat Geography", slug: "prefectures"}
      ]
    },
    // {
    //   name: "Russia",
    //   code: "rus",
    //   cube: "trade_s_rus_m_hs",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {
    //       name: "Districts",
    //       level: "District",
    //       slug: "districts",
    //       extraMapConfig: {
    //         projectionRotate: [-70, 0]
    //       }
    //     },
    //     {
    //       name: "Regions",
    //       level: "Subnat Geography",
    //       slug: "regions",
    //       extraMapConfig: {
    //         projectionRotate: [-90, 0]
    //       }
    //     }
    //   ]
    // },
    {
      name: "Canada",
      code: "can",
      cube: "trade_s_can_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces", ignoreIdsList: ["1"]}
      ]
    },
    // {
    //   name: "Uruguay",
    //   code: "ury",
    //   cube: "trade_s_ury_a_hs",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {name: "Corridor", level: "Corridor", slug: "corridors", ignoreIdsList: ["na"]},
    //     {name: "Departments", level: "Subnat Geography", slug: "departments", ignoreIdsList: ["5"]}
    //   ]
    // },
    {
      name: "Germany",
      code: "deu",
      cube: "trade_s_deu_m_egw",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Subnat Geography", slug: "regions"}
      ]
    },
    // {
    //   name: "USA",
    //   code: "usa",
    //   cube: "trade_s_usa_district_m_hs",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {
    //       overrideCube: "trade_s_usa_state_m_hs",
    //       name: "States",
    //       level: "Subnat Geography",
    //       slug: "states",
    //       ignoreIdsMap: [
    //         "04000US60", "04000US69", "04000US66"
    //       ],
    //       extraMapConfig: {
    //         projection: d3_composite.geoAlbersUsaTerritories()
    //       },
    //       profileSlug: "subnational_usa_state"
    //     },
    //     {
    //       name: "Districts",
    //       level: "Subnat Geography",
    //       slug: "districts",
    //       extraMapConfig: {
    //         projection: d3_composite.geoAlbersUsaTerritories()
    //       },
    //       profileSlug: "subnational_usa_district"
    //     }
    //   ]
    // },
    // {
    //   name: "Turkey",
    //   code: "tur",
    //   cube: "trade_s_tur_m_countries",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
    //   ]
    // },
    // {
    //   name: "Spain",
    //   code: "esp",
    //   cube: "trade_s_esp_m_hs",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {
    //       name: "Autonomous Communities", level: "Autonomous Communities", slug: "autonomous",
    //       extraMapConfig: {
    //         projection: d3_composite.geoConicConformalSpain()
    //       },
    //       ignoreIdsList: ["100"]
    //     },
    //     {
    //       name: "Provinces", level: "Subnat Geography", slug: "provinces",
    //       extraMapConfig: {
    //         projection: d3_composite.geoConicConformalSpain()
    //       },
    //       ignoreIdsList: ["0"]
    //     }
    //   ]
    // },
    // {
    //   name: "South Africa",
    //   code: "zaf",
    //   cube: "trade_s_zaf_m_hs",
    //   dimension: "Port of Entry",
    //   geoLevels: [
    //     {name: "Ports", level: "Port of Entry", slug: "ports"}
    //   ]
    // },
    {
      name: "China",
      code: "chn",
      cube: "trade_s_chn_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
      ]
    }
    // {
    //   name: "France",
    //   code: "fra",
    //   cube: "trade_s_fra_q_cpf",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {name: "Regions", level: "Region", slug: "regions", ignoreIdsList: ["24"]},
    //     {name: "Departments", level: "Subnat Geography", slug: "departments"}
    //   ]
    // },
    // {
    //   name: "Bolivia",
    //   code: "bol",
    //   cube: "trade_s_bol_m_sitc3",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {name: "Departments", level: "Subnat Geography", slug: "departments"}
    //   ]
    // },
    // {
    //   name: "Ecuador",
    //   code: "ecu",
    //   cube: "trade_s_ecu_m_hs",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {name: "Ports", level: "Subnat Geography", slug: "ports"}
    //   ]
    // },
    // {
    //   name: "Great Britain",
    //   code: "gbr",
    //   cube: "trade_s_gbr_m_hs",
    //   dimension: "Subnat Geography",
    //   geoLevels: [
    //     {name: "Ports", level: "Subnat Geography", slug: "ports"}
    //   ]
    // }
    // TODO: CHL
    // TBD: SWE -> no units, ignore it.
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
          dataUrl: "?cube=trade_i_baci_a_92&time=year.latest&drilldowns=Exporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Exporter+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Exporter Country",
          id: "origins",
          name: "Origin Country",
          selected: []
        },
        {
          dataUrl: "?cube=trade_i_baci_a_92&time=year.latest&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "?cube=trade_i_baci_a_92&time=year.latest&drilldowns=Exporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Exporter+Country+ISO+3",
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
          dataUrl: "?cube=trade_i_comtrade_m_hs&drilldowns=Reporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Reporter+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Reporter Country",
          id: "origins",
          name: "Origin Country",
          selected: []
        },
        {
          dataUrl: "?cube=trade_i_comtrade_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "?cube=trade_i_comtrade_m_hs&drilldowns=Partner+Country&measures=Trade+Value&parents=true&sparse=false&properties=Partner+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "destinations",
          name: "Destination Country",
          selected: []
        }
      ],
      toggles: [
        {
          data: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}, {id: 1, displayId: "imports", name: "Imports", color: colors["Trade Flow"][1]}],
          dimName: "Trade Flow",
          id: "trade_flow",
          name: "Trade Flow",
          selected: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}]
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
          dataUrl: "?cube=trade_s_can_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Province or Territory",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_can_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_can_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Country",
          id: "destinations",
          name: "Partner Country",
          selected: []
        }
      ],
      toggles: [
        {
          data: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}, {id: 1, displayId: "imports", name: "Imports", color: colors["Trade Flow"][1]}],
          dimName: "Trade Flow",
          id: "trade_flow",
          name: "Trade Flow",
          selected: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}]
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
          dataUrl: "?cube=trade_s_deu_m_egw&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Province or Territory",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_deu_m_egw&Year=2017&drilldowns=Product&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["Product ID"], displayId: d["Product ID"], name: d.Product, color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Product",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_deu_m_egw&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Country",
          id: "destinations",
          name: "Partner Country",
          selected: []
        }
      ],
      toggles: [
        {
          data: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}, {id: 1, displayId: "imports", name: "Imports", color: colors["Trade Flow"][1]}],
          dimName: "Trade Flow",
          id: "trade_flow",
          name: "Trade Flow",
          selected: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}]
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
          dataUrl: "?cube=trade_s_jpn_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Prefecture",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_jpn_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_jpn_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Country",
          id: "destinations",
          name: "Partner Country",
          selected: []
        }
      ],
      toggles: [
        {
          data: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}, {id: 1, displayId: "imports", name: "Imports", color: colors["Trade Flow"][1]}],
          dimName: "Trade Flow",
          id: "trade_flow",
          name: "Trade Flow",
          selected: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}]
        }
      ]
    }
    // {
    //   name: "🇷🇺 Russia Subnational",
    //   slug: "subnat-rus",
    //   cube: "trade_s_rus_m_hs",
    //   selectionsLoaded: false,
    //   dateDrilldown: "Time",
    //   currencyFormat: d => `${d3plus_format.formatAbbreviate(d)} ₽`,
    //   selections: [
    //     {
    //       dataUrl: "?cube=trade_s_rus_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
    //       data: [],
    //       dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
    //       dimName: "Subnat Geography",
    //       id: "subnats",
    //       name: "Russian Region",
    //       selected: []
    //     },
    //     {
    //       dataUrl: "?cube=trade_s_rus_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
    //       data: [],
    //       dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
    //       dimName: "HS4",
    //       id: "products",
    //       name: "Product",
    //       selected: []
    //     },
    //     {
    //       dataUrl: "?cube=trade_s_rus_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
    //       data: [],
    //       dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
    //       dimName: "Country",
    //       id: "destinations",
    //       name: "Partner Country",
    //       selected: []
    //     }
    //   ],
    //   toggles: [
    //     {
    //       data: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}, {id: 1, displayId: "imports", name: "Imports", color: colors["Trade Flow"][1]}],
    //       dimName: "Trade Flow",
    //       id: "trade_flow",
    //       name: "Trade Flow",
    //       selected: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}]
    //     }
    //   ]
    // },
    // {
    //   name: "🇪🇸 Spain Subnational",
    //   slug: "subnat-esp",
    //   cube: "trade_s_esp_m_hs",
    //   selectionsLoaded: false,
    //   dateDrilldown: "Time",
    //   currencyFormat: d => `€${d3plus_format.formatAbbreviate(d)}`,
    //   selections: [
    //     {
    //       dataUrl: "?cube=trade_s_esp_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
    //       data: [],
    //       dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
    //       dimName: "Subnat Geography",
    //       id: "subnats",
    //       name: "Autonomous Community",
    //       selected: []
    //     },
    //     {
    //       dataUrl: "?cube=trade_s_esp_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
    //       data: [],
    //       dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
    //       dimName: "HS4",
    //       id: "products",
    //       name: "Product",
    //       selected: []
    //     },
    //     {
    //       dataUrl: "?cube=trade_s_esp_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
    //       data: [],
    //       dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
    //       dimName: "Country",
    //       id: "destinations",
    //       name: "Partner Country",
    //       selected: []
    //     }
    //   ],
    //   toggles: [
    //     {
    //       data: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}, {id: 1, displayId: "imports", name: "Imports", color: colors["Trade Flow"][1]}],
    //       dimName: "Trade Flow",
    //       id: "trade_flow",
    //       name: "Trade Flow",
    //       selected: [{id: 2, displayId: "exports", name: "Exports", color: colors["Trade Flow"][2]}]
    //     }
    //   ]
    // }
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
          dataUrl: "/olap-proxy/data.jsonrecords?cube=tariffs_i_wits_a_hs&drilldowns=Reporter+Country&measures=Ad+Valorem&parents=true&sparse=false&properties=Reporter+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Reporter Country",
          id: "reporters",
          name: "Reporting Country",
          selected: []
        },
        {
          dataUrl: "/olap-proxy/data.jsonrecords?cube=tariffs_i_wits_a_hs&drilldowns=Partner+Country&measures=Ad+Valorem&parents=true&sparse=false&properties=Partner+Country+ISO+3",
          data: [],
          dataMap: d => ({id: d["Country ID"], displayId: d["ISO 3"], name: d.Country, color: colors.Continent[d["Continent ID"]]}),
          dimName: "Partner Country",
          id: "partners",
          name: "Partner Country",
          selected: [{id: "xxwld", displayId: "wld", name: "World", color: "#d4d4d4"}]
        },
        {
          dataUrl: "/olap-proxy/data.jsonrecords?cube=tariffs_i_wits_a_hs&time=year.latest&drilldowns=HS4&measures=Ad+Valorem&parents=true&sparse=false",
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
