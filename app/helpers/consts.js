const toHS = require("helpers/funcs.js").toHS;
const colors = require("helpers/colors.js");
const locale = "en";

module.exports = {
  NAV: [
    // profiles
    {title: "Profiles", items: [
      {title: "Location", items: [
        {title: "Country",            url: `/${locale}/profile/country/`},
        {title: "Subnational",        url: `/${locale}/subnational/`, pro: true},
        {title: "Country to country", url: `/${locale}/profile/bilateral-country/`, pro: true},
        {title: "Product in country", url: `/${locale}/profile/bilateral-product/`, pro: true}
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
    // about
    {title: "About", items: [
      {title: "About OEC",    url: `/${locale}/about/`},
      {title: "OEC Pro",      url: `/${locale}/about#oec-pro`},
      {title: "FAQ",          url: `/${locale}/about#faq`},
      {title: "Publications", url: `/${locale}/about#publications`}
    ]},
    // data
    {title: "Data", items: [
      {title: "The data",     url: `/${locale}/data/`},
      {title: "Methodology",  url: `/${locale}/data#methodology`},
      {title: "Permissions",  url: `/${locale}/data#permissions`},
      {title: "API",          url: `/${locale}/data#api`}
    ]},
    // rankings
    {title: "Rankings", items: [
      {title: "Country rankings", url: `/${locale}/rankings/country/eci/`},
      {title: "Product rankings", url: `/${locale}/rankings/product/hs92/`}
    ]},
    // predictions
    {title: "Predictions", items: [
      {title: "World Trade Predictions (annual)", url: `/${locale}/prediction?dataset=trade-annual`},
      {title: "World Trade Predictions (monthly)", url: `/${locale}/prediction?dataset=trade-monthly`}
    ]}
  ],
  SUBNATIONAL_COUNTRIES: [
    {
      name: "Brazil",
      code: "bra",
      cube: "trade_s_bra_mun_m_hs",
      dimension: "Subnat Geography",
      limit: 7000,
      geoLevels: [
        {name: "Region", level: "Region", slug: "regions"},
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
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
      ]
    },
    {
      name: "Uruguay",
      code: "ury",
      cube: "trade_s_ury_a_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Corridor", level: "Corridor", slug: "corridors"},
        {name: "Departments", level: "Subnat Geography", slug: "departments"}
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
            projection: "geoAlbersUsa"
          }
        },
        {
          name: "Districts",
          level: "Subnat Geography",
          slug: "districts",
          extraMapConfig: {
            projection: "geoAlbersUsa"
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
        {name: "Autonomous Communities", level: "Autonomous Communities", slug: "autonomous"},
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
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
    }
    // TODO: CHL, ECU, FRA
    // TBD: ZAF -> ports, take a look , SWE -> no units, ignore it.
  ],

  PREDICTION_DATASETS: [
    {
      name: "Trade (annual)",
      slug: "trade-annual",
      cube: "trade_i_baci_a_92",
      selectionsLoaded: false,
      dateDrilldown: "Year",
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
      name: "Trade (monthly)",
      slug: "trade-monthly",
      cube: "trade_i_comtrade_m_hs",
      selectionsLoaded: false,
      dateDrilldown: "Time",
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
    }
  ]
};
