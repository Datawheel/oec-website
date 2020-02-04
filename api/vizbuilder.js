const dataHS4 = require("../static/network/network_hs4.json");
const axios = require("axios");
const TESSERACT_API = "/api/stats/relatedness";

module.exports = function(app) {

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
