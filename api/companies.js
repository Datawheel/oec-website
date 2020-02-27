const axios = require("axios");

const caCountryIds = {afago: "1964", afbdi: "1995", afben: "1981", afbfa: "1994", afbwa: "1987", afcaf: "2001", afciv: "2067", afcmr: "1997", afcod: "2010", afcog: "2009", afcom: "2008", afcpv: "1999", afdji: "2019", afdza: "1961", afegy: "2023", aferi: "2026", afesh: "2204", afeth: "2028", afgab: "2037", afgha: "2041", afgin: "2050", afgmb: "2038", afgnb: "2051", afgnq: "2025", afken: "2073", aflbr: "2081", aflby: "2082", aflso: "2080", afmar: "2106", afmdg: "2088", afmli: "2092", afmoz: "2107", afmrt: "2096", afmus: "2097", afmwi: "2089", afmyt: "2098", afnam: "2109", afner: "2117", afnga: "2118", afreu: "2138", afrwa: "2141", afsdn: "2169", afsen: "2153", afshn: "2143", afsle: "2156", afsom: "2162", afssd: "2166", afstp: "2151", afswz: "2172", afsyc: "2155", aftcd: "2002", aftgo: "2181", aftun: "2185", aftza: "2178", afuga: "2191", afzaf: "2163", afzmb: "2206", afzwe: "2207", anata: "1966", anatf: "2036", anbvt: "1988", anhmd: "2054", ansgs: "2164", asafg: "1958", asare: "2193", asarm: "1969", asaze: "1973", asbgd: "1976", asbhr: "1975", asbrn: "1992", asbtn: "1983", ascck: "2006", aschn: "2004", ascxr: "2005", ascyp: "2016", asgeo: "2039", ashkg: "2056", asidn: "2060", asind: "2059", asiot: "1990", asirn: "2061", asirq: "2062", asisr: "2065", asjor: "2071", asjpn: "2069", askaz: "2072", askgz: "2076", askhm: "1996", askor: "2165", askwt: "2075", aslao: "2077", aslbn: "2079", aslka: "2168", asmac: "2086", asmdv: "2091", asmmr: "2108", asmng: "2103", asmys: "2090", asnpl: "2111", asomn: "2124", aspak: "2125", asphl: "2132", asprk: "2121", aspse: "2127", asqat: "2137", assau: "2152", assgp: "2157", assyr: "2175", astha: "2179", astjk: "2177", astkm: "2187", astls: "2180", astur: "2186", astwn: "2176", asuzb: "2198", asvnm: "2202", asyem: "2205", eualb: "1960", euand: "1963", euaut: "1972", eubel: "1979", eubgr: "1993", eubih: "1986", eublr: "1978", euche: "2174", eucze: "2017", eudeu: "2040", eudnk: "2018", euesp: "2167", euest: "2027", eufin: "2032", eufra: "2033", eufro: "2030", eugbr: "2194", eugib: "2042", eugrc: "2043", euhrv: "2013", euhun: "2057", euimn: "2064", euirl: "2063", euisl: "2058", euita: "2066", eulie: "2083", eultu: "2084", eulux: "2085", eulva: "2078", eumco: "2102", eumda: "2101", eumkd: "2087", eumlt: "2093", eumne: "2104", eunld: "2112", eunor: "2123", eupol: "2134", euprt: "2135", eurou: "2139", eurus: "2140", eusjm: "2171", eusmr: "2150", eusrb: "2154", eusvk: "2159", eusvn: "2160", euswe: "2173", euukr: "2192", euvat: "2200", naabw: "1970", naaia: "1965", naant: "2113", naatg: "1967", nabes: "1985", nabhs: "1974", nablm: "2142", nablz: "1980", nabmu: "1982", nabrb: "1977", nacan: "1998", nacri: "2012", nacub: "2014", nacuw: "2015", nacym: "2000", nadma: "2020", nadom: "2021", nagrd: "2045", nagrl: "2044", nagtm: "2048", nahnd: "2055", nahti: "2053", najam: "2068", nakna: "2144", nalca: "2145", namaf: "2146", namex: "2099", namsr: "2105", namtq: "2095", nanic: "2116", napan: "2128", napri: "2136", naslv: "2024", naspm: "2147", natca: "2188", natto: "2184", naumi: "2195", nausa: "2197", navct: "2148", navgb: "1991", navir: "2190", ocasm: "1962", ocaus: "1971", occok: "2011", ocfji: "2031", ocfsm: "2100", ocglp: "2046", ocgum: "2047", ockir: "2074", ocmhl: "2094", ocmnp: "2122", ocncl: "2114", ocnfk: "2120", ocniu: "2119", ocnru: "2110", ocnzl: "2115", ocpcn: "2133", ocplw: "2126", ocpng: "2129", ocpyf: "2035", ocslb: "2161", octkl: "2182", octon: "2183", octuv: "2189", ocvut: "2199", ocwlf: "2203", ocwsm: "2149", saarg: "1968", sabol: "1984", sabra: "1989", sachl: "2003", sacol: "2007", saecu: "2022", saflk: "2029", saguf: "2034", saguy: "2052", saper: "2131", sapry: "2130", sasur: "2170", saury: "2196", saven: "2201"};

module.exports = function(app) {
  app.get("/api/companies/ca", async(req, res) => {
    const caCountryFilterId = req.query.country ? caCountryIds[req.query.country.toLowerCase()] || "1968" : null;
    const caHsFilterId = req.query.hs_code && !isNaN(req.query.hs_code) ? req.query.hs_code.length % 2 ? req.query.hs_code.slice(1) : req.query.hs_code.slice(2) : null;
    if (caHsFilterId) {
      const companyByHsResp = await axios.get("http://qat02-ws.connectamericas.com/apirest/v6/company_by_hscode", {
        params: caCountryFilterId && caHsFilterId
          ? {
            page_size: 100,
            hs_code: caHsFilterId || "0805",
            origin: caCountryFilterId,
            location: "origin"
          }
          : {
            page_size: 100,
            hs_code: caHsFilterId || "0805"
          },
        headers: {
          clientToken: "oec-FamulJKGa7"
        }
      }).catch(err => (console.log(err), {companies: []}));
      const companiesWithLogo = companyByHsResp.data ? companyByHsResp.data.companies.filter(d => d.logo) : [];
      return res.json({total_items: companiesWithLogo.length, companies: companiesWithLogo});
    }
    let allCompanies = [];
    let totalItems = 0;
    for (let i = 0; i < 5; i++) {
      const offset = i * 60;
      const companyByCountryResp = await axios.get("http://qat02-ws.connectamericas.com/apirest/v6/company", {
        params: {
          items_per_page: 60,
          offset,
          country: caCountryFilterId,
          verified: 1
        },
        headers: {
          clientToken: "oec-FamulJKGa7"
        }
      }).catch(err => (console.log(err), {_embedded: {company: []}}));
      if (companyByCountryResp.data && companyByCountryResp.data._embedded) {
        if (companyByCountryResp.data.total_items === 0) {
          break;
        }
        const thisIterationOfCompanies = companyByCountryResp.data._embedded.company
          .filter(d => d.photo_url)
          .map(d => ({id: d.id, name: d.name, industry: d.industry, photo_url: d.photo_url, business_objectives: d.business_objectives, public_url: d.public_url}));
        allCompanies = allCompanies.concat(thisIterationOfCompanies);
        totalItems += thisIterationOfCompanies.length;
      }
    }

    return res.json({total_items: totalItems, companies: allCompanies});
  });
};
