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
      {title: "Country rankings", url: `/${locale}/rankings/country/eci`},
      {title: "Product rankings", url: `/${locale}/rankings/product/sitc`}
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
        {name: "Districts", level: "District", slug: "districts"},
        {name: "Regions", level: "Subnat Geography", slug: "regions"}
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
        {name: "States", level: "State", slug: "states", ignoreIds: ["04000US02", "04000US15", "04000US60", "04000US69", "04000US66"]},
        {name: "District", level: "Subnat Geography", slug: "districts", ignoreIds: []}
      ]
    }
    // TODO: CHL, ECU, FRA, TUR
    // TBD: ZAF -> ports, take a look , SWE -> no units, ignore it.
  ]
};
