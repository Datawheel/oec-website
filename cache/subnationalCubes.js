const axios = require("axios"),
      jwt = require("jsonwebtoken");
const {OLAP_PROXY_ENDPOINT, OLAP_PROXY_SECRET} = process.env;

module.exports = async function() {

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

  const fullURL = `${OLAP_PROXY_ENDPOINT}cubes`;

  const y = await axios.get(fullURL, config).then(resp => resp.data);
  const data = y.cubes.filter(d => d.name.includes("trade_s_"));
  const output = {};
  for (const d of data) {
    const timeDimension = d.dimensions.find(d => d.name === "Time") || {};
    const timeLevels = timeDimension.hierarchies[0].levels.map(d => d.name).reverse();
    const isTime = timeLevels.some(d => d === "Time");
    const timeLevel = ["Month", "Quarter", "Year"].find(d => timeLevels.includes(d));

    const fullDataURL = `${OLAP_PROXY_ENDPOINT}data?cube=${d.name}&drilldowns=${isTime ? "Time" : "Year"}&measures=Trade+Value`;
    let x = [];
    try {
      x = await axios.get(fullDataURL, config);
    }
    catch {
      x = await axios.get(fullDataURL);
    }

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
