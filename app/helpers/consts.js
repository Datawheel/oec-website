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
      {title: "Tree map",     url: `/${locale}/visualizations/tree-map`,  icon: "visualizations/tree-map"},
      {title: "Stacked area", url: `/${locale}/visualizations/stacked`,   icon: "visualizations/stacked"},
      {title: "Line chart",   url: `/${locale}/visualizations/line`,      icon: "visualizations/line"},
      {title: "Network",      url: `/${locale}/visualizations/network`,   icon: "visualizations/network"},
      {title: "Ring",         url: `/${locale}/visualizations/ring`,      icon: "visualizations/ring"},
      {title: "Scatter plot", url: `/${locale}/visualizations/scatter`,   icon: "visualizations/scatter"},
      {title: "Geo map",      url: `/${locale}/visualizations/geo-map`,   icon: "visualizations/geo-map"}
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
    ]}
  ],
  SUBNATIONAL_COUNTRIES: [
    {
      name: "Brazil",
      code: "bra",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "States", level: "Region", slug: "states"},
        {name: "Municipalities", level: "Subnat Geography", slug: "municipalities"}
      ]
    },
    {
      name: "Japan",
      code: "jpn",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Regions", level: "Area", slug: "regions"},
        {name: "Prefectures", level: "Subnat Geography", slug: "prefectures"}
      ]
    },
    {
      name: "Russia",
      code: "rus",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Districts", level: "District", slug: "districts"},
        {name: "Regions", level: "Subnat Geography", slug: "regions"}
      ]
    },
    {
      name: "Canadá",
      code: "can",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Provinces", level: "Subnat Geography", slug: "provinces"}
      ]
    },
    {
      name: "Uruguay",
      code: "ury",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "Corridor", level: "Corridor", slug: "corridors"},
        {name: "Departments", level: "Subnat Geography", slug: "departments"}
      ]
    }
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
