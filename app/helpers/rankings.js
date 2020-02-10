const locale = "en";

module.exports = {
  PAGE: [
    {
      title: {
        country: "rankings_title_country",
        product: "rankings_title_product"
      },
      text: [
        "rankings_text_1",
        "rankings_text_2",
        "rankings_text_3"
      ]
    }
  ],
  CATEGORY_BUTTONS: [
    {
      display: "rankings_active_country",
      value: "country",
      href: `/${locale}/rankings/country/eci/`
    },
    {
      display: "rankings_active_product",
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
    ["rankings_download_1", {country: `/${locale}/rankings/country/eci/?download=true`, product: `/${locale}/rankings/product/sitc/?download=true`}],
    ["rankings_download_2", {country: `/${locale}/rankings/country/eci/?download=true&download_all=true`, product: `/${locale}/rankings/product/sitc/?download=true&download_all=true`}]
  ]
};
