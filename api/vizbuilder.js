const dataHS4 = require("../static/network/network_hs4.json");
const axios = require("axios");
const TESSERACT_API = "/api/stats/relatedness";

module.exports = function(app) {
  app.get("/api/gdp/eci", async(req, res) => {
    const queryParams = req.query;
    const params = {
      cube: "trade_i_baci_a_92",
      rca: "Exporter Country,HS4,Trade Value",
      alias: "Country,HS4",
      measures: "Trade Value",
      Year: queryParams.Year || 2017,
      parents: true
    };

    axios.all([
      axios.get("http://localhost:3300/api/stats/eci", {params}),
      axios.get("https://api.oec.world/tesseract/data", {params: {
        Year: queryParams.Year || 2017,
        cube: "trade_i_baci_a_92",
        drilldowns: "Exporter Country",
        measures: "Trade Value",
        parents: true
      }}),
      axios.get("https://api.oec.world/tesseract/data", {params: {
        Indicator: queryParams.x,
        Year: queryParams.Year || 2017,
        cube: "indicators_i_wdi_a",
        drilldowns: "Country",
        measures: "Measure"
      }}),
      axios.get("https://api.oec.world/tesseract/data", {params: {
        Indicator: queryParams.y,
        Year: queryParams.Year || 2017,
        cube: "indicators_i_wdi_a",
        drilldowns: "Country",
        measures: "Measure"
      }})
    ]).then(axios.spread((resp1, resp2, resp3, resp4) => {
      const eciData = resp1.data.data;
      const gdpData = resp2.data.data;
      console.log("I'm here!");

      const mergeById = (a1, a2) =>
        a1.map(itm => ({
          ...a2.find(item => item["Country ID"] === itm["Country ID"] && item),
          ...itm
        }));
      let data = mergeById(eciData, gdpData).filter(d => d["Trade Value"] && d["Trade Value ECI"]);
      data = mergeById(data, resp3.data.data.map(d => ({...d, [queryParams.x]: d.Measure})));
      data = mergeById(data, resp4.data.data.map(d => ({...d, [queryParams.y]: d.Measure})));
      res.json(data.filter(d => d[queryParams.x] && d[queryParams.y]));
    }));
  });

  app.get("/api/connections/hs4", async(req, res) => {
    const data = dataHS4.edges;
    const queryParams = req.query;

    const params = {
      cube: "trade_i_baci_a_92",
      rca: "Exporter Country,HS4,Trade Value",
      alias: "Country,HS4",
      measures: "Trade Value",
      filter_Country: queryParams.Country,
      Year: queryParams.Year || 2017,
      parents: true
    };
    // res.json({hello: "goodbye"});
    axios.get("http://localhost:3300/api/stats/relatedness", {params}).then(response => {
      const rcaData = response.data.data;
      const rcaObj = rcaData.reduce((all, d) => {
        all[d["HS4 ID"] * 1] = d;
        return all;
      }, {});
      // Includes RCA values into connections data
      data.forEach(d => {
        Object.assign(d, rcaObj[d.source * 1] || {});
        // d["Trade Value RCA"] = rcaObj[d.source * 1] || null;
      });
      res.json(data);
    }).catch(error => error);

  });

};
