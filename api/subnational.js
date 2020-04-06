const axios = require("axios"),
      jwt = require("jsonwebtoken");

const {OLAP_PROXY_ENDPOINT, OLAP_PROXY_SECRET} = process.env;

const catcher = e => ({data: [], error: "This cube is not public"});

module.exports = function(app) {
  const subnationalCubes = async(req, res) => {
    const url = `${OLAP_PROXY_ENDPOINT}cubes`;

    const apiToken = jwt.sign(
      {
        auth_level: 10,
        sub: "server",
        status: "valid"
      },
      OLAP_PROXY_SECRET,
      {expiresIn: "30m"}
    );

    const config = {
      headers: {
        "x-tesseract-jwt-token": apiToken
      }
    };

    const cubeData = await axios.get(url, config).then(d => d.data);

    const data = cubeData.cubes.filter(d => d.name.includes("trade_s_"));
    const output = {};

    for (const d of data) {
      const timeDimension = d.dimensions.find(d => d.name === "Time") || {};
      const timeLevels = timeDimension.hierarchies[0].levels.map(d => d.name).reverse();
      const isTime = timeLevels.some(d => d === "Time");
      const timeLevel = ["Month", "Quarter", "Year"].find(d => timeLevels.includes(d));
      const fullURL = `${OLAP_PROXY_ENDPOINT}data?cube=${d.name}&drilldowns=${isTime ? "Time" : "Year"}&measures=Trade Value`;

      const x = await axios.get(fullURL, config).then(resp => resp.data);
      const time = x.data.map(d => d.Time);
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
  app.get("/subnational/cubes", async(req, res) => res.send(await subnationalCubes(req, res)).end());

  app.get("/olap-subnational/*", async(req, res) => {
    const origin = `${req.protocol}://${req.headers.host}`;
    const {cache} = app.settings;
    const {user, params, query} = req;
    const {cube, drilldowns} = query;

    const cubes = cache.subnationalCubes;
    const cubeData = cubes[cube] || {};
    const queryParams = params[0];

    let dd = cubeData.growthTime;
    if (drilldowns.includes("Time")) {
      query.Time = cubeData.growthTime.join();
    }
    else if (drilldowns.includes("Year")) {
      dd = cubeData.growthYear;
      query.Year = cubeData.growthYear.join();
    }

    const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join("&");
    let apiToken = req.headers["x-tesseract-jwt-token"];
    if (!apiToken) {
      apiToken = jwt.sign(
        {
          auth_level: user ? user.role : 0,
          sub: user ? user.id : "localhost",
          status: "valid"
        },
        OLAP_PROXY_SECRET,
        {expiresIn: "30m"}
      );
    }

    const config = {
      headers: {
        "x-tesseract-jwt-token": apiToken
      }
    };

    const fullURL = `${origin}/olap-proxy/${queryParams}?${queryString}`;
    const data = await axios.get(fullURL, config)
      .then(resp => resp.data)
      .catch(catcher);

    res.send(Object.assign(data, {growth: dd})).end();

  });

};
