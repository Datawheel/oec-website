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
        {name: "Region", level: "Region", slug: "regions"},
        {name: "States", level: "State", slug: "states"},
        {name: "Municipalities", level: "Subnat Geography", slug: "municipalities"}
      ]
    }/* ,
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
        {name: "Districts", level: "District", slug: "districts"},
        {name: "Regions", level: "Subnat Geography", slug: "regions"}
      ]
    },
    {
      name: "Canadá",
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
        {name: "States", level: "State", slug: "states", ignoreIds: ["04000US02"]},
        {name: "District", level: "Subnat Geography", slug: "districts", ignoreIds: []}
      ]
    }*/
    // TODO: chile +  ecuador.
    // ZAF -> ports, take a look.
    // SWE -> no units, ignore it.
  ],
  SUBNATIONAL: [
    {title: "Brazil", items: [
      {title: "States", items: [
        {title: "São Paulo", url: `/${locale}/profile/subnational_bra/sao-paulo`, pro: true},
        {title: "Rio de Janeiro", url: `/${locale}/profile/subnational_bra/rio-de-janeiro`, pro: true},
        {title: "Minas Gerais", url: `/${locale}/profile/subnational_bra/minas-gerais`, pro: true},
        {title: "Rio Grande do Sul", url: `/${locale}/profile/subnational_bra/rio-grande-do-sul`, pro: true},
        {title: "Paraná", url: `/${locale}/profile/subnational_bra/parana`, pro: true}
      ]},
      {title: "Municipalities", items: [
        {title: "Rio de Janeiro, Rio de Janeiro", url: `/${locale}/profile/subnational_bra/rio-de-janeiro-3304557`, pro: true},
        {title: "São Paulo, São Paulo", url: `/${locale}/profile/subnational_bra/sao-paulo-3450308`, pro: true},
        {title: "Parauapebas, Pará", url: `/${locale}/profile/subnational_bra/parauapebas`, pro: true},
        {title: "Angra dos Reis, Rio de Janeiro", url: `/${locale}/profile/subnational_bra/angra-dos-reis`, pro: true},
        {title: "Duque de Caxias, Rio de Janeiro", url: `/${locale}/profile/subnational_bra/duque-de-caxias`, pro: true}
      ]}
    ]},
    {title: "Japan", items: [
      {title: "Region", items: [
        {title: "Kanto", url: `/${locale}/profile/subnational_jpn/kanto`, pro: true},
        {title: "Kinki", url: `/${locale}/profile/subnational_jpn/kinki`, pro: true},
        {title: "Chubu", url: `/${locale}/profile/subnational_jpn/chubu`, pro: true},
        {title: "Kyusyu", url: `/${locale}/profile/subnational_jpn/kyusyu`, pro: true},
        {title: "Chugoku", url: `/${locale}/profile/subnational_jpn/chugoku`, pro: true}
      ]},
      {title: "Prefecture", items: [
        {title: "Chiba, Kanto", url: `/${locale}/profile/subnational_jpn/chiba`, pro: true},
        {title: "Aichi, Chubu", url: `/${locale}/profile/subnational_jpn/aichi`, pro: true},
        {title: "Osaka, Kinki", url: `/${locale}/profile/subnational_jpn/osaka`, pro: true},
        {title: "Tokyo, Kanto", url: `/${locale}/profile/subnational_jpn/tokyo`, pro: true},
        {title: "Kanagawa, Kanto", url: `/${locale}/profile/subnational_jpn/kanagawa`, pro: true}
      ]}
    ]},
    {title: "Russia", items: [
      {title: "Districts", items: [
        {title: "Central", url: `/${locale}/profile/subnational_rus/central-federal-district`, pro: true},
        {title: "North West", url: `/${locale}/profile/subnational_rus/north-west-federal-district`, pro: true},
        {title: "Southern", url: `/${locale}/profile/subnational_rus/southern-federal-district`, pro: true},
        {title: "Volga", url: `/${locale}/profile/subnational_rus/volga-federal-district`, pro: true},
        {title: "Urals", url: `/${locale}/profile/subnational_rus/urals-federal-district`, pro: true}
      ]},
      {title: "Regions", items: [
        {title: "Moscow (Capital)", url: `/${locale}/profile/subnational_rus/moscow-the-capital-of-russian-federation`, pro: true},
        {title: "St Petersburg", url: `/${locale}/profile/subnational_rus/st-petersburg`, pro: true},
        {title: "Moscow Region", url: `/${locale}/profile/subnational_rus/moscow-region`, pro: true},
        {title: "Republic of Tatarstan", url: `/${locale}/profile/subnational_rus/republic-of-tatarstan`, pro: true},
        {title: "Khanty-Mansi Autonomous Area", url: `/${locale}/profile/subnational_rus/khanty-mansiysk-autonomous-area`, pro: true}
      ]}
    ]}
  ]
};
