const axios = require("axios");
const yn = require("yn");

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);
const verbose = yn(process.env.CANON_CMS_LOGGING);

const catcher = e => {
  if (verbose) {
    console.error("Error in Matrix Route: ", e);
  }
  return false;
};

const datePad = d => {
  d = String(d);
  if (d.length === 4) {
    d = `${d}1231`;
  } 
  else if (d.length === 6) {
    d = `${d}31`;
  }
};

module.exports = function(app) {

  const {db} = app.settings;

  app.get("/api/matrix", async(req, res) => {

    const url = `${CANON_CMS_CUBES}/cubes`;

    const cubeData = await axios.get(url).then(d => d.data).catch(catcher);

    const matrix = [];
    
    if (cubeData && cubeData.cubes) {
      for (const thisCube of cubeData.cubes.slice(0, 5)) {
        const {name, dimensions, measures, annotations} = thisCube;
        let drilldown, measure, timeResolution;
        if (measures[0]) measure = measures[0].name;
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
            console.log(thisCube.name);
            catcher(e);
          }
        }
        if (!name || !drilldown || !measure || !timeResolution) continue;
        const rangeURL = `${CANON_CMS_CUBES}/data.jsonrecords?cube=${name}&drilldowns=${drilldown}&measures=${measure}&parents=false&sparse=false`;
        const range = await axios.get(rangeURL).then(d => d.data.data).catch(catcher);
        if (range && Array.isArray(range)) {
          const start = range[0][drilldown];
          const end = range[range.length - 1][drilldown];
          matrix.push({
            name,
            timeResolution,
            start,
            end
          });
        }
        else {
          continue;
        } 
      }
      return res.json(matrix);
    }
    return res.json({});
  });
};
