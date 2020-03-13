const axios = require("axios"),
      url = require("url");

module.exports = function(app) {
  const subnationalCubes = async(req, res) => {
    const origin = `${req.protocol}://${req.headers.host}`;
    const d = await axios.get(`${origin}/olap-proxy/cubes`);
    const data = d.data.cubes.filter(d => d.name.includes("trade_s_"));
    const output = {};

    for (const d of data) {
      const timeDimension = d.dimensions.find(d => d.name === "Time") || {};
      const timeLevels = timeDimension.hierarchies[0].levels.map(d => d.name).reverse();
      const isTime = timeLevels.some(d => d === "Time");
      const timeLevel = ["Month", "Quarter", "Year"].find(d => timeLevels.includes(d));

      const x = await axios
        .get(`${origin}/olap-proxy/data?cube=${d.name}&drilldowns=${isTime ? "Time" : "Year"}&measures=Trade Value`);
      const time = x.data.data.map(d => d.Time);
      time.sort((a, b) => b - a);

      const latestMonth = time[0].toString().slice(4, 6) * 1;
      const currYear = time[0].toString().slice(0, 4) * 1;
      const timeLags = {
        Year: 1,
        Quarter: 4,
        Month: 12
      };
      const timeLag = timeLags[timeLevel];

      const latestYear = latestMonth < timeLag
        ? currYear - 1 : currYear;

      output[d.name] = {
        latestYear,
        latest: time[0],
        growthTime: [
          time[timeLag] || time[time.length - 1], time[0]
        ],
        growthYear: [
          latestYear - 1, latestYear
        ],
        multiYear: time.length > timeLag
      };
    }
    return output;
  };
  app.get("/subnational/cubes", subnationalCubes);

  app.get("/olap-subnational/*", async(req, res) => {
    const origin = `${req.protocol}://${req.headers.host}`;
    const cubes = await subnationalCubes(req, res);
    const {params, query} = req;
    const {cube, drilldowns} = query;
    const queryParams = params[0];
    const cubeData = cubes[cube] || {};
    if (drilldowns.includes("Time")) {
      query.Time = cubeData.growthTime.join();
    }
    else if (drilldowns.includes("Year")) {
      query.Year = cubeData.growthYear.join();
    }

    const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join("&");

    const data = await axios.get(`${origin}/olap-proxy/${queryParams}?${queryString}`)
      .then(resp => resp.data);
    res.send(data).end();

  });

};
