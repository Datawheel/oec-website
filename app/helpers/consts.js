const locale = "en";

module.exports = {
  NAV: [
    // profiles
    {title: "Profiles", items: [
      {title: "Location", items: [
        {title: "Country",            url: `/${locale}/profile/country/`},
        {title: "Subnational",        url: `/${locale}/profile/subnational/`, pro: true},
        {title: "Country to country", url: `/${locale}/profile/partner/`},
        {title: "Product in country", url: `/${locale}/profile/country/pry/hs92/2120100`}
      ]},
      {title: "Product", items: [
        {title: "Product",            url: `/${locale}/profile/hs92/`},
        {title: "Product in country", url: `/${locale}/profile/country/pry/hs92/2120100`}
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
  ]
};
