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
    {
      title: "Reports", items: [
        {title: "Countries", url: `/${locale}/profile/country/`},
        {title: "Products", url: `/${locale}/profile/hs92/`},
        {title: "Country to Country", url: `/${locale}/profile/bilateral-country/`},
        {title: "Product in Country", url: `/${locale}/profile/bilateral-product/`},
        {
          title: "Subnational", url: `/${locale}/subnational/`, pro: true, items: [
            {title: "🇧🇷 Brazil", url: `/${locale}/subnational/#subnational-country-block-bra`, cubeName: "trade_s_bra_mun_m_hs"},
            // {title: "🇧🇴 Bolivia",url: `/${locale}/subnational/#subnational-country-block-bol`},
            {title: "🇨🇦 Canada", url: `/${locale}/subnational/#subnational-country-block-can`, cubeName: "trade_s_can_m_hs"},
            // {title: "🇨🇱 Chile",  url: `/${locale}/subnational/#subnational-country-block-chl`},
            {title: "🇨🇳 China",  url: `/${locale}/subnational/#subnational-country-block-chn`, cubeName: "trade_s_chn_m_hs"},
            // {title: "🇨🇴 Colombia",  url: `/${locale}/subnational/#subnational-country-block-col`},
            // {title: "🇫🇷 France", url: `/${locale}/subnational/#subnational-country-block-fra`},
            {title: "🇩🇪 Germany", url: `/${locale}/subnational/#subnational-country-block-deu`, cubeName: "trade_s_deu_m_egw"},
            // {title: "🇮🇳 India",  url: `/${locale}/subnational/#subnational-country-block-ind`},
            {title: "🇯🇵 Japan",  url: `/${locale}/subnational/#subnational-country-block-jpn`, cubeName: "trade_s_jpn_m_hs"},
            {title: "🇷🇺 Russia", url: `/${locale}/subnational/#subnational-country-block-rus`, cubeName: "trade_s_rus_m_hs"},
            {title: "🇿🇦 S. Africa", url: `/${locale}/subnational/#subnational-country-block-zaf`, cubeName: "trade_s_zaf_m_hs"},
            {title: "🇪🇸 Spain",  url: `/${locale}/subnational/#subnational-country-block-esp`, cubeName: "trade_s_esp_m_hs"},
            // {title: "🇹🇷 Turkey", url: `/${locale}/subnational/#subnational-country-block-tur`},
            // {title: "🇺🇾 Uruguay", url: `/${locale}/subnational/#subnational-country-block-ury`},
            // {title: "🇺🇸 USA", url: `/${locale}/subnational/#subnational-country-block-usa`},
            {title: "🇬🇧 UK", url: `/${locale}/subnational/#subnational-country-block-gbr`, cubeName: "trade_s_gbr_m_hs"}
          ]
        }
      ]
    },
    // rankings
    {
      title: "Rankings", items: [
        {
          title: "Countries (ECI)", items: [
            {
              title: "1995-2018 (HS92)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/eci/hs4/hs92`},
                {title: "6 Digit", url: `/${locale}/rankings/eci/hs6/hs92`}
              ]
            },
            {
              title: "1998-2018 (HS96)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/eci/hs4/hs96`},
                {title: "6 Digit", url: `/${locale}/rankings/eci/hs6/hs96`}
              ]
            },
            {
              title: "2003-2018 (HS02)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/eci/hs4/hs02`},
                {title: "6 Digit", url: `/${locale}/rankings/eci/hs6/hs02`}
              ]
            },
            {
              title: "2008-2018 (HS07)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/eci/hs4/hs07`},
                {title: "6 Digit", url: `/${locale}/rankings/eci/hs6/hs07`}
              ]
            },
            {
              title: "2012-2018 (HS12)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/eci/hs4/hs12`},
                {title: "6 Digit", url: `/${locale}/rankings/eci/hs6/hs12`}
              ]
            }
          ]
        },
        {
          title: "Products (PCI)", items: [
            {
              title: "1995-2018 (HS92)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/pci/hs4/hs92`},
                {title: "6 Digit", url: `/${locale}/rankings/pci/hs6/hs92`}
              ]
            },
            {
              title: "1998-2018 (HS96)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/pci/hs4/hs96`},
                {title: "6 Digit", url: `/${locale}/rankings/pci/hs6/hs96`}
              ]
            },
            {
              title: "2003-2018 (HS02)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/pci/hs4/hs02`},
                {title: "6 Digit", url: `/${locale}/rankings/pci/hs6/hs02`}
              ]
            },
            {
              title: "2008-2018 (HS07)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/pci/hs4/hs07`},
                {title: "6 Digit", url: `/${locale}/rankings/pci/hs6/hs07`}
              ]
            },
            {
              title: "2012-2018 (HS12)", items: [
                {title: "4 Digit", url: `/${locale}/rankings/pci/hs4/hs12`},
                {title: "6 Digit", url: `/${locale}/rankings/pci/hs6/hs12`}
              ]
            }
          ]
        },
        {title: "Custom Rankings", url: `/${locale}/rankings/custom`},
        {title: "ECI Legacy Rankings", url: `/${locale}/rankings/legacy_eci`},
        {title: "PCI Legacy Rankings", url: `/${locale}/rankings/legacy_pci/hs6/hs92`}
      ]
    },
    // tools
    {
      title: "Tools", items: [
        {title: "Trade Forecasts", url: `/${locale}/prediction?dataset=trade-annual`},
        {title: "Tariff Explorer", url: `/${locale}/tariffs/`, beta: true},
        {title: "Visualizations", url: `/${locale}/visualize`}
      ]
    },
    // academy
    {
      title: "Academy", items: [
        {title: "Methods", url: `/${locale}/resources/methods`},
        {title: "  Economic Complexity", url: `/${locale}/resources/methods#eci`},
        {title: "  Relatedness", url: `/${locale}/resources/methods#relatedness`},
        {title: "Library", url: `/${locale}/resources/library`},
        {title: "Publications", url: `/${locale}/resources/publications`}
      ]
    },
    // data
    {
      title: "Data", items: [
        {title: "Availability", url: `/${locale}/resources/data-availability`},
        {title: "Download", url: `/${locale}/resources/data/`},
        {title: "API", url: `/${locale}/resources/api`}
      ]
    },
    // about
    {
      title: "About", items: [
        {title: "About the OEC", url: `/${locale}/resources/about`},
        {title: "Privacy Policy", url: `/${locale}/resources/privacy`},
        {title: "Terms", url: `/${locale}/resources/terms`}
      ]
    }
  ],
  SUBNATIONAL_COUNTRIES: [
    {
      name: "Brazil",
      code: "bra",
      available: true,
      cube: "trade_s_bra_mun_m_hs",
      dimension: "Subnat Geography",
      limit: 7000,
      geoLevels: [

        /* {name: "Region", level: "Region", slug: "regions"},*/
        {name: "States", overrideCube: "trade_s_bra_ncm_m_hs", profileSlug: "subnational_bra_state", level: "Subnat Geography", slug: "states", ignoreIdsList: ["93", "95"]},
        {name: "Municipalities", profileSlug: "subnational_bra_municipality", level: "Subnat Geography", slug: "municipalities"}
      ]
    },
    {
      name: "Japan",
      code: "jpn",
      available: true,
      cube: "trade_s_jpn_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Region", slug: "regions"},
        {name: "Prefectures", level: "Subnat Geography", slug: "prefectures"}
      ]
    },
    {
      name: "Russia",
      code: "rus",
      available: true,
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
      available: true,
      cube: "trade_s_can_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces", ignoreIdsList: ["1"]}
      ]
    },
    {
      name: "Uruguay",
      code: "ury",
      available: false,
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
      available: true,
      cube: "trade_s_deu_m_egw",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Subnat Geography", slug: "regions"}
      ]
    },
    {
      name: "USA",
      code: "usa",
      available: true,
      cube: "trade_s_usa_district_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {
          overrideCube: "trade_s_usa_state_m_hs",
          name: "States",
          level: "Subnat Geography",
          slug: "states",
          ignoreIdsMap: [
            "04000US60", "04000US69", "04000US66"
          ],
          extraMapConfig: {
            projection: d3_composite.geoAlbersUsaTerritories()
          },
          profileSlug: "subnational_usa_state"
        },
        {
          name: "Districts",
          level: "Subnat Geography",
          slug: "districts",
          extraMapConfig: {
            projection: d3_composite.geoAlbersUsaTerritories()
          },
          profileSlug: "subnational_usa_district"
        },
        {
          overrideCube: "trade_s_usa_port_m_hs",
          name: "Ports",
          level: "Subnat Geography",
          slug: "ports",
          ignoreIdsMap: [],
          extraMapConfig: {
            projection: d3_composite.geoAlbersUsaTerritories()
          },
          profileSlug: "subnational_usa_port"
        }
      ]
    },
    {
      name: "Turkey",
      code: "tur",
      available: false,
      cube: "trade_s_tur_m_countries",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
      ]
    },
    {
      name: "Spain",
      code: "esp",
      available: true,
      cube: "trade_s_esp_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {
          name: "Autonomous Communities", level: "Autonomous Communities", slug: "autonomous",
          extraMapConfig: {
            projection: d3_composite.geoConicConformalSpain()
          },
          ignoreIdsList: ["100"]
        },
        {
          name: "Provinces", level: "Subnat Geography", slug: "provinces",
          extraMapConfig: {
            projection: d3_composite.geoConicConformalSpain()
          },
          ignoreIdsList: ["0"]
        }
      ]
    },
    {
      name: "South Africa",
      code: "zaf",
      available: true,
      cube: "trade_s_zaf_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Ports", level: "Subnat Geography", slug: "ports"}
      ]
    },
    {
      name: "China",
      code: "chn",
      available: true,
      cube: "trade_s_chn_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
      ]
    },
    {
      name: "France",
      code: "fra",
      available: false,
      cube: "trade_s_fra_q_cpf",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Region", slug: "regions", ignoreIdsList: ["24"]},
        {name: "Departments", level: "Subnat Geography", slug: "departments"}
      ]
    },
    {
      name: "Bolivia",
      code: "bol",
      available: false,
      cube: "trade_s_bol_m_sitc3",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Departments", level: "Subnat Geography", slug: "departments"}
      ]
    },
    {
      name: "Ecuador",
      code: "ecu",
      available: false,
      cube: "trade_s_ecu_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Ports", level: "Subnat Geography", slug: "ports"}
      ]
    },
    {
      name: "United Kingdom",
      code: "gbr",
      available: true,
      cube: "trade_s_gbr_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Ports", level: "Subnat Geography", slug: "ports"}
      ]
    }
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
      name: "🇨🇦 Canada",
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
      name: "🇩🇪 Germany",
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
      name: "🇯🇵 Japan",
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
    },
    {
      name: "🇷🇺 Russia",
      slug: "subnat-rus",
      cube: "trade_s_rus_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `${d3plus_format.formatAbbreviate(d)} ₽`,
      selections: [
        {
          dataUrl: "?cube=trade_s_rus_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Russian Region",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_rus_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_rus_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
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
      name: "🇪🇸 Spain",
      slug: "subnat-esp",
      cube: "trade_s_esp_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
      currencyFormat: d => `€${d3plus_format.formatAbbreviate(d)}`,
      selections: [
        {
          dataUrl: "?cube=trade_s_esp_m_hs&drilldowns=Subnat+Geography&measures=Trade+Value&parents=false&sparse=false",
          data: [],
          dataMap: d => ({id: d["Subnat Geography ID"], displayId: d["Subnat Geography ID"], name: d["Subnat Geography"], color: DEFAULT_PREDICTION_COLOR}),
          dimName: "Subnat Geography",
          id: "subnats",
          name: "Autonomous Community",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_esp_m_hs&Year=2017&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false",
          data: [],
          dataMap: d => ({id: d["HS4 ID"], displayId: toHS(d["HS4 ID"]), name: d.HS4, color: colors.Section[d["Section ID"]]}),
          dimName: "HS4",
          id: "products",
          name: "Product",
          selected: []
        },
        {
          dataUrl: "?cube=trade_s_esp_m_hs&drilldowns=Country&measures=Trade+Value&parents=true&sparse=false&properties=ISO+3",
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
  ],

  HS_TO_OEC_HS: {"0101": 10101, "010111": 1010111, "010119": 1010119, "010120": 1010120, "0102": 10102, "010210": 1010210, "010290": 1010290, "0103": 10103, "010310": 1010310, "010391": 1010391, "010392": 1010392, "0104": 10104, "010410": 1010410, "010420": 1010420, "0105": 10105, "010511": 1010511, "010519": 1010519, "010591": 1010591, "010599": 1010599, "0106": 10106, "010600": 1010600, "0201": 10201, "020110": 1020110, "020120": 1020120, "020130": 1020130, "0202": 10202, "020210": 1020210, "020220": 1020220, "020230": 1020230, "0203": 10203, "020311": 1020311, "020312": 1020312, "020319": 1020319, "020321": 1020321, "020322": 1020322, "020329": 1020329, "0204": 10204, "020410": 1020410, "020421": 1020421, "020422": 1020422, "020423": 1020423, "020430": 1020430, "020441": 1020441, "020442": 1020442, "020443": 1020443, "020450": 1020450, "0205": 10205, "020500": 1020500, "0206": 10206, "020610": 1020610, "020621": 1020621, "020622": 1020622, "020629": 1020629, "020630": 1020630, "020641": 1020641, "020649": 1020649, "020680": 1020680, "020690": 1020690, "0207": 10207, "020710": 1020710, "020721": 1020721, "020722": 1020722, "020723": 1020723, "020731": 1020731, "020739": 1020739, "020741": 1020741, "020742": 1020742, "020743": 1020743, "020750": 1020750, "0208": 10208, "020810": 1020810, "020820": 1020820, "020890": 1020890, "0209": 10209, "020900": 1020900, "0210": 10210, "021011": 1021011, "021012": 1021012, "021019": 1021019, "021020": 1021020, "021090": 1021090, "0301": 10301, "030110": 1030110, "030191": 1030191, "030192": 1030192, "030193": 1030193, "030199": 1030199, "0302": 10302, "030211": 1030211, "030212": 1030212, "030219": 1030219, "030221": 1030221, "030222": 1030222, "030223": 1030223, "030229": 1030229, "030231": 1030231, "030232": 1030232, "030233": 1030233, "030239": 1030239, "030240": 1030240, "030250": 1030250, "030261": 1030261, "030262": 1030262, "030263": 1030263, "030264": 1030264, "030265": 1030265, "030266": 1030266, "030269": 1030269, "030270": 1030270, "0303": 10303, "030310": 1030310, "030321": 1030321, "030322": 1030322, "030329": 1030329, "030331": 1030331, "030332": 1030332, "030333": 1030333, "030339": 1030339, "030341": 1030341, "030342": 1030342, "030343": 1030343, "030349": 1030349, "030350": 1030350, "030360": 1030360, "030371": 1030371, "030372": 1030372, "030373": 1030373, "030374": 1030374, "030375": 1030375, "030376": 1030376, "030377": 1030377, "030378": 1030378, "030379": 1030379, "030380": 1030380, "0304": 10304, "030410": 1030410, "030420": 1030420, "030490": 1030490, "0305": 10305, "030510": 1030510, "030520": 1030520, "030530": 1030530, "030541": 1030541, "030542": 1030542, "030549": 1030549, "030551": 1030551, "030559": 1030559, "030561": 1030561, "030562": 1030562, "030563": 1030563, "030569": 1030569, "0306": 10306, "030611": 1030611, "030612": 1030612, "030613": 1030613, "030614": 1030614, "030619": 1030619, "030621": 1030621, "030622": 1030622, "030623": 1030623, "030624": 1030624, "030629": 1030629, "0307": 10307, "030710": 1030710, "030721": 1030721, "030729": 1030729, "030731": 1030731, "030739": 1030739, "030741": 1030741, "030749": 1030749, "030751": 1030751, "030759": 1030759, "030760": 1030760, "030791": 1030791, "030799": 1030799, "0401": 10401, "040110": 1040110, "040120": 1040120, "040130": 1040130, "0402": 10402, "040210": 1040210, "040221": 1040221, "040229": 1040229, "040291": 1040291, "040299": 1040299, "0403": 10403, "040310": 1040310, "040390": 1040390, "0404": 10404, "040410": 1040410, "040490": 1040490, "0405": 10405, "040500": 1040500, "0406": 10406, "040610": 1040610, "040620": 1040620, "040630": 1040630, "040640": 1040640, "040690": 1040690, "0407": 10407, "040700": 1040700, "0408": 10408, "040811": 1040811, "040819": 1040819, "040891": 1040891, "040899": 1040899, "0409": 10409, "040900": 1040900, "0410": 10410, "041000": 1041000, "0501": 10501, "050100": 1050100, "0502": 10502, "050210": 1050210, "050290": 1050290, "0503": 10503, "050300": 1050300, "0504": 10504, "050400": 1050400, "0505": 10505, "050510": 1050510, "050590": 1050590, "0506": 10506, "050610": 1050610, "050690": 1050690, "0507": 10507, "050710": 1050710, "050790": 1050790, "0508": 10508, "050800": 1050800, "0509": 10509, "050900": 1050900, "0510": 10510, "051000": 1051000, "0511": 10511, "051110": 1051110, "051191": 1051191, "051199": 1051199, "0601": 20601, "060110": 2060110, "060120": 2060120, "0602": 20602, "060210": 2060210, "060220": 2060220, "060230": 2060230, "060240": 2060240, "060291": 2060291, "060299": 2060299, "0603": 20603, "060310": 2060310, "060390": 2060390, "0604": 20604, "060410": 2060410, "060491": 2060491, "060499": 2060499, "0701": 20701, "070110": 2070110, "070190": 2070190, "0702": 20702, "070200": 2070200, "0703": 20703, "070310": 2070310, "070320": 2070320, "070390": 2070390, "0704": 20704, "070410": 2070410, "070420": 2070420, "070490": 2070490, "0705": 20705, "070511": 2070511, "070519": 2070519, "070521": 2070521, "070529": 2070529, "0706": 20706, "070610": 2070610, "070690": 2070690, "0707": 20707, "070700": 2070700, "0708": 20708, "070810": 2070810, "070820": 2070820, "070890": 2070890, "0709": 20709, "070910": 2070910, "070920": 2070920, "070930": 2070930, "070940": 2070940, "070951": 2070951, "070952": 2070952, "070960": 2070960, "070970": 2070970, "070990": 2070990, "0710": 20710, "071010": 2071010, "071021": 2071021, "071022": 2071022, "071029": 2071029, "071030": 2071030, "071040": 2071040, "071080": 2071080, "071090": 2071090, "0711": 20711, "071110": 2071110, "071120": 2071120, "071130": 2071130, "071140": 2071140, "071190": 2071190, "0712": 20712, "071210": 2071210, "071220": 2071220, "071230": 2071230, "071290": 2071290, "0713": 20713, "071310": 2071310, "071320": 2071320, "071331": 2071331, "071332": 2071332, "071333": 2071333, "071339": 2071339, "071340": 2071340, "071350": 2071350, "071390": 2071390, "0714": 20714, "071410": 2071410, "071420": 2071420, "071490": 2071490, "0801": 20801, "080110": 2080110, "080120": 2080120, "080130": 2080130, "0802": 20802, "080211": 2080211, "080212": 2080212, "080221": 2080221, "080222": 2080222, "080231": 2080231, "080232": 2080232, "080240": 2080240, "080250": 2080250, "080290": 2080290, "0803": 20803, "080300": 2080300, "0804": 20804, "080410": 2080410, "080420": 2080420, "080430": 2080430, "080440": 2080440, "080450": 2080450, "0805": 20805, "080510": 2080510, "080520": 2080520, "080530": 2080530, "080540": 2080540, "080590": 2080590, "0806": 20806, "080610": 2080610, "080620": 2080620, "0807": 20807, "080710": 2080710, "080720": 2080720, "0808": 20808, "080810": 2080810, "080820": 2080820, "0809": 20809, "080910": 2080910, "080920": 2080920, "080930": 2080930, "080940": 2080940, "0810": 20810, "081010": 2081010, "081020": 2081020, "081030": 2081030, "081040": 2081040, "081090": 2081090, "0811": 20811, "081110": 2081110, "081120": 2081120, "081190": 2081190, "0812": 20812, "081210": 2081210, "081220": 2081220, "081290": 2081290, "0813": 20813, "081310": 2081310, "081320": 2081320, "081330": 2081330, "081340": 2081340, "081350": 2081350, "0814": 20814, "081400": 2081400, "0901": 20901, "090111": 2090111, "090112": 2090112, "090121": 2090121, "090122": 2090122, "090130": 2090130, "090140": 2090140, "0902": 20902, "090210": 2090210, "090220": 2090220, "090230": 2090230, "090240": 2090240, "0903": 20903, "090300": 2090300, "0904": 20904, "090411": 2090411, "090412": 2090412, "090420": 2090420, "0905": 20905, "090500": 2090500, "0906": 20906, "090610": 2090610, "090620": 2090620, "0907": 20907, "090700": 2090700, "0908": 20908, "090810": 2090810, "090820": 2090820, "090830": 2090830, "0909": 20909, "090910": 2090910, "090920": 2090920, "090930": 2090930, "090940": 2090940, "090950": 2090950, "0910": 20910, "091010": 2091010, "091020": 2091020, "091030": 2091030, "091040": 2091040, "091050": 2091050, "091091": 2091091, "091099": 2091099, "1001": 21001, "100110": 2100110, "100190": 2100190, "1002": 21002, "100200": 2100200, "1003": 21003, "100300": 2100300, "1004": 21004, "100400": 2100400, "1005": 21005, "100510": 2100510, "100590": 2100590, "1006": 21006, "100610": 2100610, "100620": 2100620, "100630": 2100630, "100640": 2100640, "1007": 21007, "100700": 2100700, "1008": 21008, "100810": 2100810, "100820": 2100820, "100830": 2100830, "100890": 2100890, "1101": 21101, "110100": 2110100, "1102": 21102, "110210": 2110210, "110220": 2110220, "110230": 2110230, "110290": 2110290, "1103": 21103, "110311": 2110311, "110312": 2110312, "110313": 2110313, "110314": 2110314, "110319": 2110319, "110321": 2110321, "110329": 2110329, "1104": 21104, "110411": 2110411, "110412": 2110412, "110419": 2110419, "110421": 2110421, "110422": 2110422, "110423": 2110423, "110429": 2110429, "110430": 2110430, "1105": 21105, "110510": 2110510, "110520": 2110520, "1106": 21106, "110610": 2110610, "110620": 2110620, "110630": 2110630, "1107": 21107, "110710": 2110710, "110720": 2110720, "1108": 21108, "110811": 2110811, "110812": 2110812, "110813": 2110813, "110814": 2110814, "110819": 2110819, "110820": 2110820, "1109": 21109, "110900": 2110900, "1201": 21201, "120100": 2120100, "1202": 21202, "120210": 2120210, "120220": 2120220, "1203": 21203, "120300": 2120300, "1204": 21204, "120400": 2120400, "1205": 21205, "120500": 2120500, "1206": 21206, "120600": 2120600, "1207": 21207, "120710": 2120710, "120720": 2120720, "120730": 2120730, "120740": 2120740, "120750": 2120750, "120760": 2120760, "120791": 2120791, "120792": 2120792, "120799": 2120799, "1208": 21208, "120810": 2120810, "120890": 2120890, "1209": 21209, "120911": 2120911, "120919": 2120919, "120921": 2120921, "120922": 2120922, "120923": 2120923, "120924": 2120924, "120925": 2120925, "120926": 2120926, "120929": 2120929, "120930": 2120930, "120991": 2120991, "120999": 2120999, "1210": 21210, "121010": 2121010, "121020": 2121020, "1211": 21211, "121110": 2121110, "121120": 2121120, "121190": 2121190, "1212": 21212, "121210": 2121210, "121220": 2121220, "121230": 2121230, "121291": 2121291, "121292": 2121292, "121299": 2121299, "1213": 21213, "121300": 2121300, "1214": 21214, "121410": 2121410, "121490": 2121490, "1301": 21301, "130110": 2130110, "130120": 2130120, "130190": 2130190, "1302": 21302, "130211": 2130211, "130212": 2130212, "130213": 2130213, "130214": 2130214, "130219": 2130219, "130220": 2130220, "130231": 2130231, "130232": 2130232, "130239": 2130239, "1401": 21401, "140110": 2140110, "140120": 2140120, "140190": 2140190, "1402": 21402, "140210": 2140210, "140291": 2140291, "140299": 2140299, "1403": 21403, "140310": 2140310, "140390": 2140390, "1404": 21404, "140410": 2140410, "140420": 2140420, "140490": 2140490, "1501": 31501, "150100": 3150100, "1502": 31502, "150200": 3150200, "1503": 31503, "150300": 3150300, "1504": 31504, "150410": 3150410, "150420": 3150420, "150430": 3150430, "1505": 31505, "150510": 3150510, "150590": 3150590, "1506": 31506, "150600": 3150600, "1507": 31507, "150710": 3150710, "150790": 3150790, "1508": 31508, "150810": 3150810, "150890": 3150890, "1509": 31509, "150910": 3150910, "150990": 3150990, "1510": 31510, "151000": 3151000, "1511": 31511, "151110": 3151110, "151190": 3151190, "1512": 31512, "151211": 3151211, "151219": 3151219, "151221": 3151221, "151229": 3151229, "1513": 31513, "151311": 3151311, "151319": 3151319, "151321": 3151321, "151329": 3151329, "1514": 31514, "151410": 3151410, "151490": 3151490, "1515": 31515, "151511": 3151511, "151519": 3151519, "151521": 3151521, "151529": 3151529, "151530": 3151530, "151540": 3151540, "151550": 3151550, "151560": 3151560, "151590": 3151590, "1516": 31516, "151610": 3151610, "151620": 3151620, "1517": 31517, "151710": 3151710, "151790": 3151790, "1518": 31518, "151800": 3151800, "1519": 31519, "151911": 3151911, "151912": 3151912, "151913": 3151913, "151919": 3151919, "151920": 3151920, "151930": 3151930, "1520": 31520, "152010": 3152010, "152090": 3152090, "1521": 31521, "152110": 3152110, "152190": 3152190, "1522": 31522, "152200": 3152200, "1601": 41601, "160100": 4160100, "1602": 41602, "160210": 4160210, "160220": 4160220, "160231": 4160231, "160239": 4160239, "160241": 4160241, "160242": 4160242, "160249": 4160249, "160250": 4160250, "160290": 4160290, "1603": 41603, "160300": 4160300, "1604": 41604, "160411": 4160411, "160412": 4160412, "160413": 4160413, "160414": 4160414, "160415": 4160415, "160416": 4160416, "160419": 4160419, "160420": 4160420, "160430": 4160430, "1605": 41605, "160510": 4160510, "160520": 4160520, "160530": 4160530, "160540": 4160540, "160590": 4160590, "1701": 41701, "170111": 4170111, "170112": 4170112, "170191": 4170191, "170199": 4170199, "1702": 41702, "170210": 4170210, "170220": 4170220, "170230": 4170230, "170240": 4170240, "170250": 4170250, "170260": 4170260, "170290": 4170290, "1703": 41703, "170310": 4170310, "170390": 4170390, "1704": 41704, "170410": 4170410, "170490": 4170490, "1801": 41801, "180100": 4180100, "1802": 41802, "180200": 4180200, "1803": 41803, "180310": 4180310, "180320": 4180320, "1804": 41804, "180400": 4180400, "1805": 41805, "180500": 4180500, "1806": 41806, "180610": 4180610, "180620": 4180620, "180631": 4180631, "180632": 4180632, "180690": 4180690, "1901": 41901, "190110": 4190110, "190120": 4190120, "190190": 4190190, "1902": 41902, "190211": 4190211, "190219": 4190219, "190220": 4190220, "190230": 4190230, "190240": 4190240, "1903": 41903, "190300": 4190300, "1904": 41904, "190410": 4190410, "190490": 4190490, "1905": 41905, "190510": 4190510, "190520": 4190520, "190530": 4190530, "190540": 4190540, "190590": 4190590, "2001": 42001, "200110": 4200110, "200120": 4200120, "200190": 4200190, "2002": 42002, "200210": 4200210, "200290": 4200290, "2003": 42003, "200310": 4200310, "200320": 4200320, "2004": 42004, "200410": 4200410, "200490": 4200490, "2005": 42005, "200510": 4200510, "200520": 4200520, "200530": 4200530, "200540": 4200540, "200551": 4200551, "200559": 4200559, "200560": 4200560, "200570": 4200570, "200580": 4200580, "200590": 4200590, "2006": 42006, "200600": 4200600, "2007": 42007, "200710": 4200710, "200791": 4200791, "200799": 4200799, "2008": 42008, "200811": 4200811, "200819": 4200819, "200820": 4200820, "200830": 4200830, "200840": 4200840, "200850": 4200850, "200860": 4200860, "200870": 4200870, "200880": 4200880, "200891": 4200891, "200892": 4200892, "200899": 4200899, "2009": 42009, "200911": 4200911, "200919": 4200919, "200920": 4200920, "200930": 4200930, "200940": 4200940, "200950": 4200950, "200960": 4200960, "200970": 4200970, "200980": 4200980, "200990": 4200990, "2101": 42101, "210110": 4210110, "210120": 4210120, "210130": 4210130, "2102": 42102, "210210": 4210210, "210220": 4210220, "210230": 4210230, "2103": 42103, "210310": 4210310, "210320": 4210320, "210330": 4210330, "210390": 4210390, "2104": 42104, "210410": 4210410, "210420": 4210420, "2105": 42105, "210500": 4210500, "2106": 42106, "210610": 4210610, "210690": 4210690, "2201": 42201, "220110": 4220110, "220190": 4220190, "2202": 42202, "220210": 4220210, "220290": 4220290, "2203": 42203, "220300": 4220300, "2204": 42204, "220410": 4220410, "220421": 4220421, "220429": 4220429, "220430": 4220430, "2205": 42205, "220510": 4220510, "220590": 4220590, "2206": 42206, "220600": 4220600, "2207": 42207, "220710": 4220710, "220720": 4220720, "2208": 42208, "220810": 4220810, "220820": 4220820, "220830": 4220830, "220840": 4220840, "220850": 4220850, "220890": 4220890, "2209": 42209, "220900": 4220900, "2301": 42301, "230110": 4230110, "230120": 4230120, "2302": 42302, "230210": 4230210, "230220": 4230220, "230230": 4230230, "230240": 4230240, "230250": 4230250, "2303": 42303, "230310": 4230310, "230320": 4230320, "230330": 4230330, "2304": 42304, "230400": 4230400, "2305": 42305, "230500": 4230500, "2306": 42306, "230610": 4230610, "230620": 4230620, "230630": 4230630, "230640": 4230640, "230650": 4230650, "230660": 4230660, "230690": 4230690, "2307": 42307, "230700": 4230700, "2308": 42308, "230810": 4230810, "230890": 4230890, "2309": 42309, "230910": 4230910, "230990": 4230990, "2401": 42401, "240110": 4240110, "240120": 4240120, "240130": 4240130, "2402": 42402, "240210": 4240210, "240220": 4240220, "240290": 4240290, "2403": 42403, "240310": 4240310, "240391": 4240391, "240399": 4240399, "2501": 52501, "250100": 5250100, "2502": 52502, "250200": 5250200, "2503": 52503, "250310": 5250310, "250390": 5250390, "2504": 52504, "250410": 5250410, "250490": 5250490, "2505": 52505, "250510": 5250510, "250590": 5250590, "2506": 52506, "250610": 5250610, "250621": 5250621, "250629": 5250629, "2507": 52507, "250700": 5250700, "2508": 52508, "250810": 5250810, "250820": 5250820, "250830": 5250830, "250840": 5250840, "250850": 5250850, "250860": 5250860, "250870": 5250870, "2509": 52509, "250900": 5250900, "2510": 52510, "251010": 5251010, "251020": 5251020, "2511": 52511, "251110": 5251110, "251120": 5251120, "2512": 52512, "251200": 5251200, "2513": 52513, "251311": 5251311, "251319": 5251319, "251321": 5251321, "251329": 5251329, "2514": 52514, "251400": 5251400, "2515": 52515, "251511": 5251511, "251512": 5251512, "251520": 5251520, "2516": 52516, "251611": 5251611, "251612": 5251612, "251621": 5251621, "251622": 5251622, "251690": 5251690, "2517": 52517, "251710": 5251710, "251720": 5251720, "251730": 5251730, "251741": 5251741, "251749": 5251749, "2518": 52518, "251810": 5251810, "251820": 5251820, "251830": 5251830, "2519": 52519, "251910": 5251910, "251990": 5251990, "2520": 52520, "252010": 5252010, "252020": 5252020, "2521": 52521, "252100": 5252100, "2522": 52522, "252210": 5252210, "252220": 5252220, "252230": 5252230, "2523": 52523, "252310": 5252310, "252321": 5252321, "252329": 5252329, "252330": 5252330, "252390": 5252390, "2524": 52524, "252400": 5252400, "2525": 52525, "252510": 5252510, "252520": 5252520, "252530": 5252530, "2526": 52526, "252610": 5252610, "252620": 5252620, "2527": 52527, "252700": 5252700, "2528": 52528, "252810": 5252810, "252890": 5252890, "2529": 52529, "252910": 5252910, "252921": 5252921, "252922": 5252922, "252930": 5252930, "2530": 52530, "253010": 5253010, "253020": 5253020, "253030": 5253030, "253040": 5253040, "253090": 5253090, "2601": 52601, "260111": 5260111, "260112": 5260112, "260120": 5260120, "2602": 52602, "260200": 5260200, "2603": 52603, "260300": 5260300, "2604": 52604, "260400": 5260400, "2605": 52605, "260500": 5260500, "2606": 52606, "260600": 5260600, "2607": 52607, "260700": 5260700, "2608": 52608, "260800": 5260800, "2609": 52609, "260900": 5260900, "2610": 52610, "261000": 5261000, "2611": 52611, "261100": 5261100, "2612": 52612, "261210": 5261210, "261220": 5261220, "2613": 52613, "261310": 5261310, "261390": 5261390, "2614": 52614, "261400": 5261400, "2615": 52615, "261510": 5261510, "261590": 5261590, "2616": 52616, "261610": 5261610, "261690": 5261690, "2617": 52617, "261710": 5261710, "261790": 5261790, "2618": 52618, "261800": 5261800, "2619": 52619, "261900": 5261900, "2620": 52620, "262011": 5262011, "262019": 5262019, "262020": 5262020, "262030": 5262030, "262040": 5262040, "262050": 5262050, "262090": 5262090, "2621": 52621, "262100": 5262100, "2701": 52701, "270111": 5270111, "270112": 5270112, "270119": 5270119, "270120": 5270120, "2702": 52702, "270210": 5270210, "270220": 5270220, "2703": 52703, "270300": 5270300, "2704": 52704, "270400": 5270400, "2705": 52705, "270500": 5270500, "2706": 52706, "270600": 5270600, "2707": 52707, "270710": 5270710, "270720": 5270720, "270730": 5270730, "270740": 5270740, "270750": 5270750, "270760": 5270760, "270791": 5270791, "270799": 5270799, "2708": 52708, "270810": 5270810, "270820": 5270820, "2709": 52709, "270900": 5270900, "2710": 52710, "271000": 5271000, "271011": 5271011, "271012": 5271012, "271013": 5271013, "271014": 5271014, "271015": 5271015, "271016": 5271016, "271019": 5271019, "271021": 5271021, "271022": 5271022, "271025": 5271025, "271026": 5271026, "271027": 5271027, "271029": 5271029, "271091": 5271091, "271093": 5271093, "271094": 5271094, "271095": 5271095, "271096": 5271096, "271099": 5271099, "2711": 52711, "271111": 5271111, "271112": 5271112, "271113": 5271113, "271114": 5271114, "271119": 5271119, "271121": 5271121, "271129": 5271129, "2712": 52712, "271210": 5271210, "271220": 5271220, "271290": 5271290, "2713": 52713, "271311": 5271311, "271312": 5271312, "271320": 5271320, "271390": 5271390, "2714": 52714, "271410": 5271410, "271490": 5271490, "2715": 52715, "271500": 5271500, "2716": 52716, "271600": 5271600, "2801": 62801, "280110": 6280110, "280120": 6280120, "280130": 6280130, "2802": 62802, "280200": 6280200, "2803": 62803, "280300": 6280300, "2804": 62804, "280410": 6280410, "280421": 6280421, "280429": 6280429, "280430": 6280430, "280440": 6280440, "280450": 6280450, "280461": 6280461, "280469": 6280469, "280470": 6280470, "280480": 6280480, "280490": 6280490, "2805": 62805, "280511": 6280511, "280519": 6280519, "280521": 6280521, "280522": 6280522, "280530": 6280530, "280540": 6280540, "2806": 62806, "280610": 6280610, "280620": 6280620, "2807": 62807, "280700": 6280700, "2808": 62808, "280800": 6280800, "2809": 62809, "280910": 6280910, "280920": 6280920, "2810": 62810, "281000": 6281000, "2811": 62811, "281111": 6281111, "281119": 6281119, "281121": 6281121, "281122": 6281122, "281123": 6281123, "281129": 6281129, "2812": 62812, "281210": 6281210, "281290": 6281290, "2813": 62813, "281310": 6281310, "281390": 6281390, "2814": 62814, "281410": 6281410, "281420": 6281420, "2815": 62815, "281511": 6281511, "281512": 6281512, "281520": 6281520, "281530": 6281530, "2816": 62816, "281610": 6281610, "281620": 6281620, "281630": 6281630, "2817": 62817, "281700": 6281700, "2818": 62818, "281810": 6281810, "281820": 6281820, "281830": 6281830, "2819": 62819, "281910": 6281910, "281990": 6281990, "2820": 62820, "282010": 6282010, "282090": 6282090, "2821": 62821, "282110": 6282110, "282120": 6282120, "2822": 62822, "282200": 6282200, "2823": 62823, "282300": 6282300, "2824": 62824, "282410": 6282410, "282420": 6282420, "282490": 6282490, "2825": 62825, "282510": 6282510, "282520": 6282520, "282530": 6282530, "282540": 6282540, "282550": 6282550, "282560": 6282560, "282570": 6282570, "282580": 6282580, "282590": 6282590, "2826": 62826, "282611": 6282611, "282612": 6282612, "282619": 6282619, "282620": 6282620, "282630": 6282630, "282690": 6282690, "2827": 62827, "282710": 6282710, "282720": 6282720, "282731": 6282731, "282732": 6282732, "282733": 6282733, "282734": 6282734, "282735": 6282735, "282736": 6282736, "282737": 6282737, "282738": 6282738, "282739": 6282739, "282741": 6282741, "282749": 6282749, "282751": 6282751, "282759": 6282759, "282760": 6282760, "2828": 62828, "282810": 6282810, "282890": 6282890, "2829": 62829, "282911": 6282911, "282919": 6282919, "282990": 6282990, "2830": 62830, "283010": 6283010, "283020": 6283020, "283030": 6283030, "283090": 6283090, "2831": 62831, "283110": 6283110, "283190": 6283190, "2832": 62832, "283210": 6283210, "283220": 6283220, "283230": 6283230, "2833": 62833, "283311": 6283311, "283319": 6283319, "283321": 6283321, "283322": 6283322, "283323": 6283323, "283324": 6283324, "283325": 6283325, "283326": 6283326, "283327": 6283327, "283329": 6283329, "283330": 6283330, "283340": 6283340, "2834": 62834, "283410": 6283410, "283421": 6283421, "283422": 6283422, "283429": 6283429, "2835": 62835, "283510": 6283510, "283521": 6283521, "283522": 6283522, "283523": 6283523, "283524": 6283524, "283525": 6283525, "283526": 6283526, "283529": 6283529, "283531": 6283531, "283539": 6283539, "2836": 62836, "283610": 6283610, "283620": 6283620, "283630": 6283630, "283640": 6283640, "283650": 6283650, "283660": 6283660, "283670": 6283670, "283691": 6283691, "283692": 6283692, "283693": 6283693, "283699": 6283699, "2837": 62837, "283711": 6283711, "283719": 6283719, "283720": 6283720, "2838": 62838, "283800": 6283800, "2839": 62839, "283911": 6283911, "283919": 6283919, "283920": 6283920, "283990": 6283990, "2840": 62840, "284011": 6284011, "284019": 6284019, "284020": 6284020, "284030": 6284030, "2841": 62841, "284110": 6284110, "284120": 6284120, "284130": 6284130, "284140": 6284140, "284150": 6284150, "284160": 6284160, "284170": 6284170, "284180": 6284180, "284190": 6284190, "2842": 62842, "284210": 6284210, "284290": 6284290, "2843": 62843, "284310": 6284310, "284321": 6284321, "284329": 6284329, "284330": 6284330, "284390": 6284390, "2844": 62844, "284410": 6284410, "284420": 6284420, "284430": 6284430, "284440": 6284440, "284450": 6284450, "2845": 62845, "284510": 6284510, "284590": 6284590, "2846": 62846, "284610": 6284610, "284690": 6284690, "2847": 62847, "284700": 6284700, "2848": 62848, "284810": 6284810, "284890": 6284890, "2849": 62849, "284910": 6284910, "284920": 6284920, "284990": 6284990, "2850": 62850, "285000": 6285000, "2851": 62851, "285100": 6285100, "2901": 62901, "290110": 6290110, "290121": 6290121, "290122": 6290122, "290123": 6290123, "290124": 6290124, "290129": 6290129, "2902": 62902, "290211": 6290211, "290219": 6290219, "290220": 6290220, "290230": 6290230, "290241": 6290241, "290242": 6290242, "290243": 6290243, "290244": 6290244, "290250": 6290250, "290260": 6290260, "290270": 6290270, "290290": 6290290, "2903": 62903, "290311": 6290311, "290312": 6290312, "290313": 6290313, "290314": 6290314, "290315": 6290315, "290316": 6290316, "290319": 6290319, "290321": 6290321, "290322": 6290322, "290323": 6290323, "290329": 6290329, "290330": 6290330, "290340": 6290340, "290351": 6290351, "290359": 6290359, "290361": 6290361, "290362": 6290362, "290369": 6290369, "2904": 62904, "290410": 6290410, "290420": 6290420, "290490": 6290490, "2905": 62905, "290511": 6290511, "290512": 6290512, "290513": 6290513, "290514": 6290514, "290515": 6290515, "290516": 6290516, "290517": 6290517, "290519": 6290519, "290521": 6290521, "290522": 6290522, "290529": 6290529, "290531": 6290531, "290532": 6290532, "290539": 6290539, "290541": 6290541, "290542": 6290542, "290543": 6290543, "290544": 6290544, "290549": 6290549, "290550": 6290550, "2906": 62906, "290611": 6290611, "290612": 6290612, "290613": 6290613, "290614": 6290614, "290619": 6290619, "290621": 6290621, "290629": 6290629, "2907": 62907, "290711": 6290711, "290712": 6290712, "290713": 6290713, "290714": 6290714, "290715": 6290715, "290719": 6290719, "290721": 6290721, "290722": 6290722, "290723": 6290723, "290729": 6290729, "290730": 6290730, "2908": 62908, "290810": 6290810, "290820": 6290820, "290890": 6290890, "2909": 62909, "290911": 6290911, "290919": 6290919, "290920": 6290920, "290930": 6290930, "290941": 6290941, "290942": 6290942, "290943": 6290943, "290944": 6290944, "290949": 6290949, "290950": 6290950, "290960": 6290960, "2910": 62910, "291010": 6291010, "291020": 6291020, "291030": 6291030, "291090": 6291090, "2911": 62911, "291100": 6291100, "2912": 62912, "291211": 6291211, "291212": 6291212, "291213": 6291213, "291219": 6291219, "291221": 6291221, "291229": 6291229, "291230": 6291230, "291241": 6291241, "291242": 6291242, "291249": 6291249, "291250": 6291250, "291260": 6291260, "2913": 62913, "291300": 6291300, "2914": 62914, "291411": 6291411, "291412": 6291412, "291413": 6291413, "291419": 6291419, "291421": 6291421, "291422": 6291422, "291423": 6291423, "291429": 6291429, "291430": 6291430, "291441": 6291441, "291449": 6291449, "291450": 6291450, "291461": 6291461, "291469": 6291469, "291470": 6291470, "2915": 62915, "291511": 6291511, "291512": 6291512, "291513": 6291513, "291521": 6291521, "291522": 6291522, "291523": 6291523, "291524": 6291524, "291529": 6291529, "291531": 6291531, "291532": 6291532, "291533": 6291533, "291534": 6291534, "291535": 6291535, "291539": 6291539, "291540": 6291540, "291550": 6291550, "291560": 6291560, "291570": 6291570, "291590": 6291590, "2916": 62916, "291611": 6291611, "291612": 6291612, "291613": 6291613, "291614": 6291614, "291615": 6291615, "291619": 6291619, "291620": 6291620, "291631": 6291631, "291632": 6291632, "291633": 6291633, "291639": 6291639, "2917": 62917, "291711": 6291711, "291712": 6291712, "291713": 6291713, "291714": 6291714, "291719": 6291719, "291720": 6291720, "291731": 6291731, "291732": 6291732, "291733": 6291733, "291734": 6291734, "291735": 6291735, "291736": 6291736, "291737": 6291737, "291739": 6291739, "2918": 62918, "291811": 6291811, "291812": 6291812, "291813": 6291813, "291814": 6291814, "291815": 6291815, "291816": 6291816, "291817": 6291817, "291819": 6291819, "291821": 6291821, "291822": 6291822, "291823": 6291823, "291829": 6291829, "291830": 6291830, "291890": 6291890, "2919": 62919, "291900": 6291900, "2920": 62920, "292010": 6292010, "292090": 6292090, "2921": 62921, "292111": 6292111, "292112": 6292112, "292119": 6292119, "292121": 6292121, "292122": 6292122, "292129": 6292129, "292130": 6292130, "292141": 6292141, "292142": 6292142, "292143": 6292143, "292144": 6292144, "292145": 6292145, "292149": 6292149, "292151": 6292151, "292159": 6292159, "2922": 62922, "292211": 6292211, "292212": 6292212, "292213": 6292213, "292219": 6292219, "292221": 6292221, "292222": 6292222, "292229": 6292229, "292230": 6292230, "292241": 6292241, "292242": 6292242, "292249": 6292249, "292250": 6292250, "2923": 62923, "292310": 6292310, "292320": 6292320, "292390": 6292390, "2924": 62924, "292410": 6292410, "292421": 6292421, "292429": 6292429, "2925": 62925, "292511": 6292511, "292519": 6292519, "292520": 6292520, "2926": 62926, "292610": 6292610, "292620": 6292620, "292690": 6292690, "2927": 62927, "292700": 6292700, "2928": 62928, "292800": 6292800, "2929": 62929, "292910": 6292910, "292990": 6292990, "2930": 62930, "293010": 6293010, "293020": 6293020, "293030": 6293030, "293040": 6293040, "293090": 6293090, "2931": 62931, "293100": 6293100, "2932": 62932, "293211": 6293211, "293212": 6293212, "293213": 6293213, "293219": 6293219, "293221": 6293221, "293229": 6293229, "293290": 6293290, "2933": 62933, "293311": 6293311, "293319": 6293319, "293321": 6293321, "293329": 6293329, "293331": 6293331, "293339": 6293339, "293340": 6293340, "293351": 6293351, "293359": 6293359, "293361": 6293361, "293369": 6293369, "293371": 6293371, "293379": 6293379, "293390": 6293390, "2934": 62934, "293410": 6293410, "293420": 6293420, "293430": 6293430, "293490": 6293490, "2935": 62935, "293500": 6293500, "2936": 62936, "293610": 6293610, "293621": 6293621, "293622": 6293622, "293623": 6293623, "293624": 6293624, "293625": 6293625, "293626": 6293626, "293627": 6293627, "293628": 6293628, "293629": 6293629, "293690": 6293690, "2937": 62937, "293710": 6293710, "293721": 6293721, "293722": 6293722, "293729": 6293729, "293791": 6293791, "293792": 6293792, "293799": 6293799, "2938": 62938, "293810": 6293810, "293890": 6293890, "2939": 62939, "293910": 6293910, "293921": 6293921, "293929": 6293929, "293930": 6293930, "293940": 6293940, "293950": 6293950, "293960": 6293960, "293970": 6293970, "293990": 6293990, "2940": 62940, "294000": 6294000, "2941": 62941, "294110": 6294110, "294120": 6294120, "294130": 6294130, "294140": 6294140, "294150": 6294150, "294190": 6294190, "2942": 62942, "294200": 6294200, "3001": 63001, "300110": 6300110, "300120": 6300120, "300190": 6300190, "3002": 63002, "300210": 6300210, "300220": 6300220, "300231": 6300231, "300239": 6300239, "300290": 6300290, "3003": 63003, "300310": 6300310, "300320": 6300320, "300331": 6300331, "300339": 6300339, "300340": 6300340, "300390": 6300390, "3004": 63004, "300410": 6300410, "300420": 6300420, "300431": 6300431, "300432": 6300432, "300439": 6300439, "300440": 6300440, "300450": 6300450, "300490": 6300490, "3005": 63005, "300510": 6300510, "300590": 6300590, "3006": 63006, "300610": 6300610, "300620": 6300620, "300630": 6300630, "300640": 6300640, "300650": 6300650, "300660": 6300660, "3101": 63101, "310100": 6310100, "3102": 63102, "310210": 6310210, "310221": 6310221, "310229": 6310229, "310230": 6310230, "310240": 6310240, "310250": 6310250, "310260": 6310260, "310270": 6310270, "310280": 6310280, "310290": 6310290, "3103": 63103, "310310": 6310310, "310320": 6310320, "310390": 6310390, "3104": 63104, "310410": 6310410, "310420": 6310420, "310430": 6310430, "310490": 6310490, "3105": 63105, "310510": 6310510, "310520": 6310520, "310530": 6310530, "310540": 6310540, "310551": 6310551, "310559": 6310559, "310560": 6310560, "310590": 6310590, "3201": 63201, "320110": 6320110, "320120": 6320120, "320130": 6320130, "320190": 6320190, "3202": 63202, "320210": 6320210, "320290": 6320290, "3203": 63203, "320300": 6320300, "3204": 63204, "320411": 6320411, "320412": 6320412, "320413": 6320413, "320414": 6320414, "320415": 6320415, "320416": 6320416, "320417": 6320417, "320419": 6320419, "320420": 6320420, "320490": 6320490, "3205": 63205, "320500": 6320500, "3206": 63206, "320610": 6320610, "320620": 6320620, "320630": 6320630, "320641": 6320641, "320642": 6320642, "320643": 6320643, "320649": 6320649, "320650": 6320650, "3207": 63207, "320710": 6320710, "320720": 6320720, "320730": 6320730, "320740": 6320740, "3208": 63208, "320810": 6320810, "320820": 6320820, "320890": 6320890, "3209": 63209, "320910": 6320910, "320990": 6320990, "3210": 63210, "321000": 6321000, "3211": 63211, "321100": 6321100, "3212": 63212, "321210": 6321210, "321290": 6321290, "3213": 63213, "321310": 6321310, "321390": 6321390, "3214": 63214, "321410": 6321410, "321490": 6321490, "3215": 63215, "321511": 6321511, "321519": 6321519, "321590": 6321590, "3301": 63301, "330111": 6330111, "330112": 6330112, "330113": 6330113, "330114": 6330114, "330119": 6330119, "330121": 6330121, "330122": 6330122, "330123": 6330123, "330124": 6330124, "330125": 6330125, "330126": 6330126, "330129": 6330129, "330130": 6330130, "330190": 6330190, "3302": 63302, "330210": 6330210, "330290": 6330290, "3303": 63303, "330300": 6330300, "3304": 63304, "330410": 6330410, "330420": 6330420, "330430": 6330430, "330491": 6330491, "330499": 6330499, "3305": 63305, "330510": 6330510, "330520": 6330520, "330530": 6330530, "330590": 6330590, "3306": 63306, "330610": 6330610, "330690": 6330690, "3307": 63307, "330710": 6330710, "330720": 6330720, "330730": 6330730, "330741": 6330741, "330749": 6330749, "330790": 6330790, "3401": 63401, "340111": 6340111, "340119": 6340119, "340120": 6340120, "3402": 63402, "340211": 6340211, "340212": 6340212, "340213": 6340213, "340219": 6340219, "340220": 6340220, "340290": 6340290, "3403": 63403, "340311": 6340311, "340319": 6340319, "340391": 6340391, "340399": 6340399, "3404": 63404, "340410": 6340410, "340420": 6340420, "340490": 6340490, "3405": 63405, "340510": 6340510, "340520": 6340520, "340530": 6340530, "340540": 6340540, "340590": 6340590, "3406": 63406, "340600": 6340600, "3407": 63407, "340700": 6340700, "3501": 63501, "350110": 6350110, "350190": 6350190, "3502": 63502, "350210": 6350210, "350290": 6350290, "3503": 63503, "350300": 6350300, "3504": 63504, "350400": 6350400, "3505": 63505, "350510": 6350510, "350520": 6350520, "3506": 63506, "350610": 6350610, "350691": 6350691, "350699": 6350699, "3507": 63507, "350710": 6350710, "350790": 6350790, "3601": 63601, "360100": 6360100, "3602": 63602, "360200": 6360200, "3603": 63603, "360300": 6360300, "3604": 63604, "360410": 6360410, "360490": 6360490, "3605": 63605, "360500": 6360500, "3606": 63606, "360610": 6360610, "360690": 6360690, "3701": 63701, "370110": 6370110, "370120": 6370120, "370130": 6370130, "370191": 6370191, "370199": 6370199, "3702": 63702, "370210": 6370210, "370220": 6370220, "370231": 6370231, "370232": 6370232, "370239": 6370239, "370241": 6370241, "370242": 6370242, "370243": 6370243, "370244": 6370244, "370251": 6370251, "370252": 6370252, "370253": 6370253, "370254": 6370254, "370255": 6370255, "370256": 6370256, "370291": 6370291, "370292": 6370292, "370293": 6370293, "370294": 6370294, "370295": 6370295, "3703": 63703, "370310": 6370310, "370320": 6370320, "370390": 6370390, "3704": 63704, "370400": 6370400, "3705": 63705, "370510": 6370510, "370520": 6370520, "370590": 6370590, "3706": 63706, "370610": 6370610, "370690": 6370690, "3707": 63707, "370710": 6370710, "370790": 6370790, "3801": 63801, "380110": 6380110, "380120": 6380120, "380130": 6380130, "380190": 6380190, "3802": 63802, "380210": 6380210, "380290": 6380290, "3803": 63803, "380300": 6380300, "3804": 63804, "380400": 6380400, "3805": 63805, "380510": 6380510, "380520": 6380520, "380590": 6380590, "3806": 63806, "380610": 6380610, "380620": 6380620, "380630": 6380630, "380690": 6380690, "3807": 63807, "380700": 6380700, "3808": 63808, "380810": 6380810, "380820": 6380820, "380830": 6380830, "380840": 6380840, "380890": 6380890, "3809": 63809, "380910": 6380910, "380991": 6380991, "380992": 6380992, "380993": 6380993, "380999": 6380999, "3810": 63810, "381010": 6381010, "381090": 6381090, "3811": 63811, "381111": 6381111, "381119": 6381119, "381121": 6381121, "381129": 6381129, "381190": 6381190, "3812": 63812, "381210": 6381210, "381220": 6381220, "381230": 6381230, "3813": 63813, "381300": 6381300, "3814": 63814, "381400": 6381400, "3815": 63815, "381511": 6381511, "381512": 6381512, "381519": 6381519, "381590": 6381590, "3816": 63816, "381600": 6381600, "3817": 63817, "381710": 6381710, "381720": 6381720, "3818": 63818, "381800": 6381800, "3819": 63819, "381900": 6381900, "3820": 63820, "382000": 6382000, "3821": 63821, "382100": 6382100, "3822": 63822, "382200": 6382200, "3823": 63823, "382310": 6382310, "382320": 6382320, "382330": 6382330, "382340": 6382340, "382350": 6382350, "382360": 6382360, "382390": 6382390, "3901": 73901, "390110": 7390110, "390120": 7390120, "390130": 7390130, "390190": 7390190, "3902": 73902, "390210": 7390210, "390220": 7390220, "390230": 7390230, "390290": 7390290, "3903": 73903, "390311": 7390311, "390319": 7390319, "390320": 7390320, "390330": 7390330, "390390": 7390390, "3904": 73904, "390410": 7390410, "390421": 7390421, "390422": 7390422, "390430": 7390430, "390440": 7390440, "390450": 7390450, "390461": 7390461, "390469": 7390469, "390490": 7390490, "3905": 73905, "390511": 7390511, "390519": 7390519, "390520": 7390520, "390590": 7390590, "3906": 73906, "390610": 7390610, "390690": 7390690, "3907": 73907, "390710": 7390710, "390720": 7390720, "390730": 7390730, "390740": 7390740, "390750": 7390750, "390760": 7390760, "390791": 7390791, "390799": 7390799, "3908": 73908, "390810": 7390810, "390890": 7390890, "3909": 73909, "390910": 7390910, "390920": 7390920, "390930": 7390930, "390940": 7390940, "390950": 7390950, "3910": 73910, "391000": 7391000, "3911": 73911, "391110": 7391110, "391190": 7391190, "3912": 73912, "391211": 7391211, "391212": 7391212, "391220": 7391220, "391231": 7391231, "391239": 7391239, "391290": 7391290, "3913": 73913, "391310": 7391310, "391390": 7391390, "3914": 73914, "391400": 7391400, "3915": 73915, "391510": 7391510, "391520": 7391520, "391530": 7391530, "391590": 7391590, "3916": 73916, "391610": 7391610, "391620": 7391620, "391690": 7391690, "3917": 73917, "391710": 7391710, "391721": 7391721, "391722": 7391722, "391723": 7391723, "391729": 7391729, "391731": 7391731, "391732": 7391732, "391733": 7391733, "391739": 7391739, "391740": 7391740, "3918": 73918, "391810": 7391810, "391890": 7391890, "3919": 73919, "391910": 7391910, "391990": 7391990, "3920": 73920, "392010": 7392010, "392020": 7392020, "392030": 7392030, "392041": 7392041, "392042": 7392042, "392051": 7392051, "392059": 7392059, "392061": 7392061, "392062": 7392062, "392063": 7392063, "392069": 7392069, "392071": 7392071, "392072": 7392072, "392073": 7392073, "392079": 7392079, "392091": 7392091, "392092": 7392092, "392093": 7392093, "392094": 7392094, "392099": 7392099, "3921": 73921, "392111": 7392111, "392112": 7392112, "392113": 7392113, "392114": 7392114, "392119": 7392119, "392190": 7392190, "3922": 73922, "392210": 7392210, "392220": 7392220, "392290": 7392290, "3923": 73923, "392310": 7392310, "392321": 7392321, "392329": 7392329, "392330": 7392330, "392340": 7392340, "392350": 7392350, "392390": 7392390, "3924": 73924, "392410": 7392410, "392490": 7392490, "3925": 73925, "392510": 7392510, "392520": 7392520, "392530": 7392530, "392590": 7392590, "3926": 73926, "392610": 7392610, "392620": 7392620, "392630": 7392630, "392640": 7392640, "392690": 7392690, "4001": 74001, "400110": 7400110, "400121": 7400121, "400122": 7400122, "400129": 7400129, "400130": 7400130, "4002": 74002, "400211": 7400211, "400219": 7400219, "400220": 7400220, "400231": 7400231, "400239": 7400239, "400241": 7400241, "400249": 7400249, "400251": 7400251, "400259": 7400259, "400260": 7400260, "400270": 7400270, "400280": 7400280, "400291": 7400291, "400299": 7400299, "4003": 74003, "400300": 7400300, "4004": 74004, "400400": 7400400, "4005": 74005, "400510": 7400510, "400520": 7400520, "400591": 7400591, "400599": 7400599, "4006": 74006, "400610": 7400610, "400690": 7400690, "4007": 74007, "400700": 7400700, "4008": 74008, "400811": 7400811, "400819": 7400819, "400821": 7400821, "400829": 7400829, "4009": 74009, "400910": 7400910, "400920": 7400920, "400930": 7400930, "400940": 7400940, "400950": 7400950, "4010": 74010, "401010": 7401010, "401091": 7401091, "401099": 7401099, "4011": 74011, "401110": 7401110, "401120": 7401120, "401130": 7401130, "401140": 7401140, "401150": 7401150, "401191": 7401191, "401199": 7401199, "4012": 74012, "401210": 7401210, "401220": 7401220, "401290": 7401290, "4013": 74013, "401310": 7401310, "401320": 7401320, "401390": 7401390, "4014": 74014, "401410": 7401410, "401490": 7401490, "4015": 74015, "401511": 7401511, "401519": 7401519, "401590": 7401590, "4016": 74016, "401610": 7401610, "401691": 7401691, "401692": 7401692, "401693": 7401693, "401694": 7401694, "401695": 7401695, "401699": 7401699, "4017": 74017, "401700": 7401700, "4101": 84101, "410110": 8410110, "410121": 8410121, "410122": 8410122, "410129": 8410129, "410130": 8410130, "410140": 8410140, "4102": 84102, "410210": 8410210, "410221": 8410221, "410229": 8410229, "4103": 84103, "410310": 8410310, "410320": 8410320, "410390": 8410390, "4104": 84104, "410410": 8410410, "410421": 8410421, "410422": 8410422, "410429": 8410429, "410431": 8410431, "410439": 8410439, "4105": 84105, "410511": 8410511, "410512": 8410512, "410519": 8410519, "410520": 8410520, "4106": 84106, "410611": 8410611, "410612": 8410612, "410619": 8410619, "410620": 8410620, "4107": 84107, "410710": 8410710, "410721": 8410721, "410729": 8410729, "410790": 8410790, "4108": 84108, "410800": 8410800, "4109": 84109, "410900": 8410900, "4110": 84110, "411000": 8411000, "4111": 84111, "411100": 8411100, "4201": 84201, "420100": 8420100, "4202": 84202, "420211": 8420211, "420212": 8420212, "420219": 8420219, "420221": 8420221, "420222": 8420222, "420229": 8420229, "420231": 8420231, "420232": 8420232, "420239": 8420239, "420291": 8420291, "420292": 8420292, "420299": 8420299, "4203": 84203, "420310": 8420310, "420321": 8420321, "420329": 8420329, "420330": 8420330, "420340": 8420340, "4204": 84204, "420400": 8420400, "4205": 84205, "420500": 8420500, "4206": 84206, "420610": 8420610, "420690": 8420690, "4301": 84301, "430110": 8430110, "430120": 8430120, "430130": 8430130, "430140": 8430140, "430150": 8430150, "430160": 8430160, "430170": 8430170, "430180": 8430180, "430190": 8430190, "4302": 84302, "430211": 8430211, "430212": 8430212, "430213": 8430213, "430219": 8430219, "430220": 8430220, "430230": 8430230, "4303": 84303, "430310": 8430310, "430390": 8430390, "4304": 84304, "430400": 8430400, "4401": 94401, "440110": 9440110, "440121": 9440121, "440122": 9440122, "440130": 9440130, "4402": 94402, "440200": 9440200, "4403": 94403, "440310": 9440310, "440320": 9440320, "440331": 9440331, "440332": 9440332, "440333": 9440333, "440334": 9440334, "440335": 9440335, "440391": 9440391, "440392": 9440392, "440399": 9440399, "4404": 94404, "440410": 9440410, "440420": 9440420, "4405": 94405, "440500": 9440500, "4406": 94406, "440610": 9440610, "440690": 9440690, "4407": 94407, "440710": 9440710, "440721": 9440721, "440722": 9440722, "440723": 9440723, "440791": 9440791, "440792": 9440792, "440799": 9440799, "4408": 94408, "440810": 9440810, "440820": 9440820, "440890": 9440890, "4409": 94409, "440910": 9440910, "440920": 9440920, "4410": 94410, "441010": 9441010, "441090": 9441090, "4411": 94411, "441111": 9441111, "441119": 9441119, "441121": 9441121, "441129": 9441129, "441131": 9441131, "441139": 9441139, "441191": 9441191, "441199": 9441199, "4412": 94412, "441211": 9441211, "441212": 9441212, "441219": 9441219, "441221": 9441221, "441229": 9441229, "441291": 9441291, "441299": 9441299, "4413": 94413, "441300": 9441300, "4414": 94414, "441400": 9441400, "4415": 94415, "441510": 9441510, "441520": 9441520, "4416": 94416, "441600": 9441600, "4417": 94417, "441700": 9441700, "4418": 94418, "441810": 9441810, "441820": 9441820, "441830": 9441830, "441840": 9441840, "441850": 9441850, "441890": 9441890, "4419": 94419, "441900": 9441900, "4420": 94420, "442010": 9442010, "442090": 9442090, "4421": 94421, "442110": 9442110, "442190": 9442190, "4501": 94501, "450110": 9450110, "450190": 9450190, "4502": 94502, "450200": 9450200, "4503": 94503, "450310": 9450310, "450390": 9450390, "4504": 94504, "450410": 9450410, "450490": 9450490, "4601": 94601, "460110": 9460110, "460120": 9460120, "460191": 9460191, "460199": 9460199, "4602": 94602, "460210": 9460210, "460290": 9460290, "4701": 104701, "470100": 10470100, "4702": 104702, "470200": 10470200, "4703": 104703, "470311": 10470311, "470319": 10470319, "470321": 10470321, "470329": 10470329, "4704": 104704, "470411": 10470411, "470419": 10470419, "470421": 10470421, "470429": 10470429, "4705": 104705, "470500": 10470500, "4706": 104706, "470610": 10470610, "470691": 10470691, "470692": 10470692, "470693": 10470693, "4707": 104707, "470710": 10470710, "470720": 10470720, "470730": 10470730, "470790": 10470790, "4801": 104801, "480100": 10480100, "4802": 104802, "480210": 10480210, "480220": 10480220, "480230": 10480230, "480240": 10480240, "480251": 10480251, "480252": 10480252, "480253": 10480253, "480260": 10480260, "4803": 104803, "480300": 10480300, "4804": 104804, "480411": 10480411, "480419": 10480419, "480421": 10480421, "480429": 10480429, "480431": 10480431, "480439": 10480439, "480441": 10480441, "480442": 10480442, "480449": 10480449, "480451": 10480451, "480452": 10480452, "480459": 10480459, "4805": 104805, "480510": 10480510, "480521": 10480521, "480522": 10480522, "480523": 10480523, "480529": 10480529, "480530": 10480530, "480540": 10480540, "480550": 10480550, "480560": 10480560, "480570": 10480570, "480580": 10480580, "4806": 104806, "480610": 10480610, "480620": 10480620, "480630": 10480630, "480640": 10480640, "4807": 104807, "480710": 10480710, "480791": 10480791, "480799": 10480799, "4808": 104808, "480810": 10480810, "480820": 10480820, "480830": 10480830, "480890": 10480890, "4809": 104809, "480910": 10480910, "480920": 10480920, "480990": 10480990, "4810": 104810, "481011": 10481011, "481012": 10481012, "481021": 10481021, "481029": 10481029, "481031": 10481031, "481032": 10481032, "481039": 10481039, "481091": 10481091, "481099": 10481099, "4811": 104811, "481110": 10481110, "481121": 10481121, "481129": 10481129, "481131": 10481131, "481139": 10481139, "481140": 10481140, "481190": 10481190, "4812": 104812, "481200": 10481200, "4813": 104813, "481310": 10481310, "481320": 10481320, "481390": 10481390, "4814": 104814, "481410": 10481410, "481420": 10481420, "481430": 10481430, "481490": 10481490, "4815": 104815, "481500": 10481500, "4816": 104816, "481610": 10481610, "481620": 10481620, "481630": 10481630, "481690": 10481690, "4817": 104817, "481710": 10481710, "481720": 10481720, "481730": 10481730, "4818": 104818, "481810": 10481810, "481820": 10481820, "481830": 10481830, "481840": 10481840, "481850": 10481850, "481890": 10481890, "4819": 104819, "481910": 10481910, "481920": 10481920, "481930": 10481930, "481940": 10481940, "481950": 10481950, "481960": 10481960, "4820": 104820, "482010": 10482010, "482020": 10482020, "482030": 10482030, "482040": 10482040, "482050": 10482050, "482090": 10482090, "4821": 104821, "482110": 10482110, "482190": 10482190, "4822": 104822, "482210": 10482210, "482290": 10482290, "4823": 104823, "482311": 10482311, "482319": 10482319, "482320": 10482320, "482330": 10482330, "482340": 10482340, "482351": 10482351, "482359": 10482359, "482360": 10482360, "482370": 10482370, "482390": 10482390, "4901": 104901, "490110": 10490110, "490191": 10490191, "490199": 10490199, "4902": 104902, "490210": 10490210, "490290": 10490290, "4903": 104903, "490300": 10490300, "4904": 104904, "490400": 10490400, "4905": 104905, "490510": 10490510, "490591": 10490591, "490599": 10490599, "4906": 104906, "490600": 10490600, "4907": 104907, "490700": 10490700, "4908": 104908, "490810": 10490810, "490890": 10490890, "4909": 104909, "490900": 10490900, "4910": 104910, "491000": 10491000, "4911": 104911, "491110": 10491110, "491191": 10491191, "491199": 10491199, "5001": 115001, "500100": 11500100, "5002": 115002, "500200": 11500200, "5003": 115003, "500310": 11500310, "500390": 11500390, "5004": 115004, "500400": 11500400, "5005": 115005, "500500": 11500500, "5006": 115006, "500600": 11500600, "5007": 115007, "500710": 11500710, "500720": 11500720, "500790": 11500790, "5101": 115101, "510111": 11510111, "510119": 11510119, "510121": 11510121, "510129": 11510129, "510130": 11510130, "5102": 115102, "510210": 11510210, "510220": 11510220, "5103": 115103, "510310": 11510310, "510320": 11510320, "510330": 11510330, "5104": 115104, "510400": 11510400, "5105": 115105, "510510": 11510510, "510521": 11510521, "510529": 11510529, "510530": 11510530, "510540": 11510540, "5106": 115106, "510610": 11510610, "510620": 11510620, "5107": 115107, "510710": 11510710, "510720": 11510720, "5108": 115108, "510810": 11510810, "510820": 11510820, "5109": 115109, "510910": 11510910, "510990": 11510990, "5110": 115110, "511000": 11511000, "5111": 115111, "511111": 11511111, "511119": 11511119, "511120": 11511120, "511130": 11511130, "511190": 11511190, "5112": 115112, "511211": 11511211, "511219": 11511219, "511220": 11511220, "511230": 11511230, "511290": 11511290, "5113": 115113, "511300": 11511300, "5201": 115201, "520100": 11520100, "5202": 115202, "520210": 11520210, "520291": 11520291, "520299": 11520299, "5203": 115203, "520300": 11520300, "5204": 115204, "520411": 11520411, "520419": 11520419, "520420": 11520420, "5205": 115205, "520511": 11520511, "520512": 11520512, "520513": 11520513, "520514": 11520514, "520515": 11520515, "520521": 11520521, "520522": 11520522, "520523": 11520523, "520524": 11520524, "520525": 11520525, "520531": 11520531, "520532": 11520532, "520533": 11520533, "520534": 11520534, "520535": 11520535, "520541": 11520541, "520542": 11520542, "520543": 11520543, "520544": 11520544, "520545": 11520545, "5206": 115206, "520611": 11520611, "520612": 11520612, "520613": 11520613, "520614": 11520614, "520615": 11520615, "520621": 11520621, "520622": 11520622, "520623": 11520623, "520624": 11520624, "520625": 11520625, "520631": 11520631, "520632": 11520632, "520633": 11520633, "520634": 11520634, "520635": 11520635, "520641": 11520641, "520642": 11520642, "520643": 11520643, "520644": 11520644, "520645": 11520645, "5207": 115207, "520710": 11520710, "520790": 11520790, "5208": 115208, "520811": 11520811, "520812": 11520812, "520813": 11520813, "520819": 11520819, "520821": 11520821, "520822": 11520822, "520823": 11520823, "520829": 11520829, "520831": 11520831, "520832": 11520832, "520833": 11520833, "520839": 11520839, "520841": 11520841, "520842": 11520842, "520843": 11520843, "520849": 11520849, "520851": 11520851, "520852": 11520852, "520853": 11520853, "520859": 11520859, "5209": 115209, "520911": 11520911, "520912": 11520912, "520919": 11520919, "520921": 11520921, "520922": 11520922, "520929": 11520929, "520931": 11520931, "520932": 11520932, "520939": 11520939, "520941": 11520941, "520942": 11520942, "520943": 11520943, "520949": 11520949, "520951": 11520951, "520952": 11520952, "520959": 11520959, "5210": 115210, "521011": 11521011, "521012": 11521012, "521019": 11521019, "521021": 11521021, "521022": 11521022, "521029": 11521029, "521031": 11521031, "521032": 11521032, "521039": 11521039, "521041": 11521041, "521042": 11521042, "521049": 11521049, "521051": 11521051, "521052": 11521052, "521059": 11521059, "5211": 115211, "521111": 11521111, "521112": 11521112, "521119": 11521119, "521121": 11521121, "521122": 11521122, "521129": 11521129, "521131": 11521131, "521132": 11521132, "521139": 11521139, "521141": 11521141, "521142": 11521142, "521143": 11521143, "521149": 11521149, "521151": 11521151, "521152": 11521152, "521159": 11521159, "5212": 115212, "521211": 11521211, "521212": 11521212, "521213": 11521213, "521214": 11521214, "521215": 11521215, "521221": 11521221, "521222": 11521222, "521223": 11521223, "521224": 11521224, "521225": 11521225, "5301": 115301, "530110": 11530110, "530121": 11530121, "530129": 11530129, "530130": 11530130, "5302": 115302, "530210": 11530210, "530290": 11530290, "5303": 115303, "530310": 11530310, "530390": 11530390, "5304": 115304, "530410": 11530410, "530490": 11530490, "5305": 115305, "530511": 11530511, "530519": 11530519, "530521": 11530521, "530529": 11530529, "530591": 11530591, "530599": 11530599, "5306": 115306, "530610": 11530610, "530620": 11530620, "5307": 115307, "530710": 11530710, "530720": 11530720, "5308": 115308, "530810": 11530810, "530820": 11530820, "530830": 11530830, "530890": 11530890, "5309": 115309, "530911": 11530911, "530919": 11530919, "530921": 11530921, "530929": 11530929, "5310": 115310, "531010": 11531010, "531090": 11531090, "5311": 115311, "531100": 11531100, "5401": 115401, "540110": 11540110, "540120": 11540120, "5402": 115402, "540210": 11540210, "540220": 11540220, "540231": 11540231, "540232": 11540232, "540233": 11540233, "540239": 11540239, "540241": 11540241, "540242": 11540242, "540243": 11540243, "540249": 11540249, "540251": 11540251, "540252": 11540252, "540259": 11540259, "540261": 11540261, "540262": 11540262, "540269": 11540269, "5403": 115403, "540310": 11540310, "540320": 11540320, "540331": 11540331, "540332": 11540332, "540333": 11540333, "540339": 11540339, "540341": 11540341, "540342": 11540342, "540349": 11540349, "5404": 115404, "540410": 11540410, "540490": 11540490, "5405": 115405, "540500": 11540500, "5406": 115406, "540610": 11540610, "540620": 11540620, "5407": 115407, "540710": 11540710, "540720": 11540720, "540730": 11540730, "540741": 11540741, "540742": 11540742, "540743": 11540743, "540744": 11540744, "540751": 11540751, "540752": 11540752, "540753": 11540753, "540754": 11540754, "540760": 11540760, "540771": 11540771, "540772": 11540772, "540773": 11540773, "540774": 11540774, "540781": 11540781, "540782": 11540782, "540783": 11540783, "540784": 11540784, "540791": 11540791, "540792": 11540792, "540793": 11540793, "540794": 11540794, "5408": 115408, "540810": 11540810, "540821": 11540821, "540822": 11540822, "540823": 11540823, "540824": 11540824, "540831": 11540831, "540832": 11540832, "540833": 11540833, "540834": 11540834, "5501": 115501, "550110": 11550110, "550120": 11550120, "550130": 11550130, "550190": 11550190, "5502": 115502, "550200": 11550200, "5503": 115503, "550310": 11550310, "550320": 11550320, "550330": 11550330, "550340": 11550340, "550390": 11550390, "5504": 115504, "550410": 11550410, "550490": 11550490, "5505": 115505, "550510": 11550510, "550520": 11550520, "5506": 115506, "550610": 11550610, "550620": 11550620, "550630": 11550630, "550690": 11550690, "5507": 115507, "550700": 11550700, "5508": 115508, "550810": 11550810, "550820": 11550820, "5509": 115509, "550911": 11550911, "550912": 11550912, "550921": 11550921, "550922": 11550922, "550931": 11550931, "550932": 11550932, "550941": 11550941, "550942": 11550942, "550951": 11550951, "550952": 11550952, "550953": 11550953, "550959": 11550959, "550961": 11550961, "550962": 11550962, "550969": 11550969, "550991": 11550991, "550992": 11550992, "550999": 11550999, "5510": 115510, "551011": 11551011, "551012": 11551012, "551020": 11551020, "551030": 11551030, "551090": 11551090, "5511": 115511, "551110": 11551110, "551120": 11551120, "551130": 11551130, "5512": 115512, "551211": 11551211, "551219": 11551219, "551221": 11551221, "551229": 11551229, "551291": 11551291, "551299": 11551299, "5513": 115513, "551311": 11551311, "551312": 11551312, "551313": 11551313, "551319": 11551319, "551321": 11551321, "551322": 11551322, "551323": 11551323, "551329": 11551329, "551331": 11551331, "551332": 11551332, "551333": 11551333, "551339": 11551339, "551341": 11551341, "551342": 11551342, "551343": 11551343, "551349": 11551349, "5514": 115514, "551411": 11551411, "551412": 11551412, "551413": 11551413, "551419": 11551419, "551421": 11551421, "551422": 11551422, "551423": 11551423, "551429": 11551429, "551431": 11551431, "551432": 11551432, "551433": 11551433, "551439": 11551439, "551441": 11551441, "551442": 11551442, "551443": 11551443, "551449": 11551449, "5515": 115515, "551511": 11551511, "551512": 11551512, "551513": 11551513, "551519": 11551519, "551521": 11551521, "551522": 11551522, "551529": 11551529, "551591": 11551591, "551592": 11551592, "551599": 11551599, "5516": 115516, "551611": 11551611, "551612": 11551612, "551613": 11551613, "551614": 11551614, "551621": 11551621, "551622": 11551622, "551623": 11551623, "551624": 11551624, "551631": 11551631, "551632": 11551632, "551633": 11551633, "551634": 11551634, "551641": 11551641, "551642": 11551642, "551643": 11551643, "551644": 11551644, "551691": 11551691, "551692": 11551692, "551693": 11551693, "551694": 11551694, "5601": 115601, "560110": 11560110, "560121": 11560121, "560122": 11560122, "560129": 11560129, "560130": 11560130, "5602": 115602, "560210": 11560210, "560221": 11560221, "560229": 11560229, "560290": 11560290, "5603": 115603, "560300": 11560300, "5604": 115604, "560410": 11560410, "560420": 11560420, "560490": 11560490, "5605": 115605, "560500": 11560500, "5606": 115606, "560600": 11560600, "5607": 115607, "560710": 11560710, "560721": 11560721, "560729": 11560729, "560730": 11560730, "560741": 11560741, "560749": 11560749, "560750": 11560750, "560790": 11560790, "5608": 115608, "560811": 11560811, "560819": 11560819, "560890": 11560890, "5609": 115609, "560900": 11560900, "5701": 115701, "570110": 11570110, "570190": 11570190, "5702": 115702, "570210": 11570210, "570220": 11570220, "570231": 11570231, "570232": 11570232, "570239": 11570239, "570241": 11570241, "570242": 11570242, "570249": 11570249, "570251": 11570251, "570252": 11570252, "570259": 11570259, "570291": 11570291, "570292": 11570292, "570299": 11570299, "5703": 115703, "570310": 11570310, "570320": 11570320, "570330": 11570330, "570390": 11570390, "5704": 115704, "570410": 11570410, "570490": 11570490, "5705": 115705, "570500": 11570500, "5801": 115801, "580110": 11580110, "580121": 11580121, "580122": 11580122, "580123": 11580123, "580124": 11580124, "580125": 11580125, "580126": 11580126, "580131": 11580131, "580132": 11580132, "580133": 11580133, "580134": 11580134, "580135": 11580135, "580136": 11580136, "580190": 11580190, "5802": 115802, "580211": 11580211, "580219": 11580219, "580220": 11580220, "580230": 11580230, "5803": 115803, "580310": 11580310, "580390": 11580390, "5804": 115804, "580410": 11580410, "580421": 11580421, "580429": 11580429, "580430": 11580430, "5805": 115805, "580500": 11580500, "5806": 115806, "580610": 11580610, "580620": 11580620, "580631": 11580631, "580632": 11580632, "580639": 11580639, "580640": 11580640, "5807": 115807, "580710": 11580710, "580790": 11580790, "5808": 115808, "580810": 11580810, "580890": 11580890, "5809": 115809, "580900": 11580900, "5810": 115810, "581010": 11581010, "581091": 11581091, "581092": 11581092, "581099": 11581099, "5811": 115811, "581100": 11581100, "5901": 115901, "590110": 11590110, "590190": 11590190, "5902": 115902, "590210": 11590210, "590220": 11590220, "590290": 11590290, "5903": 115903, "590310": 11590310, "590320": 11590320, "590390": 11590390, "5904": 115904, "590410": 11590410, "590491": 11590491, "590492": 11590492, "5905": 115905, "590500": 11590500, "5906": 115906, "590610": 11590610, "590691": 11590691, "590699": 11590699, "5907": 115907, "590700": 11590700, "5908": 115908, "590800": 11590800, "5909": 115909, "590900": 11590900, "5910": 115910, "591000": 11591000, "5911": 115911, "591110": 11591110, "591120": 11591120, "591131": 11591131, "591132": 11591132, "591140": 11591140, "591190": 11591190, "6001": 116001, "600110": 11600110, "600121": 11600121, "600122": 11600122, "600129": 11600129, "600191": 11600191, "600192": 11600192, "600199": 11600199, "6002": 116002, "600210": 11600210, "600220": 11600220, "600230": 11600230, "600241": 11600241, "600242": 11600242, "600243": 11600243, "600249": 11600249, "600291": 11600291, "600292": 11600292, "600293": 11600293, "600299": 11600299, "6101": 116101, "610110": 11610110, "610120": 11610120, "610130": 11610130, "610190": 11610190, "6102": 116102, "610210": 11610210, "610220": 11610220, "610230": 11610230, "610290": 11610290, "6103": 116103, "610311": 11610311, "610312": 11610312, "610319": 11610319, "610321": 11610321, "610322": 11610322, "610323": 11610323, "610329": 11610329, "610331": 11610331, "610332": 11610332, "610333": 11610333, "610339": 11610339, "610341": 11610341, "610342": 11610342, "610343": 11610343, "610349": 11610349, "6104": 116104, "610411": 11610411, "610412": 11610412, "610413": 11610413, "610419": 11610419, "610421": 11610421, "610422": 11610422, "610423": 11610423, "610429": 11610429, "610431": 11610431, "610432": 11610432, "610433": 11610433, "610439": 11610439, "610441": 11610441, "610442": 11610442, "610443": 11610443, "610444": 11610444, "610449": 11610449, "610451": 11610451, "610452": 11610452, "610453": 11610453, "610459": 11610459, "610461": 11610461, "610462": 11610462, "610463": 11610463, "610469": 11610469, "6105": 116105, "610510": 11610510, "610520": 11610520, "610590": 11610590, "6106": 116106, "610610": 11610610, "610620": 11610620, "610690": 11610690, "6107": 116107, "610711": 11610711, "610712": 11610712, "610719": 11610719, "610721": 11610721, "610722": 11610722, "610729": 11610729, "610791": 11610791, "610792": 11610792, "610799": 11610799, "6108": 116108, "610811": 11610811, "610819": 11610819, "610821": 11610821, "610822": 11610822, "610829": 11610829, "610831": 11610831, "610832": 11610832, "610839": 11610839, "610891": 11610891, "610892": 11610892, "610899": 11610899, "6109": 116109, "610910": 11610910, "610990": 11610990, "6110": 116110, "611010": 11611010, "611020": 11611020, "611030": 11611030, "611090": 11611090, "6111": 116111, "611110": 11611110, "611120": 11611120, "611130": 11611130, "611190": 11611190, "6112": 116112, "611211": 11611211, "611212": 11611212, "611219": 11611219, "611220": 11611220, "611231": 11611231, "611239": 11611239, "611241": 11611241, "611249": 11611249, "6113": 116113, "611300": 11611300, "6114": 116114, "611410": 11611410, "611420": 11611420, "611430": 11611430, "611490": 11611490, "6115": 116115, "611511": 11611511, "611512": 11611512, "611519": 11611519, "611520": 11611520, "611591": 11611591, "611592": 11611592, "611593": 11611593, "611599": 11611599, "6116": 116116, "611610": 11611610, "611691": 11611691, "611692": 11611692, "611693": 11611693, "611699": 11611699, "6117": 116117, "611710": 11611710, "611720": 11611720, "611780": 11611780, "611790": 11611790, "6201": 116201, "620111": 11620111, "620112": 11620112, "620113": 11620113, "620119": 11620119, "620191": 11620191, "620192": 11620192, "620193": 11620193, "620199": 11620199, "6202": 116202, "620211": 11620211, "620212": 11620212, "620213": 11620213, "620219": 11620219, "620291": 11620291, "620292": 11620292, "620293": 11620293, "620299": 11620299, "6203": 116203, "620311": 11620311, "620312": 11620312, "620319": 11620319, "620321": 11620321, "620322": 11620322, "620323": 11620323, "620329": 11620329, "620331": 11620331, "620332": 11620332, "620333": 11620333, "620339": 11620339, "620341": 11620341, "620342": 11620342, "620343": 11620343, "620349": 11620349, "6204": 116204, "620411": 11620411, "620412": 11620412, "620413": 11620413, "620419": 11620419, "620421": 11620421, "620422": 11620422, "620423": 11620423, "620429": 11620429, "620431": 11620431, "620432": 11620432, "620433": 11620433, "620439": 11620439, "620441": 11620441, "620442": 11620442, "620443": 11620443, "620444": 11620444, "620449": 11620449, "620451": 11620451, "620452": 11620452, "620453": 11620453, "620459": 11620459, "620461": 11620461, "620462": 11620462, "620463": 11620463, "620469": 11620469, "6205": 116205, "620510": 11620510, "620520": 11620520, "620530": 11620530, "620590": 11620590, "6206": 116206, "620610": 11620610, "620620": 11620620, "620630": 11620630, "620640": 11620640, "620690": 11620690, "6207": 116207, "620711": 11620711, "620719": 11620719, "620721": 11620721, "620722": 11620722, "620729": 11620729, "620791": 11620791, "620792": 11620792, "620799": 11620799, "6208": 116208, "620811": 11620811, "620819": 11620819, "620821": 11620821, "620822": 11620822, "620829": 11620829, "620891": 11620891, "620892": 11620892, "620899": 11620899, "6209": 116209, "620910": 11620910, "620920": 11620920, "620930": 11620930, "620990": 11620990, "6210": 116210, "621010": 11621010, "621020": 11621020, "621030": 11621030, "621040": 11621040, "621050": 11621050, "6211": 116211, "621111": 11621111, "621112": 11621112, "621120": 11621120, "621131": 11621131, "621132": 11621132, "621133": 11621133, "621139": 11621139, "621141": 11621141, "621142": 11621142, "621143": 11621143, "621149": 11621149, "6212": 116212, "621210": 11621210, "621220": 11621220, "621230": 11621230, "621290": 11621290, "6213": 116213, "621310": 11621310, "621320": 11621320, "621390": 11621390, "6214": 116214, "621410": 11621410, "621420": 11621420, "621430": 11621430, "621440": 11621440, "621490": 11621490, "6215": 116215, "621510": 11621510, "621520": 11621520, "621590": 11621590, "6216": 116216, "621600": 11621600, "6217": 116217, "621710": 11621710, "621790": 11621790, "6301": 116301, "630110": 11630110, "630120": 11630120, "630130": 11630130, "630140": 11630140, "630190": 11630190, "6302": 116302, "630210": 11630210, "630221": 11630221, "630222": 11630222, "630229": 11630229, "630231": 11630231, "630232": 11630232, "630239": 11630239, "630240": 11630240, "630251": 11630251, "630252": 11630252, "630253": 11630253, "630259": 11630259, "630260": 11630260, "630291": 11630291, "630292": 11630292, "630293": 11630293, "630299": 11630299, "6303": 116303, "630311": 11630311, "630312": 11630312, "630319": 11630319, "630391": 11630391, "630392": 11630392, "630399": 11630399, "6304": 116304, "630411": 11630411, "630419": 11630419, "630491": 11630491, "630492": 11630492, "630493": 11630493, "630499": 11630499, "6305": 116305, "630510": 11630510, "630520": 11630520, "630531": 11630531, "630539": 11630539, "630590": 11630590, "6306": 116306, "630611": 11630611, "630612": 11630612, "630619": 11630619, "630621": 11630621, "630622": 11630622, "630629": 11630629, "630631": 11630631, "630639": 11630639, "630641": 11630641, "630649": 11630649, "630691": 11630691, "630699": 11630699, "6307": 116307, "630710": 11630710, "630720": 11630720, "630790": 11630790, "6308": 116308, "630800": 11630800, "6309": 116309, "630900": 11630900, "6310": 116310, "631010": 11631010, "631090": 11631090, "6401": 126401, "640110": 12640110, "640191": 12640191, "640192": 12640192, "640199": 12640199, "6402": 126402, "640211": 12640211, "640219": 12640219, "640220": 12640220, "640230": 12640230, "640291": 12640291, "640299": 12640299, "6403": 126403, "640311": 12640311, "640319": 12640319, "640320": 12640320, "640330": 12640330, "640340": 12640340, "640351": 12640351, "640359": 12640359, "640391": 12640391, "640399": 12640399, "6404": 126404, "640411": 12640411, "640419": 12640419, "640420": 12640420, "6405": 126405, "640510": 12640510, "640520": 12640520, "640590": 12640590, "6406": 126406, "640610": 12640610, "640620": 12640620, "640691": 12640691, "640699": 12640699, "6501": 126501, "650100": 12650100, "6502": 126502, "650200": 12650200, "6503": 126503, "650300": 12650300, "6504": 126504, "650400": 12650400, "6505": 126505, "650510": 12650510, "650590": 12650590, "6506": 126506, "650610": 12650610, "650691": 12650691, "650692": 12650692, "650699": 12650699, "6507": 126507, "650700": 12650700, "6601": 126601, "660110": 12660110, "660191": 12660191, "660199": 12660199, "6602": 126602, "660200": 12660200, "6603": 126603, "660310": 12660310, "660320": 12660320, "660390": 12660390, "6701": 126701, "670100": 12670100, "6702": 126702, "670210": 12670210, "670290": 12670290, "6703": 126703, "670300": 12670300, "6704": 126704, "670411": 12670411, "670419": 12670419, "670420": 12670420, "670490": 12670490, "6801": 136801, "680100": 13680100, "6802": 136802, "680210": 13680210, "680221": 13680221, "680222": 13680222, "680223": 13680223, "680229": 13680229, "680291": 13680291, "680292": 13680292, "680293": 13680293, "680299": 13680299, "6803": 136803, "680300": 13680300, "6804": 136804, "680410": 13680410, "680421": 13680421, "680422": 13680422, "680423": 13680423, "680430": 13680430, "6805": 136805, "680510": 13680510, "680520": 13680520, "680530": 13680530, "6806": 136806, "680610": 13680610, "680620": 13680620, "680690": 13680690, "6807": 136807, "680710": 13680710, "680790": 13680790, "6808": 136808, "680800": 13680800, "6809": 136809, "680911": 13680911, "680919": 13680919, "680990": 13680990, "6810": 136810, "681011": 13681011, "681019": 13681019, "681020": 13681020, "681091": 13681091, "681099": 13681099, "6811": 136811, "681110": 13681110, "681120": 13681120, "681130": 13681130, "681190": 13681190, "6812": 136812, "681210": 13681210, "681220": 13681220, "681230": 13681230, "681240": 13681240, "681250": 13681250, "681260": 13681260, "681270": 13681270, "681290": 13681290, "6813": 136813, "681310": 13681310, "681390": 13681390, "6814": 136814, "681410": 13681410, "681490": 13681490, "6815": 136815, "681510": 13681510, "681520": 13681520, "681591": 13681591, "681599": 13681599, "6901": 136901, "690100": 13690100, "6902": 136902, "690210": 13690210, "690220": 13690220, "690290": 13690290, "6903": 136903, "690310": 13690310, "690320": 13690320, "690390": 13690390, "6904": 136904, "690410": 13690410, "690490": 13690490, "6905": 136905, "690510": 13690510, "690590": 13690590, "6906": 136906, "690600": 13690600, "6907": 136907, "690710": 13690710, "690790": 13690790, "6908": 136908, "690810": 13690810, "690890": 13690890, "6909": 136909, "690911": 13690911, "690919": 13690919, "690990": 13690990, "6910": 136910, "691010": 13691010, "691090": 13691090, "6911": 136911, "691110": 13691110, "691190": 13691190, "6912": 136912, "691200": 13691200, "6913": 136913, "691310": 13691310, "691390": 13691390, "6914": 136914, "691410": 13691410, "691490": 13691490, "7001": 137001, "700100": 13700100, "7002": 137002, "700210": 13700210, "700220": 13700220, "700231": 13700231, "700232": 13700232, "700239": 13700239, "7003": 137003, "700311": 13700311, "700319": 13700319, "700320": 13700320, "700330": 13700330, "7004": 137004, "700410": 13700410, "700490": 13700490, "7005": 137005, "700510": 13700510, "700521": 13700521, "700529": 13700529, "700530": 13700530, "7006": 137006, "700600": 13700600, "7007": 137007, "700711": 13700711, "700719": 13700719, "700721": 13700721, "700729": 13700729, "7008": 137008, "700800": 13700800, "7009": 137009, "700910": 13700910, "700991": 13700991, "700992": 13700992, "7010": 137010, "701010": 13701010, "701090": 13701090, "7011": 137011, "701110": 13701110, "701120": 13701120, "701190": 13701190, "7012": 137012, "701200": 13701200, "7013": 137013, "701310": 13701310, "701321": 13701321, "701329": 13701329, "701331": 13701331, "701332": 13701332, "701339": 13701339, "701391": 13701391, "701399": 13701399, "7014": 137014, "701400": 13701400, "7015": 137015, "701510": 13701510, "701590": 13701590, "7016": 137016, "701610": 13701610, "701690": 13701690, "7017": 137017, "701710": 13701710, "701720": 13701720, "701790": 13701790, "7018": 137018, "701810": 13701810, "701820": 13701820, "701890": 13701890, "7019": 137019, "701910": 13701910, "701920": 13701920, "701931": 13701931, "701932": 13701932, "701939": 13701939, "701990": 13701990, "7020": 137020, "702000": 13702000, "7101": 147101, "710110": 14710110, "710121": 14710121, "710122": 14710122, "7102": 147102, "710210": 14710210, "710221": 14710221, "710229": 14710229, "710231": 14710231, "710239": 14710239, "7103": 147103, "710310": 14710310, "710391": 14710391, "710399": 14710399, "7104": 147104, "710410": 14710410, "710420": 14710420, "710490": 14710490, "7105": 147105, "710510": 14710510, "710590": 14710590, "7106": 147106, "710610": 14710610, "710691": 14710691, "710692": 14710692, "7107": 147107, "710700": 14710700, "7108": 147108, "710811": 14710811, "710812": 14710812, "710813": 14710813, "7109": 147109, "710900": 14710900, "7110": 147110, "711011": 14711011, "711019": 14711019, "711021": 14711021, "711029": 14711029, "711031": 14711031, "711039": 14711039, "711041": 14711041, "711049": 14711049, "7111": 147111, "711100": 14711100, "7112": 147112, "711210": 14711210, "711220": 14711220, "711290": 14711290, "7113": 147113, "711311": 14711311, "711319": 14711319, "711320": 14711320, "7114": 147114, "711411": 14711411, "711419": 14711419, "711420": 14711420, "7115": 147115, "711510": 14711510, "711590": 14711590, "7116": 147116, "711610": 14711610, "711620": 14711620, "7117": 147117, "711711": 14711711, "711719": 14711719, "711790": 14711790, "7118": 147118, "711810": 14711810, "711890": 14711890, "7201": 157201, "720110": 15720110, "720120": 15720120, "720130": 15720130, "720140": 15720140, "7202": 157202, "720211": 15720211, "720219": 15720219, "720221": 15720221, "720229": 15720229, "720230": 15720230, "720241": 15720241, "720249": 15720249, "720250": 15720250, "720260": 15720260, "720270": 15720270, "720280": 15720280, "720291": 15720291, "720292": 15720292, "720293": 15720293, "720299": 15720299, "7203": 157203, "720310": 15720310, "720390": 15720390, "7204": 157204, "720410": 15720410, "720421": 15720421, "720429": 15720429, "720430": 15720430, "720441": 15720441, "720449": 15720449, "720450": 15720450, "7205": 157205, "720510": 15720510, "720521": 15720521, "720529": 15720529, "7206": 157206, "720610": 15720610, "720690": 15720690, "7207": 157207, "720711": 15720711, "720712": 15720712, "720719": 15720719, "720720": 15720720, "7208": 157208, "720811": 15720811, "720812": 15720812, "720813": 15720813, "720814": 15720814, "720821": 15720821, "720822": 15720822, "720823": 15720823, "720824": 15720824, "720831": 15720831, "720832": 15720832, "720833": 15720833, "720834": 15720834, "720835": 15720835, "720841": 15720841, "720842": 15720842, "720843": 15720843, "720844": 15720844, "720845": 15720845, "720890": 15720890, "7209": 157209, "720911": 15720911, "720912": 15720912, "720913": 15720913, "720914": 15720914, "720921": 15720921, "720922": 15720922, "720923": 15720923, "720924": 15720924, "720931": 15720931, "720932": 15720932, "720933": 15720933, "720934": 15720934, "720941": 15720941, "720942": 15720942, "720943": 15720943, "720944": 15720944, "720990": 15720990, "7210": 157210, "721011": 15721011, "721012": 15721012, "721020": 15721020, "721031": 15721031, "721039": 15721039, "721041": 15721041, "721049": 15721049, "721050": 15721050, "721060": 15721060, "721070": 15721070, "721090": 15721090, "7211": 157211, "721111": 15721111, "721112": 15721112, "721119": 15721119, "721121": 15721121, "721122": 15721122, "721129": 15721129, "721130": 15721130, "721141": 15721141, "721149": 15721149, "721190": 15721190, "7212": 157212, "721210": 15721210, "721221": 15721221, "721229": 15721229, "721230": 15721230, "721240": 15721240, "721250": 15721250, "721260": 15721260, "7213": 157213, "721310": 15721310, "721320": 15721320, "721331": 15721331, "721339": 15721339, "721341": 15721341, "721349": 15721349, "721350": 15721350, "7214": 157214, "721410": 15721410, "721420": 15721420, "721430": 15721430, "721440": 15721440, "721450": 15721450, "721460": 15721460, "7215": 157215, "721510": 15721510, "721520": 15721520, "721530": 15721530, "721540": 15721540, "721590": 15721590, "7216": 157216, "721610": 15721610, "721621": 15721621, "721622": 15721622, "721631": 15721631, "721632": 15721632, "721633": 15721633, "721640": 15721640, "721650": 15721650, "721660": 15721660, "721690": 15721690, "7217": 157217, "721711": 15721711, "721712": 15721712, "721713": 15721713, "721719": 15721719, "721721": 15721721, "721722": 15721722, "721723": 15721723, "721729": 15721729, "721731": 15721731, "721732": 15721732, "721733": 15721733, "721739": 15721739, "7218": 157218, "721810": 15721810, "721890": 15721890, "7219": 157219, "721911": 15721911, "721912": 15721912, "721913": 15721913, "721914": 15721914, "721921": 15721921, "721922": 15721922, "721923": 15721923, "721924": 15721924, "721931": 15721931, "721932": 15721932, "721933": 15721933, "721934": 15721934, "721935": 15721935, "721990": 15721990, "7220": 157220, "722011": 15722011, "722012": 15722012, "722020": 15722020, "722090": 15722090, "7221": 157221, "722100": 15722100, "7222": 157222, "722210": 15722210, "722220": 15722220, "722230": 15722230, "722240": 15722240, "7223": 157223, "722300": 15722300, "7224": 157224, "722410": 15722410, "722490": 15722490, "7225": 157225, "722510": 15722510, "722520": 15722520, "722530": 15722530, "722540": 15722540, "722550": 15722550, "722590": 15722590, "7226": 157226, "722610": 15722610, "722620": 15722620, "722691": 15722691, "722692": 15722692, "722699": 15722699, "7227": 157227, "722710": 15722710, "722720": 15722720, "722790": 15722790, "7228": 157228, "722810": 15722810, "722820": 15722820, "722830": 15722830, "722840": 15722840, "722850": 15722850, "722860": 15722860, "722870": 15722870, "722880": 15722880, "7229": 157229, "722910": 15722910, "722920": 15722920, "722990": 15722990, "7301": 157301, "730110": 15730110, "730120": 15730120, "7302": 157302, "730210": 15730210, "730220": 15730220, "730230": 15730230, "730240": 15730240, "730290": 15730290, "7303": 157303, "730300": 15730300, "7304": 157304, "730410": 15730410, "730420": 15730420, "730431": 15730431, "730439": 15730439, "730441": 15730441, "730449": 15730449, "730451": 15730451, "730459": 15730459, "730490": 15730490, "7305": 157305, "730511": 15730511, "730512": 15730512, "730519": 15730519, "730520": 15730520, "730531": 15730531, "730539": 15730539, "730590": 15730590, "7306": 157306, "730610": 15730610, "730620": 15730620, "730630": 15730630, "730640": 15730640, "730650": 15730650, "730660": 15730660, "730690": 15730690, "7307": 157307, "730711": 15730711, "730719": 15730719, "730721": 15730721, "730722": 15730722, "730723": 15730723, "730729": 15730729, "730791": 15730791, "730792": 15730792, "730793": 15730793, "730799": 15730799, "7308": 157308, "730810": 15730810, "730820": 15730820, "730830": 15730830, "730840": 15730840, "730890": 15730890, "7309": 157309, "730900": 15730900, "7310": 157310, "731010": 15731010, "731021": 15731021, "731029": 15731029, "7311": 157311, "731100": 15731100, "7312": 157312, "731210": 15731210, "731290": 15731290, "7313": 157313, "731300": 15731300, "7314": 157314, "731411": 15731411, "731419": 15731419, "731420": 15731420, "731430": 15731430, "731441": 15731441, "731442": 15731442, "731449": 15731449, "731450": 15731450, "7315": 157315, "731511": 15731511, "731512": 15731512, "731519": 15731519, "731520": 15731520, "731581": 15731581, "731582": 15731582, "731589": 15731589, "731590": 15731590, "7316": 157316, "731600": 15731600, "7317": 157317, "731700": 15731700, "7318": 157318, "731811": 15731811, "731812": 15731812, "731813": 15731813, "731814": 15731814, "731815": 15731815, "731816": 15731816, "731819": 15731819, "731821": 15731821, "731822": 15731822, "731823": 15731823, "731824": 15731824, "731829": 15731829, "7319": 157319, "731910": 15731910, "731920": 15731920, "731930": 15731930, "731990": 15731990, "7320": 157320, "732010": 15732010, "732020": 15732020, "732090": 15732090, "7321": 157321, "732111": 15732111, "732112": 15732112, "732113": 15732113, "732181": 15732181, "732182": 15732182, "732183": 15732183, "732190": 15732190, "7322": 157322, "732211": 15732211, "732219": 15732219, "732290": 15732290, "7323": 157323, "732310": 15732310, "732391": 15732391, "732392": 15732392, "732393": 15732393, "732394": 15732394, "732399": 15732399, "7324": 157324, "732410": 15732410, "732421": 15732421, "732429": 15732429, "732490": 15732490, "7325": 157325, "732510": 15732510, "732591": 15732591, "732599": 15732599, "7326": 157326, "732611": 15732611, "732619": 15732619, "732620": 15732620, "732690": 15732690, "7401": 157401, "740110": 15740110, "740120": 15740120, "7402": 157402, "740200": 15740200, "7403": 157403, "740311": 15740311, "740312": 15740312, "740313": 15740313, "740319": 15740319, "740321": 15740321, "740322": 15740322, "740323": 15740323, "740329": 15740329, "7404": 157404, "740400": 15740400, "7405": 157405, "740500": 15740500, "7406": 157406, "740610": 15740610, "740620": 15740620, "7407": 157407, "740710": 15740710, "740721": 15740721, "740722": 15740722, "740729": 15740729, "7408": 157408, "740811": 15740811, "740819": 15740819, "740821": 15740821, "740822": 15740822, "740829": 15740829, "7409": 157409, "740911": 15740911, "740919": 15740919, "740921": 15740921, "740929": 15740929, "740931": 15740931, "740939": 15740939, "740940": 15740940, "740990": 15740990, "7410": 157410, "741011": 15741011, "741012": 15741012, "741021": 15741021, "741022": 15741022, "7411": 157411, "741110": 15741110, "741121": 15741121, "741122": 15741122, "741129": 15741129, "7412": 157412, "741210": 15741210, "741220": 15741220, "7413": 157413, "741300": 15741300, "7414": 157414, "741410": 15741410, "741490": 15741490, "7415": 157415, "741510": 15741510, "741521": 15741521, "741529": 15741529, "741531": 15741531, "741532": 15741532, "741539": 15741539, "7416": 157416, "741600": 15741600, "7417": 157417, "741700": 15741700, "7418": 157418, "741810": 15741810, "741820": 15741820, "7419": 157419, "741910": 15741910, "741991": 15741991, "741999": 15741999, "7501": 157501, "750110": 15750110, "750120": 15750120, "7502": 157502, "750210": 15750210, "750220": 15750220, "7503": 157503, "750300": 15750300, "7504": 157504, "750400": 15750400, "7505": 157505, "750511": 15750511, "750512": 15750512, "750521": 15750521, "750522": 15750522, "7506": 157506, "750610": 15750610, "750620": 15750620, "7507": 157507, "750711": 15750711, "750712": 15750712, "750720": 15750720, "7508": 157508, "750800": 15750800, "7601": 157601, "760110": 15760110, "760120": 15760120, "7602": 157602, "760200": 15760200, "7603": 157603, "760310": 15760310, "760320": 15760320, "7604": 157604, "760410": 15760410, "760421": 15760421, "760429": 15760429, "7605": 157605, "760511": 15760511, "760519": 15760519, "760521": 15760521, "760529": 15760529, "7606": 157606, "760611": 15760611, "760612": 15760612, "760691": 15760691, "760692": 15760692, "7607": 157607, "760711": 15760711, "760719": 15760719, "760720": 15760720, "7608": 157608, "760810": 15760810, "760820": 15760820, "7609": 157609, "760900": 15760900, "7610": 157610, "761010": 15761010, "761090": 15761090, "7611": 157611, "761100": 15761100, "7612": 157612, "761210": 15761210, "761290": 15761290, "7613": 157613, "761300": 15761300, "7614": 157614, "761410": 15761410, "761490": 15761490, "7615": 157615, "761510": 15761510, "761520": 15761520, "7616": 157616, "761610": 15761610, "761690": 15761690, "7801": 157801, "780110": 15780110, "780191": 15780191, "780199": 15780199, "7802": 157802, "780200": 15780200, "7803": 157803, "780300": 15780300, "7804": 157804, "780411": 15780411, "780419": 15780419, "780420": 15780420, "7805": 157805, "780500": 15780500, "7806": 157806, "780600": 15780600, "7901": 157901, "790111": 15790111, "790112": 15790112, "790120": 15790120, "7902": 157902, "790200": 15790200, "7903": 157903, "790310": 15790310, "790390": 15790390, "7904": 157904, "790400": 15790400, "7905": 157905, "790500": 15790500, "7906": 157906, "790600": 15790600, "7907": 157907, "790710": 15790710, "790790": 15790790, "8001": 158001, "800110": 15800110, "800120": 15800120, "8002": 158002, "800200": 15800200, "8003": 158003, "800300": 15800300, "8004": 158004, "800400": 15800400, "8005": 158005, "800510": 15800510, "800520": 15800520, "8006": 158006, "800600": 15800600, "8007": 158007, "800700": 15800700, "8101": 158101, "810110": 15810110, "810191": 15810191, "810192": 15810192, "810193": 15810193, "810199": 15810199, "8102": 158102, "810210": 15810210, "810291": 15810291, "810292": 15810292, "810293": 15810293, "810299": 15810299, "8103": 158103, "810310": 15810310, "810390": 15810390, "8104": 158104, "810411": 15810411, "810419": 15810419, "810420": 15810420, "810430": 15810430, "810490": 15810490, "8105": 158105, "810510": 15810510, "810590": 15810590, "8106": 158106, "810600": 15810600, "8107": 158107, "810710": 15810710, "810790": 15810790, "8108": 158108, "810810": 15810810, "810890": 15810890, "8109": 158109, "810910": 15810910, "810990": 15810990, "8110": 158110, "811000": 15811000, "8111": 158111, "811100": 15811100, "8112": 158112, "811211": 15811211, "811219": 15811219, "811220": 15811220, "811230": 15811230, "811240": 15811240, "811291": 15811291, "811299": 15811299, "8113": 158113, "811300": 15811300, "8201": 158201, "820110": 15820110, "820120": 15820120, "820130": 15820130, "820140": 15820140, "820150": 15820150, "820160": 15820160, "820190": 15820190, "8202": 158202, "820210": 15820210, "820220": 15820220, "820231": 15820231, "820232": 15820232, "820240": 15820240, "820291": 15820291, "820299": 15820299, "8203": 158203, "820310": 15820310, "820320": 15820320, "820330": 15820330, "820340": 15820340, "8204": 158204, "820411": 15820411, "820412": 15820412, "820420": 15820420, "8205": 158205, "820510": 15820510, "820520": 15820520, "820530": 15820530, "820540": 15820540, "820551": 15820551, "820559": 15820559, "820560": 15820560, "820570": 15820570, "820580": 15820580, "820590": 15820590, "8206": 158206, "820600": 15820600, "8207": 158207, "820711": 15820711, "820712": 15820712, "820720": 15820720, "820730": 15820730, "820740": 15820740, "820750": 15820750, "820760": 15820760, "820770": 15820770, "820780": 15820780, "820790": 15820790, "8208": 158208, "820810": 15820810, "820820": 15820820, "820830": 15820830, "820840": 15820840, "820890": 15820890, "8209": 158209, "820900": 15820900, "8210": 158210, "821000": 15821000, "8211": 158211, "821110": 15821110, "821191": 15821191, "821192": 15821192, "821193": 15821193, "821194": 15821194, "8212": 158212, "821210": 15821210, "821220": 15821220, "821290": 15821290, "8213": 158213, "821300": 15821300, "8214": 158214, "821410": 15821410, "821420": 15821420, "821490": 15821490, "8215": 158215, "821510": 15821510, "821520": 15821520, "821591": 15821591, "821599": 15821599, "8301": 158301, "830110": 15830110, "830120": 15830120, "830130": 15830130, "830140": 15830140, "830150": 15830150, "830160": 15830160, "830170": 15830170, "8302": 158302, "830210": 15830210, "830220": 15830220, "830230": 15830230, "830241": 15830241, "830242": 15830242, "830249": 15830249, "830250": 15830250, "830260": 15830260, "8303": 158303, "830300": 15830300, "8304": 158304, "830400": 15830400, "8305": 158305, "830510": 15830510, "830520": 15830520, "830590": 15830590, "8306": 158306, "830610": 15830610, "830621": 15830621, "830629": 15830629, "830630": 15830630, "8307": 158307, "830710": 15830710, "830790": 15830790, "8308": 158308, "830810": 15830810, "830820": 15830820, "830890": 15830890, "8309": 158309, "830910": 15830910, "830990": 15830990, "8310": 158310, "831000": 15831000, "8311": 158311, "831110": 15831110, "831120": 15831120, "831130": 15831130, "831190": 15831190, "8401": 168401, "840110": 16840110, "840120": 16840120, "840130": 16840130, "840140": 16840140, "8402": 168402, "840211": 16840211, "840212": 16840212, "840219": 16840219, "840220": 16840220, "840290": 16840290, "8403": 168403, "840310": 16840310, "840390": 16840390, "8404": 168404, "840410": 16840410, "840420": 16840420, "840490": 16840490, "8405": 168405, "840510": 16840510, "840590": 16840590, "8406": 168406, "840611": 16840611, "840619": 16840619, "840690": 16840690, "8407": 168407, "840710": 16840710, "840721": 16840721, "840729": 16840729, "840731": 16840731, "840732": 16840732, "840733": 16840733, "840734": 16840734, "840790": 16840790, "8408": 168408, "840810": 16840810, "840820": 16840820, "840890": 16840890, "8409": 168409, "840910": 16840910, "840991": 16840991, "840999": 16840999, "8410": 168410, "841011": 16841011, "841012": 16841012, "841013": 16841013, "841090": 16841090, "8411": 168411, "841111": 16841111, "841112": 16841112, "841121": 16841121, "841122": 16841122, "841181": 16841181, "841182": 16841182, "841191": 16841191, "841199": 16841199, "8412": 168412, "841210": 16841210, "841221": 16841221, "841229": 16841229, "841231": 16841231, "841239": 16841239, "841280": 16841280, "841290": 16841290, "8413": 168413, "841311": 16841311, "841319": 16841319, "841320": 16841320, "841330": 16841330, "841340": 16841340, "841350": 16841350, "841360": 16841360, "841370": 16841370, "841381": 16841381, "841382": 16841382, "841391": 16841391, "841392": 16841392, "8414": 168414, "841410": 16841410, "841420": 16841420, "841430": 16841430, "841440": 16841440, "841451": 16841451, "841459": 16841459, "841460": 16841460, "841480": 16841480, "841490": 16841490, "8415": 168415, "841510": 16841510, "841581": 16841581, "841582": 16841582, "841583": 16841583, "841590": 16841590, "8416": 168416, "841610": 16841610, "841620": 16841620, "841630": 16841630, "841690": 16841690, "8417": 168417, "841710": 16841710, "841720": 16841720, "841780": 16841780, "841790": 16841790, "8418": 168418, "841810": 16841810, "841821": 16841821, "841822": 16841822, "841829": 16841829, "841830": 16841830, "841840": 16841840, "841850": 16841850, "841861": 16841861, "841869": 16841869, "841891": 16841891, "841899": 16841899, "8419": 168419, "841911": 16841911, "841919": 16841919, "841920": 16841920, "841931": 16841931, "841932": 16841932, "841939": 16841939, "841940": 16841940, "841950": 16841950, "841960": 16841960, "841981": 16841981, "841989": 16841989, "841990": 16841990, "8420": 168420, "842010": 16842010, "842091": 16842091, "842099": 16842099, "8421": 168421, "842111": 16842111, "842112": 16842112, "842119": 16842119, "842121": 16842121, "842122": 16842122, "842123": 16842123, "842129": 16842129, "842131": 16842131, "842139": 16842139, "842191": 16842191, "842199": 16842199, "8422": 168422, "842211": 16842211, "842219": 16842219, "842220": 16842220, "842230": 16842230, "842240": 16842240, "842290": 16842290, "8423": 168423, "842310": 16842310, "842320": 16842320, "842330": 16842330, "842381": 16842381, "842382": 16842382, "842389": 16842389, "842390": 16842390, "8424": 168424, "842410": 16842410, "842420": 16842420, "842430": 16842430, "842481": 16842481, "842489": 16842489, "842490": 16842490, "8425": 168425, "842511": 16842511, "842519": 16842519, "842520": 16842520, "842531": 16842531, "842539": 16842539, "842541": 16842541, "842542": 16842542, "842549": 16842549, "8426": 168426, "842611": 16842611, "842612": 16842612, "842619": 16842619, "842620": 16842620, "842630": 16842630, "842641": 16842641, "842649": 16842649, "842691": 16842691, "842699": 16842699, "8427": 168427, "842710": 16842710, "842720": 16842720, "842790": 16842790, "8428": 168428, "842810": 16842810, "842820": 16842820, "842831": 16842831, "842832": 16842832, "842833": 16842833, "842839": 16842839, "842840": 16842840, "842850": 16842850, "842860": 16842860, "842890": 16842890, "8429": 168429, "842911": 16842911, "842919": 16842919, "842920": 16842920, "842930": 16842930, "842940": 16842940, "842951": 16842951, "842952": 16842952, "842959": 16842959, "8430": 168430, "843010": 16843010, "843020": 16843020, "843031": 16843031, "843039": 16843039, "843041": 16843041, "843049": 16843049, "843050": 16843050, "843061": 16843061, "843062": 16843062, "843069": 16843069, "8431": 168431, "843110": 16843110, "843120": 16843120, "843131": 16843131, "843139": 16843139, "843141": 16843141, "843142": 16843142, "843143": 16843143, "843149": 16843149, "8432": 168432, "843210": 16843210, "843221": 16843221, "843229": 16843229, "843230": 16843230, "843240": 16843240, "843280": 16843280, "843290": 16843290, "8433": 168433, "843311": 16843311, "843319": 16843319, "843320": 16843320, "843330": 16843330, "843340": 16843340, "843351": 16843351, "843352": 16843352, "843353": 16843353, "843359": 16843359, "843360": 16843360, "843390": 16843390, "8434": 168434, "843410": 16843410, "843420": 16843420, "843490": 16843490, "8435": 168435, "843510": 16843510, "843590": 16843590, "8436": 168436, "843610": 16843610, "843621": 16843621, "843629": 16843629, "843680": 16843680, "843691": 16843691, "843699": 16843699, "8437": 168437, "843710": 16843710, "843780": 16843780, "843790": 16843790, "8438": 168438, "843810": 16843810, "843820": 16843820, "843830": 16843830, "843840": 16843840, "843850": 16843850, "843860": 16843860, "843880": 16843880, "843890": 16843890, "8439": 168439, "843910": 16843910, "843920": 16843920, "843930": 16843930, "843991": 16843991, "843999": 16843999, "8440": 168440, "844010": 16844010, "844090": 16844090, "8441": 168441, "844110": 16844110, "844120": 16844120, "844130": 16844130, "844140": 16844140, "844180": 16844180, "844190": 16844190, "8442": 168442, "844210": 16844210, "844220": 16844220, "844230": 16844230, "844240": 16844240, "844250": 16844250, "8443": 168443, "844311": 16844311, "844312": 16844312, "844319": 16844319, "844321": 16844321, "844329": 16844329, "844330": 16844330, "844340": 16844340, "844350": 16844350, "844360": 16844360, "844390": 16844390, "8444": 168444, "844400": 16844400, "8445": 168445, "844511": 16844511, "844512": 16844512, "844513": 16844513, "844519": 16844519, "844520": 16844520, "844530": 16844530, "844540": 16844540, "844590": 16844590, "8446": 168446, "844610": 16844610, "844621": 16844621, "844629": 16844629, "844630": 16844630, "8447": 168447, "844711": 16844711, "844712": 16844712, "844720": 16844720, "844790": 16844790, "8448": 168448, "844811": 16844811, "844819": 16844819, "844820": 16844820, "844831": 16844831, "844832": 16844832, "844833": 16844833, "844839": 16844839, "844841": 16844841, "844842": 16844842, "844849": 16844849, "844851": 16844851, "844859": 16844859, "8449": 168449, "844900": 16844900, "8450": 168450, "845011": 16845011, "845012": 16845012, "845019": 16845019, "845020": 16845020, "845090": 16845090, "8451": 168451, "845110": 16845110, "845121": 16845121, "845129": 16845129, "845130": 16845130, "845140": 16845140, "845150": 16845150, "845180": 16845180, "845190": 16845190, "8452": 168452, "845210": 16845210, "845221": 16845221, "845229": 16845229, "845230": 16845230, "845240": 16845240, "845290": 16845290, "8453": 168453, "845310": 16845310, "845320": 16845320, "845380": 16845380, "845390": 16845390, "8454": 168454, "845410": 16845410, "845420": 16845420, "845430": 16845430, "845490": 16845490, "8455": 168455, "845510": 16845510, "845521": 16845521, "845522": 16845522, "845530": 16845530, "845590": 16845590, "8456": 168456, "845610": 16845610, "845620": 16845620, "845630": 16845630, "845690": 16845690, "8457": 168457, "845710": 16845710, "845720": 16845720, "845730": 16845730, "8458": 168458, "845811": 16845811, "845819": 16845819, "845891": 16845891, "845899": 16845899, "8459": 168459, "845910": 16845910, "845921": 16845921, "845929": 16845929, "845931": 16845931, "845939": 16845939, "845940": 16845940, "845951": 16845951, "845959": 16845959, "845961": 16845961, "845969": 16845969, "845970": 16845970, "8460": 168460, "846011": 16846011, "846019": 16846019, "846021": 16846021, "846029": 16846029, "846031": 16846031, "846039": 16846039, "846040": 16846040, "846090": 16846090, "8461": 168461, "846110": 16846110, "846120": 16846120, "846130": 16846130, "846140": 16846140, "846150": 16846150, "846190": 16846190, "8462": 168462, "846210": 16846210, "846221": 16846221, "846229": 16846229, "846231": 16846231, "846239": 16846239, "846241": 16846241, "846249": 16846249, "846291": 16846291, "846299": 16846299, "8463": 168463, "846310": 16846310, "846320": 16846320, "846330": 16846330, "846390": 16846390, "8464": 168464, "846410": 16846410, "846420": 16846420, "846490": 16846490, "8465": 168465, "846510": 16846510, "846591": 16846591, "846592": 16846592, "846593": 16846593, "846594": 16846594, "846595": 16846595, "846596": 16846596, "846599": 16846599, "8466": 168466, "846610": 16846610, "846620": 16846620, "846630": 16846630, "846691": 16846691, "846692": 16846692, "846693": 16846693, "846694": 16846694, "8467": 168467, "846711": 16846711, "846719": 16846719, "846781": 16846781, "846789": 16846789, "846791": 16846791, "846792": 16846792, "846799": 16846799, "8468": 168468, "846810": 16846810, "846820": 16846820, "846880": 16846880, "846890": 16846890, "8469": 168469, "846910": 16846910, "846921": 16846921, "846929": 16846929, "846931": 16846931, "846939": 16846939, "8470": 168470, "847010": 16847010, "847021": 16847021, "847029": 16847029, "847030": 16847030, "847040": 16847040, "847050": 16847050, "847090": 16847090, "8471": 168471, "847110": 16847110, "847120": 16847120, "847191": 16847191, "847192": 16847192, "847193": 16847193, "847199": 16847199, "8472": 168472, "847210": 16847210, "847220": 16847220, "847230": 16847230, "847290": 16847290, "8473": 168473, "847310": 16847310, "847321": 16847321, "847329": 16847329, "847330": 16847330, "847340": 16847340, "8474": 168474, "847410": 16847410, "847420": 16847420, "847431": 16847431, "847432": 16847432, "847439": 16847439, "847480": 16847480, "847490": 16847490, "8475": 168475, "847510": 16847510, "847520": 16847520, "847590": 16847590, "8476": 168476, "847611": 16847611, "847619": 16847619, "847690": 16847690, "8477": 168477, "847710": 16847710, "847720": 16847720, "847730": 16847730, "847740": 16847740, "847751": 16847751, "847759": 16847759, "847780": 16847780, "847790": 16847790, "8478": 168478, "847810": 16847810, "847890": 16847890, "8479": 168479, "847910": 16847910, "847920": 16847920, "847930": 16847930, "847940": 16847940, "847981": 16847981, "847982": 16847982, "847989": 16847989, "847990": 16847990, "8480": 168480, "848010": 16848010, "848020": 16848020, "848030": 16848030, "848041": 16848041, "848049": 16848049, "848050": 16848050, "848060": 16848060, "848071": 16848071, "848079": 16848079, "8481": 168481, "848110": 16848110, "848120": 16848120, "848130": 16848130, "848140": 16848140, "848180": 16848180, "848190": 16848190, "8482": 168482, "848210": 16848210, "848220": 16848220, "848230": 16848230, "848240": 16848240, "848250": 16848250, "848280": 16848280, "848291": 16848291, "848299": 16848299, "8483": 168483, "848310": 16848310, "848320": 16848320, "848330": 16848330, "848340": 16848340, "848350": 16848350, "848360": 16848360, "848390": 16848390, "8484": 168484, "848410": 16848410, "848490": 16848490, "8485": 168485, "848510": 16848510, "848590": 16848590, "8501": 168501, "850110": 16850110, "850120": 16850120, "850131": 16850131, "850132": 16850132, "850133": 16850133, "850134": 16850134, "850140": 16850140, "850151": 16850151, "850152": 16850152, "850153": 16850153, "850161": 16850161, "850162": 16850162, "850163": 16850163, "850164": 16850164, "8502": 168502, "850211": 16850211, "850212": 16850212, "850213": 16850213, "850220": 16850220, "850230": 16850230, "850240": 16850240, "8503": 168503, "850300": 16850300, "8504": 168504, "850410": 16850410, "850421": 16850421, "850422": 16850422, "850423": 16850423, "850431": 16850431, "850432": 16850432, "850433": 16850433, "850434": 16850434, "850440": 16850440, "850450": 16850450, "850490": 16850490, "8505": 168505, "850511": 16850511, "850519": 16850519, "850520": 16850520, "850530": 16850530, "850590": 16850590, "8506": 168506, "850611": 16850611, "850612": 16850612, "850613": 16850613, "850619": 16850619, "850620": 16850620, "850690": 16850690, "8507": 168507, "850710": 16850710, "850720": 16850720, "850730": 16850730, "850740": 16850740, "850780": 16850780, "850790": 16850790, "8508": 168508, "850810": 16850810, "850820": 16850820, "850880": 16850880, "850890": 16850890, "8509": 168509, "850910": 16850910, "850920": 16850920, "850930": 16850930, "850940": 16850940, "850980": 16850980, "850990": 16850990, "8510": 168510, "851010": 16851010, "851020": 16851020, "851090": 16851090, "8511": 168511, "851110": 16851110, "851120": 16851120, "851130": 16851130, "851140": 16851140, "851150": 16851150, "851180": 16851180, "851190": 16851190, "8512": 168512, "851210": 16851210, "851220": 16851220, "851230": 16851230, "851240": 16851240, "851290": 16851290, "8513": 168513, "851310": 16851310, "851390": 16851390, "8514": 168514, "851410": 16851410, "851420": 16851420, "851430": 16851430, "851440": 16851440, "851490": 16851490, "8515": 168515, "851511": 16851511, "851519": 16851519, "851521": 16851521, "851529": 16851529, "851531": 16851531, "851539": 16851539, "851580": 16851580, "851590": 16851590, "8516": 168516, "851610": 16851610, "851621": 16851621, "851629": 16851629, "851631": 16851631, "851632": 16851632, "851633": 16851633, "851640": 16851640, "851650": 16851650, "851660": 16851660, "851671": 16851671, "851672": 16851672, "851679": 16851679, "851680": 16851680, "851690": 16851690, "8517": 168517, "851710": 16851710, "851720": 16851720, "851730": 16851730, "851740": 16851740, "851781": 16851781, "851782": 16851782, "851790": 16851790, "8518": 168518, "851810": 16851810, "851821": 16851821, "851822": 16851822, "851829": 16851829, "851830": 16851830, "851840": 16851840, "851850": 16851850, "851890": 16851890, "8519": 168519, "851910": 16851910, "851921": 16851921, "851929": 16851929, "851931": 16851931, "851939": 16851939, "851940": 16851940, "851991": 16851991, "851999": 16851999, "8520": 168520, "852010": 16852010, "852020": 16852020, "852031": 16852031, "852039": 16852039, "852090": 16852090, "8521": 168521, "852110": 16852110, "852190": 16852190, "8522": 168522, "852210": 16852210, "852290": 16852290, "8523": 168523, "852311": 16852311, "852312": 16852312, "852313": 16852313, "852320": 16852320, "852390": 16852390, "8524": 168524, "852410": 16852410, "852421": 16852421, "852422": 16852422, "852423": 16852423, "852490": 16852490, "8525": 168525, "852510": 16852510, "852520": 16852520, "852530": 16852530, "8526": 168526, "852610": 16852610, "852691": 16852691, "852692": 16852692, "8527": 168527, "852711": 16852711, "852719": 16852719, "852721": 16852721, "852729": 16852729, "852731": 16852731, "852732": 16852732, "852739": 16852739, "852790": 16852790, "8528": 168528, "852810": 16852810, "852820": 16852820, "8529": 168529, "852910": 16852910, "852990": 16852990, "8530": 168530, "853010": 16853010, "853080": 16853080, "853090": 16853090, "8531": 168531, "853110": 16853110, "853120": 16853120, "853180": 16853180, "853190": 16853190, "8532": 168532, "853210": 16853210, "853221": 16853221, "853222": 16853222, "853223": 16853223, "853224": 16853224, "853225": 16853225, "853229": 16853229, "853230": 16853230, "853290": 16853290, "8533": 168533, "853310": 16853310, "853321": 16853321, "853329": 16853329, "853331": 16853331, "853339": 16853339, "853340": 16853340, "853390": 16853390, "8534": 168534, "853400": 16853400, "8535": 168535, "853510": 16853510, "853521": 16853521, "853529": 16853529, "853530": 16853530, "853540": 16853540, "853590": 16853590, "8536": 168536, "853610": 16853610, "853620": 16853620, "853630": 16853630, "853641": 16853641, "853649": 16853649, "853650": 16853650, "853661": 16853661, "853669": 16853669, "853690": 16853690, "8537": 168537, "853710": 16853710, "853720": 16853720, "8538": 168538, "853810": 16853810, "853890": 16853890, "8539": 168539, "853910": 16853910, "853921": 16853921, "853922": 16853922, "853929": 16853929, "853931": 16853931, "853939": 16853939, "853940": 16853940, "853990": 16853990, "8540": 168540, "854011": 16854011, "854012": 16854012, "854020": 16854020, "854030": 16854030, "854041": 16854041, "854042": 16854042, "854049": 16854049, "854081": 16854081, "854089": 16854089, "854091": 16854091, "854099": 16854099, "8541": 168541, "854110": 16854110, "854121": 16854121, "854129": 16854129, "854130": 16854130, "854140": 16854140, "854150": 16854150, "854160": 16854160, "854190": 16854190, "8542": 168542, "854211": 16854211, "854219": 16854219, "854220": 16854220, "854280": 16854280, "854290": 16854290, "8543": 168543, "854310": 16854310, "854320": 16854320, "854330": 16854330, "854380": 16854380, "854390": 16854390, "8544": 168544, "854411": 16854411, "854419": 16854419, "854420": 16854420, "854430": 16854430, "854441": 16854441, "854449": 16854449, "854451": 16854451, "854459": 16854459, "854460": 16854460, "854470": 16854470, "8545": 168545, "854511": 16854511, "854519": 16854519, "854520": 16854520, "854590": 16854590, "8546": 168546, "854610": 16854610, "854620": 16854620, "854690": 16854690, "8547": 168547, "854710": 16854710, "854720": 16854720, "854790": 16854790, "8548": 168548, "854800": 16854800, "8601": 178601, "860110": 17860110, "860120": 17860120, "8602": 178602, "860210": 17860210, "860290": 17860290, "8603": 178603, "860310": 17860310, "860390": 17860390, "8604": 178604, "860400": 17860400, "8605": 178605, "860500": 17860500, "8606": 178606, "860610": 17860610, "860620": 17860620, "860630": 17860630, "860691": 17860691, "860692": 17860692, "860699": 17860699, "8607": 178607, "860711": 17860711, "860712": 17860712, "860719": 17860719, "860721": 17860721, "860729": 17860729, "860730": 17860730, "860791": 17860791, "860799": 17860799, "8608": 178608, "860800": 17860800, "8609": 178609, "860900": 17860900, "8701": 178701, "870110": 17870110, "870120": 17870120, "870130": 17870130, "870190": 17870190, "8702": 178702, "870210": 17870210, "870290": 17870290, "8703": 178703, "870310": 17870310, "870321": 17870321, "870322": 17870322, "870323": 17870323, "870324": 17870324, "870331": 17870331, "870332": 17870332, "870333": 17870333, "870390": 17870390, "8704": 178704, "870410": 17870410, "870421": 17870421, "870422": 17870422, "870423": 17870423, "870431": 17870431, "870432": 17870432, "870490": 17870490, "8705": 178705, "870510": 17870510, "870520": 17870520, "870530": 17870530, "870540": 17870540, "870590": 17870590, "8706": 178706, "870600": 17870600, "8707": 178707, "870710": 17870710, "870790": 17870790, "8708": 178708, "870810": 17870810, "870821": 17870821, "870829": 17870829, "870831": 17870831, "870839": 17870839, "870840": 17870840, "870850": 17870850, "870860": 17870860, "870870": 17870870, "870880": 17870880, "870891": 17870891, "870892": 17870892, "870893": 17870893, "870894": 17870894, "870899": 17870899, "8709": 178709, "870911": 17870911, "870919": 17870919, "870990": 17870990, "8710": 178710, "871000": 17871000, "8711": 178711, "871110": 17871110, "871120": 17871120, "871130": 17871130, "871140": 17871140, "871150": 17871150, "871190": 17871190, "8712": 178712, "871200": 17871200, "8713": 178713, "871310": 17871310, "871390": 17871390, "8714": 178714, "871411": 17871411, "871419": 17871419, "871420": 17871420, "871491": 17871491, "871492": 17871492, "871493": 17871493, "871494": 17871494, "871495": 17871495, "871496": 17871496, "871499": 17871499, "8715": 178715, "871500": 17871500, "8716": 178716, "871610": 17871610, "871620": 17871620, "871631": 17871631, "871639": 17871639, "871640": 17871640, "871680": 17871680, "871690": 17871690, "8801": 178801, "880110": 17880110, "880190": 17880190, "8802": 178802, "880211": 17880211, "880212": 17880212, "880220": 17880220, "880230": 17880230, "880240": 17880240, "880250": 17880250, "8803": 178803, "880310": 17880310, "880320": 17880320, "880330": 17880330, "880390": 17880390, "8804": 178804, "880400": 17880400, "8805": 178805, "880510": 17880510, "880520": 17880520, "8901": 178901, "890110": 17890110, "890120": 17890120, "890130": 17890130, "890190": 17890190, "8902": 178902, "890200": 17890200, "8903": 178903, "890310": 17890310, "890391": 17890391, "890392": 17890392, "890399": 17890399, "8904": 178904, "890400": 17890400, "8905": 178905, "890510": 17890510, "890520": 17890520, "890590": 17890590, "8906": 178906, "890600": 17890600, "8907": 178907, "890710": 17890710, "890790": 17890790, "8908": 178908, "890800": 17890800, "9001": 189001, "900110": 18900110, "900120": 18900120, "900130": 18900130, "900140": 18900140, "900150": 18900150, "900190": 18900190, "9002": 189002, "900211": 18900211, "900219": 18900219, "900220": 18900220, "900290": 18900290, "9003": 189003, "900311": 18900311, "900319": 18900319, "900390": 18900390, "9004": 189004, "900410": 18900410, "900490": 18900490, "9005": 189005, "900510": 18900510, "900580": 18900580, "900590": 18900590, "9006": 189006, "900610": 18900610, "900620": 18900620, "900630": 18900630, "900640": 18900640, "900651": 18900651, "900652": 18900652, "900653": 18900653, "900659": 18900659, "900661": 18900661, "900662": 18900662, "900669": 18900669, "900691": 18900691, "900699": 18900699, "9007": 189007, "900711": 18900711, "900719": 18900719, "900721": 18900721, "900729": 18900729, "900791": 18900791, "900792": 18900792, "9008": 189008, "900810": 18900810, "900820": 18900820, "900830": 18900830, "900840": 18900840, "900890": 18900890, "9009": 189009, "900911": 18900911, "900912": 18900912, "900921": 18900921, "900922": 18900922, "900930": 18900930, "900990": 18900990, "9010": 189010, "901010": 18901010, "901020": 18901020, "901030": 18901030, "901090": 18901090, "9011": 189011, "901110": 18901110, "901120": 18901120, "901180": 18901180, "901190": 18901190, "9012": 189012, "901210": 18901210, "901290": 18901290, "9013": 189013, "901310": 18901310, "901320": 18901320, "901380": 18901380, "901390": 18901390, "9014": 189014, "901410": 18901410, "901420": 18901420, "901480": 18901480, "901490": 18901490, "9015": 189015, "901510": 18901510, "901520": 18901520, "901530": 18901530, "901540": 18901540, "901580": 18901580, "901590": 18901590, "9016": 189016, "901600": 18901600, "9017": 189017, "901710": 18901710, "901720": 18901720, "901730": 18901730, "901780": 18901780, "901790": 18901790, "9018": 189018, "901811": 18901811, "901819": 18901819, "901820": 18901820, "901831": 18901831, "901832": 18901832, "901839": 18901839, "901841": 18901841, "901849": 18901849, "901850": 18901850, "901890": 18901890, "9019": 189019, "901910": 18901910, "901920": 18901920, "9020": 189020, "902000": 18902000, "9021": 189021, "902111": 18902111, "902119": 18902119, "902121": 18902121, "902129": 18902129, "902130": 18902130, "902140": 18902140, "902150": 18902150, "902190": 18902190, "9022": 189022, "902211": 18902211, "902219": 18902219, "902221": 18902221, "902229": 18902229, "902230": 18902230, "902290": 18902290, "9023": 189023, "902300": 18902300, "9024": 189024, "902410": 18902410, "902480": 18902480, "902490": 18902490, "9025": 189025, "902511": 18902511, "902519": 18902519, "902520": 18902520, "902580": 18902580, "902590": 18902590, "9026": 189026, "902610": 18902610, "902620": 18902620, "902680": 18902680, "902690": 18902690, "9027": 189027, "902710": 18902710, "902720": 18902720, "902730": 18902730, "902740": 18902740, "902750": 18902750, "902780": 18902780, "902790": 18902790, "9028": 189028, "902810": 18902810, "902820": 18902820, "902830": 18902830, "902890": 18902890, "9029": 189029, "902910": 18902910, "902920": 18902920, "902990": 18902990, "9030": 189030, "903010": 18903010, "903020": 18903020, "903031": 18903031, "903039": 18903039, "903040": 18903040, "903081": 18903081, "903089": 18903089, "903090": 18903090, "9031": 189031, "903110": 18903110, "903120": 18903120, "903130": 18903130, "903140": 18903140, "903180": 18903180, "903190": 18903190, "9032": 189032, "903210": 18903210, "903220": 18903220, "903281": 18903281, "903289": 18903289, "903290": 18903290, "9033": 189033, "903300": 18903300, "9101": 189101, "910111": 18910111, "910112": 18910112, "910119": 18910119, "910121": 18910121, "910129": 18910129, "910191": 18910191, "910199": 18910199, "9102": 189102, "910211": 18910211, "910212": 18910212, "910219": 18910219, "910221": 18910221, "910229": 18910229, "910291": 18910291, "910299": 18910299, "9103": 189103, "910310": 18910310, "910390": 18910390, "9104": 189104, "910400": 18910400, "9105": 189105, "910511": 18910511, "910519": 18910519, "910521": 18910521, "910529": 18910529, "910591": 18910591, "910599": 18910599, "9106": 189106, "910610": 18910610, "910620": 18910620, "910690": 18910690, "9107": 189107, "910700": 18910700, "9108": 189108, "910811": 18910811, "910812": 18910812, "910819": 18910819, "910820": 18910820, "910891": 18910891, "910899": 18910899, "9109": 189109, "910911": 18910911, "910919": 18910919, "910990": 18910990, "9110": 189110, "911011": 18911011, "911012": 18911012, "911019": 18911019, "911090": 18911090, "9111": 189111, "911110": 18911110, "911120": 18911120, "911180": 18911180, "911190": 18911190, "9112": 189112, "911210": 18911210, "911280": 18911280, "911290": 18911290, "9113": 189113, "911310": 18911310, "911320": 18911320, "911390": 18911390, "9114": 189114, "911410": 18911410, "911420": 18911420, "911430": 18911430, "911440": 18911440, "911490": 18911490, "9201": 189201, "920110": 18920110, "920120": 18920120, "920190": 18920190, "9202": 189202, "920210": 18920210, "920290": 18920290, "9203": 189203, "920300": 18920300, "9204": 189204, "920410": 18920410, "920420": 18920420, "9205": 189205, "920510": 18920510, "920590": 18920590, "9206": 189206, "920600": 18920600, "9207": 189207, "920710": 18920710, "920790": 18920790, "9208": 189208, "920810": 18920810, "920890": 18920890, "9209": 189209, "920910": 18920910, "920920": 18920920, "920930": 18920930, "920991": 18920991, "920992": 18920992, "920993": 18920993, "920994": 18920994, "920999": 18920999, "9301": 199301, "930100": 19930100, "9302": 199302, "930200": 19930200, "9303": 199303, "930310": 19930310, "930320": 19930320, "930330": 19930330, "930390": 19930390, "9304": 199304, "930400": 19930400, "9305": 199305, "930510": 19930510, "930521": 19930521, "930529": 19930529, "930590": 19930590, "9306": 199306, "930610": 19930610, "930621": 19930621, "930629": 19930629, "930630": 19930630, "930690": 19930690, "9307": 199307, "930700": 19930700, "9401": 209401, "940110": 20940110, "940120": 20940120, "940130": 20940130, "940140": 20940140, "940150": 20940150, "940161": 20940161, "940169": 20940169, "940171": 20940171, "940179": 20940179, "940180": 20940180, "940190": 20940190, "9402": 209402, "940210": 20940210, "940290": 20940290, "9403": 209403, "940310": 20940310, "940320": 20940320, "940330": 20940330, "940340": 20940340, "940350": 20940350, "940360": 20940360, "940370": 20940370, "940380": 20940380, "940390": 20940390, "9404": 209404, "940410": 20940410, "940421": 20940421, "940429": 20940429, "940430": 20940430, "940490": 20940490, "9405": 209405, "940510": 20940510, "940520": 20940520, "940530": 20940530, "940540": 20940540, "940550": 20940550, "940560": 20940560, "940591": 20940591, "940592": 20940592, "940599": 20940599, "9406": 209406, "940600": 20940600, "9501": 209501, "950100": 20950100, "9502": 209502, "950210": 20950210, "950291": 20950291, "950299": 20950299, "9503": 209503, "950310": 20950310, "950320": 20950320, "950330": 20950330, "950341": 20950341, "950349": 20950349, "950350": 20950350, "950360": 20950360, "950370": 20950370, "950380": 20950380, "950390": 20950390, "9504": 209504, "950410": 20950410, "950420": 20950420, "950430": 20950430, "950440": 20950440, "950490": 20950490, "9505": 209505, "950510": 20950510, "950590": 20950590, "9506": 209506, "950611": 20950611, "950612": 20950612, "950619": 20950619, "950621": 20950621, "950629": 20950629, "950631": 20950631, "950632": 20950632, "950639": 20950639, "950640": 20950640, "950651": 20950651, "950659": 20950659, "950661": 20950661, "950662": 20950662, "950669": 20950669, "950670": 20950670, "950691": 20950691, "950699": 20950699, "9507": 209507, "950710": 20950710, "950720": 20950720, "950730": 20950730, "950790": 20950790, "9508": 209508, "950800": 20950800, "9601": 209601, "960110": 20960110, "960190": 20960190, "9602": 209602, "960200": 20960200, "9603": 209603, "960310": 20960310, "960321": 20960321, "960329": 20960329, "960330": 20960330, "960340": 20960340, "960350": 20960350, "960390": 20960390, "9604": 209604, "960400": 20960400, "9605": 209605, "960500": 20960500, "9606": 209606, "960610": 20960610, "960621": 20960621, "960622": 20960622, "960629": 20960629, "960630": 20960630, "9607": 209607, "960711": 20960711, "960719": 20960719, "960720": 20960720, "9608": 209608, "960810": 20960810, "960820": 20960820, "960831": 20960831, "960839": 20960839, "960840": 20960840, "960850": 20960850, "960860": 20960860, "960891": 20960891, "960899": 20960899, "9609": 209609, "960910": 20960910, "960920": 20960920, "960990": 20960990, "9610": 209610, "961000": 20961000, "9611": 209611, "961100": 20961100, "9612": 209612, "961210": 20961210, "961220": 20961220, "9613": 209613, "961310": 20961310, "961320": 20961320, "961330": 20961330, "961380": 20961380, "961390": 20961390, "9614": 209614, "961410": 20961410, "961420": 20961420, "961490": 20961490, "9615": 209615, "961511": 20961511, "961519": 20961519, "961590": 20961590, "9616": 209616, "961610": 20961610, "961620": 20961620, "9617": 209617, "961700": 20961700, "9618": 209618, "961800": 20961800, "9701": 219701, "970110": 21970110, "970190": 21970190, "9702": 219702, "970200": 21970200, "9703": 219703, "970300": 21970300, "9704": 219704, "970400": 21970400, "9705": 219705, "970500": 21970500, "9706": 219706, "970600": 21970600, "9999": 229999, "999999": 22999999, "9999AA": 229999}
};
