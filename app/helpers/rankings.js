const locale = "en";

module.exports = {
  PAGE: [
    {
      country: {
        title: "Economic Complexity Rankings (ECI)",
        text: [
          `The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product. ECI measures the knowledge intensity of an economy by considering the knowledge intensity of the products it exports. PCI measures the knowledge intensity of a product by considering the knowledge intensity of its exporters. This circular argument is mathematically tractable and can be used to construct relative measures of the knowledge intensity of economies and products (see <a href=${"/en/resources/methodology/"} class=link>methodology section</a> for more details).`,
          `ECI has been validated as a relevant economic measure by showing its ability to predict future economic growth (see <a href=${"https://oec.world/en/rankings/country/eci/?download=true"} class=link>Hidalgo and Hausmann 2009</a>), and explain international variations in income inequality (see <a href=${"/oec.world/static/pdf/LinkingEconomicComplexityInstitutionsAndIncomeInequality.pdf"} class=link>Hartmann et al. 2017</a>).`,
          "This page includes rankings using the Economic Complexity Index (ECI)."
        ]
      },
      product: {
        title: "Product Complexity Rankings (PCI)",
        text: [
          `The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product. ECI measures the knowledge intensity of an economy by considering the knowledge intensity of the products it exports. PCI measures the knowledge intensity of a product by considering the knowledge intensity of its exporters. This circular argument is mathematically tractable and can be used to construct relative measures of the knowledge intensity of economies and products (see <a href=${"/en/resources/methodology/"} class=link>methodology section</a> for more details).`,
          `ECI has been validated as a relevant economic measure by showing its ability to predict future economic growth (see <a href=${"https://oec.world/en/rankings/country/eci/?download=true"} class=link>Hidalgo and Hausmann 2009</a>), and explain international variations in income inequality (see <a href=${"/oec.world/static/pdf/LinkingEconomicComplexityInstitutionsAndIncomeInequality.pdf"} class=link>Hartmann et al. 2017</a>).`,
          "This page includes rankings using the Economic Complexity Index (ECI)."
        ]
      }
    }
  ],
  CATEGORY_BUTTONS: [
    {
      display: "Country",
      value: "country",
      href: `/${locale}/rankings/country/eci/`
    },
    {
      display: "Product",
      value: "product",
      href: `/${locale}/rankings/product/hs92/`
    }
  ],
  PRODUCT_BUTTONS: [
    {
      display: "HS 92",
      value: "hs92",
      href: `/${locale}/rankings/product/hs92/`
    },
    {
      display: "HS 96",
      value: "hs96",
      href: `/${locale}/rankings/product/hs96/`
    },
    {
      display: "HS 02",
      value: "hs02",
      href: `/${locale}/rankings/product/hs02/`
    },
    {
      display: "HS 07",
      value: "hs07",
      href: `/${locale}/rankings/product/hs07/`
    }
  ],
  FILTER_YEARS: {
    eci: ["1968-1972", "1973-1977", "1978-1982", "1983-1987", "1988-1992", "1993-1997", "1998-2002", "2003-2007", "2008-2012", "2013-2017"],
    hs92: ["1995-1999", "2000-2005", "2006-2011", "2012-2017"],
    hs96: ["1998-2002", "2003-2007", "2008-2012", "2013-2017"],
    hs02: ["2003-2007", "2008-2012", "2013-2017"],
    hs07: ["2008-2012", "2013-2017"]
  },
  DOWNLOAD_BUTTONS: [
    ["Download", {country: "https://oec.world/en/rankings/country/eci/?download=true", product: "https://oec.world/en/rankings/product/sitc/?download=true"}],
    ["Download All Years", {country: "https://oec.world/en/rankings/country/eci/?download=true&download_all=true", product: "https://oec.world/en/rankings/product/sitc/?download=true&download_all=true"}]
  ]
};
