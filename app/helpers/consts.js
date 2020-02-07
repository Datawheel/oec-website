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
        {name: "Region", level: "Region", slug: "regions", ignoreIds: []},
        {name: "States", level: "State", slug: "states", ignoreIds: []},
        {name: "Municipalities", level: "Subnat Geography", slug: "municipalities", ignoreIds: []}
      ]
    },
    {
      name: "Japan",
      code: "jpn",
      cube: "trade_s_jpn_m_hs",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Area", slug: "regions", ignoreIds: []},
        {name: "Prefectures", level: "Subnat Geography", slug: "prefectures", ignoreIds: []}
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
          ignoreIds: [
            "04000US02", "04000US15", "04000US60",
            "04000US69", "04000US66"
          ]
        },
        {
          name: "District",
          level: "Subnat Geography",
          slug: "districts",
          ignoreIds: [
            "05000US02016", "05000US66010", "05000US69100",
            "05000US69120", "05000US69110", "05000US69085",
            "05000US60010", "05000US60050", "05000US60020",
            "05000US15001", "05000US15009", "05000US15009",
            "05000US15007", "05000US15005", "05000US02185",
            "05000US02290", "05000US02188", "05000US02180",
            "05000US02158", "05000US02050", "05000US02090",
            "05000US02068", "05000US02240", "05000US02261",
            "05000US02282", "05000US02105", "05000US02220",
            "05000US02110", "05000US02195", "05000US02198",
            "05000US02130", "05000US02275", "05000US02100",
            "05000US02230", "05000US02170", "05000US02164",
            "05000US02188", "05000US02013", "05000US02016",
            "05000US02070", "05000US02060", "05000US02122",
            "05000US02020", "05000US02150", "05000US15003"
          ]
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
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
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
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_comtrade_m_hs&Year=2017&drilldowns=Reporter+Country&measures=Trade+Value&parents=true&sparse=false&properties=Reporter+Country+ISO+3",
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
          dataUrl: "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_comtrade_m_hs&Year=2017&drilldowns=Partner+Country&measures=Trade+Value&parents=true&sparse=false&properties=Partner+Country+ISO+3",
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
