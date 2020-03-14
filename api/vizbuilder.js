const dataHS4 = require("../static/network/network_hs4.json");
const axios = require("axios");
const TESSERACT_API = "/api/stats/relatedness";

module.exports = function(app) {
  app.get("/api/gdp/eci", async(req, res) => {
    const queryParams = req.query;

    const getDataFromWDI = param => {
      const isOEC = new RegExp(/OEC/).test(param);
      if (!isOEC) {
        return axios.get("/olap-proxy/data", {params: {
          Indicator: param,
          Year: queryParams.Year || 2017,
          cube: "indicators_i_wdi_a",
          drilldowns: "Country",
          measures: "Measure"
        }});
      }
      else {
        return axios.get("http://localhost:3300/api/stats/eci", {params: {
          cube: "trade_i_baci_a_92",
          rca: "Exporter Country,HS4,Trade Value",
          alias: "Country,HS4",
          measures: "Trade Value",
          Year: queryParams.Year || 2017,
          parents: true,
          threshold_Country: 1000000000
        }});
      }
    };

    const mergeById = (a1, a2) =>
      a1.map(itm => ({
        ...a2.find(item => item["Country ID"] === itm["Country ID"] && item),
        ...itm
      }));

    axios.all([
      axios.get("/olap-proxy/data", {params: {
        Year: queryParams.Year || 2017,
        cube: "trade_i_baci_a_92",
        drilldowns: "Exporter Country",
        measures: "Trade Value",
        parents: true
      }}),
      getDataFromWDI(queryParams.x),
      getDataFromWDI(queryParams.y)
    ]).then(axios.spread((resp1, resp2, resp3) => {
      let data = resp1.data.data;

      [[resp2.data.data, queryParams.x], [resp3.data.data, queryParams.y]].forEach(tempData => {
        const isOEC = new RegExp(/OEC/).test(tempData[1]);
        const filteredData = isOEC
          ? tempData[0].map(d => ({...d, [tempData[1]]: d["Trade Value ECI"]}))
          : tempData[0].map(d => ({...d, [tempData[1]]: d.Measure}));
        data = mergeById(data, filteredData);
      });

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
