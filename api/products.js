const axios = require("axios");

const {OLAP_PROXY_ENDPOINT} = process.env;

module.exports = function(app) {

  app.get("/api/productsList", async(req, res) => {

    const url = `${OLAP_PROXY_ENDPOINT}data?cube=trade_i_baci_a_92&drilldowns=HS6&measures=Trade+Value&parents=true&sparse=false`;
    const data = await axios.get(url).then(res => res.data.data).catch(error => console.error("Covid Page Multihierarchy Selector Error:", error));

    return res.json({
      data
    });
  });
};
