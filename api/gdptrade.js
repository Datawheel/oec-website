const axios = require("axios");

const PATH_GDP = "/data.jsonrecords?Indicator=NY.GDP.PCAP.PP.KD&cube=indicators_i_wdi_a&drilldowns=Country%2CYear&measures=Measure&parents=false&sparse=false";
const PATH_TRADE = "/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Exporter+Country%2CYear&measures=Trade+Value&parents=false&sparse=false";
const BASE_URL = "/api/gdptrade";

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
    await axios.all([axios.get(CANON_CMS_CUBES + PATH_GDP), axios.get(CANON_CMS_CUBES + PATH_TRADE)]).then(
      axios.spread((resp1, resp2) => {
        const gdpData = resp1.data.data;
        const tradeData = resp2.data.data;
        const uniqueCountries = [...new Set(gdpData.map(m => m["Country ID"]))];
        const uniqueYears = [...new Set(gdpData.map(m => m["Year"]))];

        const data = [];
        uniqueCountries.forEach(m => {
          const gdpFilter = gdpData.filter(f => f["Country ID"] === m);
          const tradeFilter = tradeData.filter(f => f["Country ID"] === m);
          uniqueYears.forEach(k => {
            const gdpRow = gdpFilter.filter(f => f.Year === k);
            const tradeRow = tradeFilter.filter(f => f.Year === k);
            const row = {};
            row["Country ID"] = m;
            row["Country"] = gdpFilter[0]["Country"];
            row["Year"] = k;
            if (gdpRow[0]) {
              row["GDP"] = gdpRow[0]["Measure"];
            } else {
              row["GDP"] = null;
            }
            if (tradeRow[0]) {
              row["Trade Value"] = tradeRow[0]["Trade Value"];
            } else {
              row["Trade Value"] = null;
            }
            data.push(row);
          })
        })

        res.json({data: data});
      })
    );
    } catch (e) {
      console.log(e);
    }
  });

};
