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

const dateFormat = d => {
  d = String(d);
  if (d.length === 4) {
    return d;
  }
  else if (d.length === 6) {
    const year = d.substr(0, 4);
    const month = d.substr(4, 2);
    return `${year}-${month}`;
  }
  else if (d.length === 8) {
    const year = d.substr(0, 4);
    const month = d.substr(4, 2);
    const day = d.substr(6, 2);
    return `${year}-${month}-${day}`;
  }
  else {
    return d;
  }
};

module.exports = function(app) {

  const {db} = app.settings;

  app.get("/api/matrix", async(req, res) => {

    return res.json([{"name":"trade_i_baci_a_02","resolutions":{"time":"Year","HS Product":"HS6","Exporter (Geography)":"Country","Importer (Geography)":"Country"},"start":"2003","end":"2017"},{"name":"tariffs_i_wits_a_hs","resolutions":{"time":"Year","Measure":"Measure","Non Ad Valorem":"Non Ad Valorem","Reporter (Geography)":"Country","Partner (Geography)":"Country","HS Product":"HS6"},"start":"1989","end":"2018"},{"name":"trade_i_baci_a_12","resolutions":{"time":"Year","HS Product":"HS6","Exporter (Geography)":"Country","Importer (Geography)":"Country"},"start":"2012","end":"2017"},{"name":"trade_i_baci_a_07","resolutions":{"time":"Year","HS Product":"HS6","Exporter (Geography)":"Country","Importer (Geography)":"Country"},"start":"2008","end":"2017"},{"name":"trade_s_usa_district_m_hs","resolutions":{"time":"Month","Subnat Geography":"District","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"2019-01","end":"2019-12"},{"name":"trade_s_usa_state_m_hs","resolutions":{"time":"Month","Subnat Geography":"District","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"2019-01","end":"2019-12"},{"name":"trade_s_chn_m_hs","resolutions":{"time":"Month","Subnat Geography":"Province","Original Product":"HS10","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6","Unit":"Unit"},"start":"2019-01","end":"2019-08"},{"name":"trade_s_bra_mun_m_hs","resolutions":{"time":"Month","Subnat Geography":"Municipality","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS4"},"start":"1997-01","end":"2020-01"},{"name":"trade_s_bra_ncm_m_hs","resolutions":{"time":"Month","Unit":"Unit","Subnat Geography":"State","Transport Mode":"Transport Mode","Port of Entry":"Port of Entry","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"1997-01","end":"2020-01"},{"name":"trade_s_can_m_hs","resolutions":{"time":"Month","Subnat Geography":"Province","US State":"US State","Unit":"Unit","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"1990-01","end":"2019-11"},{"name":"trade_s_esp_m_hs","resolutions":{"time":"Month","Original Product":"Original Product","Subnat Geography":"Province","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"2010-01","end":"2019-10"},{"name":"trade_s_deu_m_egw","resolutions":{"time":"Month","Subnat Geography":"State","Product":"EGW","Partner (Geography)":"Country","Trade Flow":"Trade Flow"},"start":"2011-01","end":"2019-09"},{"name":"trade_s_tur_m_countries","resolutions":{"time":"Month","Subnat Geography":"Province","Partner (Geography)":"Country","Trade Flow":"Trade Flow"},"start":"2002-01","end":"2019-11"},{"name":"trade_s_tur_m_hs","resolutions":{"time":"Month","Subnat Geography":"Province","Trade Flow":"Trade Flow","Product":"Section"},"start":"2002-01","end":"2019-11"},{"name":"trade_s_swe_m_hs","resolutions":{"time":"Month","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"2017-01","end":"2019-09"},{"name":"trade_s_ury_a_hs","resolutions":{"time":"Year","Subnat Geography":"Department","Product":"HS4"},"start":"2016","end":"2018"},{"name":"trade_s_jpn_m_hs","resolutions":{"time":"Month","Subnat Geography":"Prefecture","Port of Entry":"Port of Entry","Unit":"Unit","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"2009-01","end":"2019-12"},{"name":"trade_s_chl_m_hs","resolutions":{"time":"Month","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"1992-01","end":"1993-12"},{"name":"trade_s_rus_m_hs","resolutions":{"time":"Month","Original Product":"HS10","Unit":"Unit","Subnat Geography":"Region","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"2015-01","end":"2019-07"},{"name":"trade_s_zaf_m_hs","resolutions":{"time":"Month","Transport Mode":"Transport Mode","Port of Entry":"Port of Entry","Unit":"Unit","Partner (Geography)":"Country","Trade Flow":"Trade Flow","Product":"HS6"},"start":"2018-01","end":"2019-04"},{"name":"services_i_comtrade_a_eb02","resolutions":{"time":"Year","Trade Flow":"Trade Flow","Reporter (Geography)":"Country","Partner (Geography)":"Country","Service":"Service"},"start":"2000","end":"2017"},{"name":"trade_i_comtrade_a_sitc2","resolutions":{"time":"Year","Product":"Tier 4 Product","Unit":"Unit","Reporter (Geography)":"Country","Partner (Geography)":"Country","Trade Flow":"Trade Flow"},"start":"2000","end":"2018"},{"name":"legacy_complexity_pci_a_hs92_hs6","resolutions":{"time":"Year","HS Product":"HS6"},"start":"1995","end":"2017"},{"name":"legacy_complexity_pci_a_hs96_hs6","resolutions":{"time":"Year","HS Product":"HS6"},"start":"1998","end":"2017"},{"name":"legacy_complexity_pci_a_hs02_hs6","resolutions":{"time":"Year","HS Product":"HS6"},"start":"2003","end":"2017"},{"name":"legacy_complexity_pci_a_hs07_hs6","resolutions":{"time":"Year","HS Product":"HS6"},"start":"2008","end":"2017"},{"name":"legacy_complexity_pci_a_hs92_hs4","resolutions":{"time":"Year","HS Product":"HS4"},"start":"1995","end":"2017"},{"name":"legacy_complexity_pci_a_hs96_hs4","resolutions":{"time":"Year","HS Product":"HS4"},"start":"1998","end":"2017"},{"name":"legacy_complexity_pci_a_hs02_hs4","resolutions":{"time":"Year","HS Product":"HS4"},"start":"2003","end":"2017"},{"name":"legacy_complexity_pci_a_hs07_hs4","resolutions":{"time":"Year","HS Product":"HS4"},"start":"2008","end":"2017"},{"name":"legacy_complexity_eci_a","resolutions":{"time":"Year","Country (Geography)":"Country"},"start":"1964","end":"2017"},{"name":"patents_s_usa_w_cpc","resolutions":{"time":"Month","Patent":"Patent","Inventor":"Inventor","Organization":"Organization","CPC":"Subclass","Inventor Country (Geography)":"Country","Organization Country (Geography)":"Country"},"start":"2016-01","end":"2019-11"},{"name":"patents_i_uspto_w_cpc","resolutions":{"time":"Week","Patent":"Patent","Patent Type":"Patent Type","Inventor":"Inventor","Organization":"Organization","Invention":"Invention","CPC":"Subclass","Inventor Country (Geography)":"Country","Organization Country (Geography)":"Country"},"start":"2014-01-07","end":"2020-01-28"},{"name":"patents_i_uspto_w_organizations","resolutions":{"time":"Week","Patent":"Patent","Patent Type":"Patent Type","Inventor":"Inventor","Organization":"Organization","Invention":"Invention","CPC":"Subclass","Inventor Country (Geography)":"Country","Organization Country (Geography)":"Country"},"start":"2014-01-07","end":"2020-01-28"},{"name":"trade_i_comtrade_m_hs","resolutions":{"time":"Month","Trade Flow":"Trade Flow","Reporter (Geography)":"Country","Partner (Geography)":"Country","HS Product":"HS6"},"start":"2008-01","end":"2019-10"},{"name":"trade_i_baci_a_96","resolutions":{"time":"Year","HS Product":"HS6","Exporter (Geography)":"Country","Importer (Geography)":"Country"},"start":"1998","end":"2017"},{"name":"indicators_i_wdi_a","resolutions":{"time":"Year","Country (Geography)":"Country","Indicator":"Indicator"},"start":"1960","end":"2017"},{"name":"trade_i_baci_a_92","resolutions":{"time":"Year","HS Product":"HS6","Exporter (Geography)":"Country","Importer (Geography)":"Country"},"start":"1995","end":"2017"}]);

    const url = `${CANON_CMS_CUBES}/cubes`;

    const cubeData = await axios.get(url).then(d => d.data).catch(catcher);

    const matrix = [];
    
    if (cubeData && cubeData.cubes) {
      for (const thisCube of cubeData.cubes) {
        const {name, dimensions, measures, annotations} = thisCube;
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

        // Determine the smallest resolution of each non-time Dimension
        const dataDims = dimensions.filter(d => d.name !== "Time" && d.name !== "Year");
        const resolutions = dataDims.reduce((acc, d) => {
          const level = d.hierarchies[0].levels[d.hierarchies[0].levels.length - 1];
          const name = `${d.name}${d.hierarchies[0].name === "Geography" ? " (Geography)" : ""}`;
          const resolution = level.annotations && level.annotations.level ? level.annotations.level : level.name;
          return {...acc, [name]: resolution};
        }, {time: timeResolution});

        if (!name || !drilldown || !measure) continue;
        const rangeURL = `${CANON_CMS_CUBES}/data.jsonrecords?cube=${name}&drilldowns=${drilldown}&measures=${measure}&parents=false&sparse=false`;
        const range = await axios.get(rangeURL).then(d => d.data.data).catch(catcher);
        if (range && Array.isArray(range)) {
          const start = dateFormat(range[0][drilldown]);
          const end = dateFormat(range[range.length - 1][drilldown]);
          matrix.push({
            name,
            resolutions,
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
