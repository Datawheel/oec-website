const axios = require("axios");
const yn = require("yn");
const jwt = require("jsonwebtoken");
const {timeFormat} = require("d3-time-format");

let {CANON_CMS_CUBES} = process.env;
const {OLAP_PROXY_SECRET} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);
const verbose = yn(process.env.CANON_CMS_LOGGING);

const FEATURE_MATRIX = {
  international: {
    products: [
      {cubeName: "trade_i_baci_a_02",        fullName: "International Trade (BACI HS 2002)"},
      {cubeName: "trade_i_baci_a_12",        fullName: "International Trade (BACI HS 2012)"},
      {cubeName: "trade_i_baci_a_07",        fullName: "International Trade (BACI HS 2007)"},
      {cubeName: "trade_i_baci_a_96",        fullName: "International Trade (BACI HS 1996)"},
      {cubeName: "trade_i_baci_a_92",        fullName: "International Trade (BACI HS 1992)"},
      {cubeName: "trade_i_comtrade_a_sitc2", fullName: "International Trade (UN Comtrade SITC2)"},
      {cubeName: "trade_i_comtrade_m_hs",    fullName: "International Trade (UN Comtrade HS)"}
    ],
    services: [
      {cubeName: "services_i_comtrade_a_eb02", fullName: "Comtrade Services (EB02)"}
    ],
    tariffs: [
      {cubeName: "tariffs_i_wits_a_hs", fullName: "Tariffs"}
    ],
    indicators: [
      {cubeName: "indicators_i_wdi_a", fullName: "World Development Indicators (WDI)"}
    ]
  },
  subnational: {
    products: [
      {cubeName: "trade_s_bra_mun_m_hs",      fullName: "Brazil Trade"},
      {cubeName: "trade_s_chn_m_hs",          fullName: "China Trade"},
      {cubeName: "trade_s_can_m_hs",          fullName: "Canada Trade"},
      {cubeName: "trade_s_chl_m_hs",          fullName: "Chile Trade"},
      {cubeName: "trade_s_deu_m_egw",         fullName: "Germany Trade"},
      {cubeName: "trade_s_jpn_m_hs",          fullName: "Japan Trade"},
      {cubeName: "trade_s_rus_m_hs",          fullName: "Russia Trade"},
      {cubeName: "trade_s_zaf_m_hs",          fullName: "South Africa Trade"},
      {cubeName: "trade_s_esp_m_hs",          fullName: "Spain Trade"},
      {cubeName: "trade_s_swe_m_hs",          fullName: "Sweden Trade"},
      {cubeName: "trade_s_tur_m_hs",          fullName: "Turkey Trade"},
      {cubeName: "trade_s_usa_district_m_hs", fullName: "United States Trade"},
      {cubeName: "trade_s_ury_a_hs",          fullName: "Uruguay Trade"}
    ]
  }
};


const catcher = e => {
  if (verbose) {
    console.error("Error in Matrix Route: ", e);
  }
  return false;
};

const dateFormat = d => {
  d = String(d);
  if (d.length === 4) {
    return timeFormat("%Y")(new Date(d));
  }
  else if (d.length === 6) {
    const year = d.substr(0, 4);
    const month = d.substr(4, 2);
    return timeFormat("%b %Y")(new Date(year, month));
  }
  else if (d.length === 8) {
    const year = d.substr(0, 4);
    const month = d.substr(4, 2);
    const day = d.substr(6, 2);
    return timeFormat("%b %d %Y")(new Date(year, month, day));
  }
  else {
    return d;
  }
};

module.exports = function(app) {

  app.get("/api/matrix", async(req, res) => {

    const url = `${CANON_CMS_CUBES}/cubes`;

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

    const cubeData = await axios.get(url, config).then(d => d.data).catch(catcher);

    if (cubeData && cubeData.cubes) {
      for (const nation of Object.keys(FEATURE_MATRIX)) {
        const thisNation = FEATURE_MATRIX[nation];
        for (const group of Object.keys(thisNation)) {
          const thisGroup = thisNation[group];
          const newGroup = [];
          for (const meta of thisGroup) {
            const thisCube = cubeData.cubes.find(cube => cube.name === meta.cubeName);
            const {name, dimensions, measures} = thisCube;
            let drilldown, measure, timeResolution;
            if (measures[0]) measure = measures[0].name;

            // Determine the Time Resolution
            const names = dimensions.map(d => d.name);
            if (names.includes("Year")) {
              drilldown = "Year";
              timeResolution = "Year";
            }
            else if (names.includes("Time")) {
              drilldown = "Time";
              try {
                const levels = dimensions.find(d => d.name === "Time").hierarchies.find(d => d.name === "Time").levels;
                if (levels.length === 1) {
                  timeResolution = "Year";
                }
                else {
                  timeResolution = levels[levels.length - 2].name;
                }
              }
              catch (e) {
                catcher(e);
              }
            }

            // Find only the Geo and Product Dimensions
            const dataDims = dimensions.filter(d => {
              const isProduct = d.name.includes("Product") || d.hierarchies[0].name.includes("Product");
              const isService = d.name.includes("Service") || d.hierarchies[0].name.includes("Service");
              const isSubnat = d.hierarchies[0].name === "Subnat Geography";
              const isLoneGeo = d.hierarchies[0].name === "Geography" && !dimensions.map(o => o.name).includes("Subnat Geography");
              return isProduct || isService || isSubnat || isLoneGeo;
            });

            const resolutions = dataDims.reduce((acc, d) => {
              const isProduct = d.name.includes("Product") || d.hierarchies[0].name.includes("Product");
              const isService = d.name.includes("Service") || d.hierarchies[0].name.includes("Service");
              const topLevel = isProduct || isService ? "product" : "geography";
              const resolution = d.hierarchies[0].levels.reduce((acc2, d2) => {
                let title = d2.annotations && d2.annotations.level ? d2.annotations.level : d2.name;
                title = title.replace(" Product", "");
                return acc2.concat(title);
              }, []).join(", ");
              return {...acc, [topLevel]: resolution};
            }, {time: `${timeResolution}ly`});

            if (!name || !drilldown || !measure) continue;
            const rangeURL = `${CANON_CMS_CUBES}/data.jsonrecords?cube=${name}&drilldowns=${drilldown}&measures=${measure}&parents=false&sparse=false`;
            const range = await axios.get(rangeURL, config).then(d => d.data.data).catch(catcher);
            if (range && Array.isArray(range)) {
              const start = dateFormat(range[0][drilldown]);
              const end = dateFormat(range[range.length - 1][drilldown]);
              newGroup.push({...meta, resolutions, start, end});
            }
            else {
              continue;
            }
          }
          thisNation[group] = newGroup;
        }
      }
      return res.json(FEATURE_MATRIX);
    }
    return res.json({});
  });
};
