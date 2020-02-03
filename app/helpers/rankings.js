module.exports = {
  PAGE: [
    {
      country: {
        title: "Economic Complexity Rankings (ECI)",
        text: [
          "The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product. ECI measures the knowledge intensity of an economy by considering the knowledge intensity of the products it exports. PCI measures the knowledge intensity of a product by considering the knowledge intensity of its exporters. This circular argument is mathematically tractable and can be used to construct relative measures of the knowledge intensity of economies and products (see <a href={/en/resources/methodology/} class=link>methodology section</a> for more details).",
          "ECI has been validated as a relevant economic measure by showing its ability to predict future economic growth (see <a href=www.pnas.org/content/106/26/10570 class=link>Hidalgo and Hausmann 2009</a>), and explain international variations in income inequality (see <a href= class=link>Hartmann et al. 2017</a>).",
          "This page includes rankings using the Economic Complexity Index (ECI)."
        ]
      },
      product: {
        title: "Product Complexity Rankings (PCI)",
        text: [
          "The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product. ECI measures the knowledge intensity of an economy by considering the knowledge intensity of the products it exports. PCI measures the knowledge intensity of a product by considering the knowledge intensity of its exporters. This circular argument is mathematically tractable and can be used to construct relative measures of the knowledge intensity of economies and products (see <a href={/en/resources/methodology/} class=link>methodology section</a> for more details).",
          "ECI has been validated as a relevant economic measure by showing its ability to predict future economic growth (see <a href=www.pnas.org/content/106/26/10570 class=link>Hidalgo and Hausmann 2009</a>), and explain international variations in income inequality (see <a href= class=link>Hartmann et al. 2017</a>).",
          "This page includes rankings using the Economic Complexity Index (ECI)."
        ]
      }
    }
  ],
  FILTER_CATEGORY: [
    ["Country", "country", "eci"],
    ["Product", "product", "hs92"]
  ],
  FILTER_PRODUCT: [
    ["HS 92", "hs92"],
    ["HS 96", "hs96"],
    ["HS 02", "hs02"],
    ["HS 07", "hs07"]
  ],
  FILTER_YEARS: {
    eci: ["1968-1972", "1973-1977", "1978-1982", "1983-1987", "1988-1992", "1993-1997", "1998-2002", "2003-2007", "2008-2012", "2013-2017"],
    hs92: ["1995-1999", "2000-2005", "2006-2011", "2012-2017"],
    hs96: ["1998-2002", "2003-2007", "2008-2012", "2013-2017"],
    hs02: ["2003-2007", "2008-2012", "2013-2017"],
    hs07: ["2008-2012", "2013-2017"]
  },
  RANGE_YEARS: {
    "1968-1972": [1968, 1969, 1970, 1971, 1972],
    "1973-1977": [1973, 1974, 1975, 1976, 1977],
    "1978-1982": [1978, 1979, 1980, 1981, 1982],
    "1983-1987": [1983, 1984, 1985, 1986, 1987],
    "1988-1992": [1988, 1989, 1990, 1991, 1992],
    "1993-1997": [1993, 1994, 1995, 1996, 1997],
    "1998-2002": [1998, 1999, 2000, 2001, 2002],
    "2003-2007": [2003, 2004, 2005, 2006, 2007],
    "2008-2012": [2008, 2009, 2010, 2011, 2012],
    "2013-2017": [2013, 2014, 2015, 2016, 2017],
    "1995-1999": [1995, 1996, 1997, 1998, 1999],
    "2000-2005": [2000, 2001, 2002, 2003, 2004, 2005],
    "2006-2011": [2006, 2007, 2008, 2009, 2010, 2011],
    "2012-2017": [2012, 2013, 2014, 2015, 2016, 2017]
  },
  DOWNLOAD_BUTTONS: [
    ["Download", "https://oec.world/en/rankings/product/sitc/?download=true"],
    ["Download All Years", "https://oec.world/en/rankings/product/sitc/?download=true&download_all=true"]
  ]
};
