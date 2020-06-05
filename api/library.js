const axios = require("axios");

const PATH_CSV = `https://docs.google.com/spreadsheets/d/1PjYvPEstwhka7MIHTm6UHmcw58-_J6go0NtI5MAgDhQ/gviz/tq?tqx=out:csv&sheet=Sheet1`;
const PATH_TSV = "https://docs.google.com/spreadsheets/u/0/d/1PjYvPEstwhka7MIHTm6UHmcw58-_J6go0NtI5MAgDhQ/export?format=tsv&id=1PjYvPEstwhka7MIHTm6UHmcw58-_J6go0NtI5MAgDhQ&gid=0"
const BASE_URL = "/api/library";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    const respData = await axios(PATH_TSV)
      .then(resp => resp.data);

    const csv = respData.split("\r\n").map(d => d.split("\t"));
    const csvHeader = csv[0];
    const data = csv.slice(1).reduce((all, d) => {
      const item = {};
      csvHeader.forEach((h, i) => {
        item[h] = d[i] !== "" ? d[i] : null;
      });
      all.push(item);
      return all;
    }, []);

    res.json({data: data, headers: csvHeader});
  });

};
