const axios = require("axios");

const caCountryIds = {afg: "1958", sxm: "2158", alb: "1960", dza: "1961", asm: "1962", and: "1963", ago: "1964", aia: "1965", ata: "1966", atg: "1967", arg: "1968", arm: "1969", abw: "1970", aus: "1971", aut: "1972", aze: "1973", bhs: "1974", bhr: "1975", bgd: "1976", brb: "1977", blr: "1978", bel: "1979", blz: "1980", ben: "1981", bmu: "1982", btn: "1983", bol: "1984", bes: "1985", bih: "1986", bwa: "1987", bvt: "1988", bra: "1989", iot: "1990", vgb: "1991", brn: "1992", bgr: "1993", bfa: "1994", bdi: "1995", khm: "1996", cmr: "1997", can: "1998", cpv: "1999", cym: "2000", caf: "2001", tcd: "2002", chl: "2003", chn: "2004", cxr: "2005", cck: "2006", col: "2007", com: "2008", cog: "2009", cod: "2010", cok: "2011", cri: "2012", civ: "2067", hrv: "2013", cub: "2014", cuw: "2015", cyp: "2016", cze: "2017", dnk: "2018", dji: "2019", dma: "2020", dom: "2021", ecu: "2022", egy: "2023", slv: "2024", gnq: "2025", eri: "2026", est: "2027", swz: "2172", eth: "2028", flk: "2029", fro: "2030", fji: "2031", fin: "2032", fra: "2033", guf: "2034", pyf: "2035", atf: "2036", gab: "2037", gmb: "2038", geo: "2039", deu: "2040", gha: "2041", gib: "2042", grc: "2043", grl: "2044", grd: "2045", glp: "2046", gum: "2047", gtm: "2048", gin: "2050", gnb: "2051", guy: "2052", hti: "2053", hmd: "2054", hnd: "2055", hkg: "2056", hun: "2057", isl: "2058", ind: "2059", idn: "2060", irn: "2061", irq: "2062", irl: "2063", imn: "2064", isr: "2065", ita: "2066", jam: "2068", jpn: "2069", jor: "2071", kaz: "2072", ken: "2073", kir: "2074", kwt: "2075", kgz: "2076", lao: "2077", lva: "2078", lbn: "2079", lso: "2080", lbr: "2081", lby: "2082", lie: "2083", ltu: "2084", lux: "2085", mac: "2086", mkd: "2087", mdg: "2088", mwi: "2089", mys: "2090", mdv: "2091", mli: "2092", mlt: "2093", mhl: "2094", mtq: "2095", mrt: "2096", mus: "2097", myt: "2098", mex: "2099", fsm: "2100", mda: "2101", mco: "2102", mng: "2103", mne: "2104", msr: "2105", mar: "2106", moz: "2107", mmr: "2108", nam: "2109", nru: "2110", npl: "2111", nld: "2112", ant: "2113", ncl: "2114", nzl: "2115", nic: "2116", ner: "2117", nga: "2118", niu: "2119", nfk: "2120", prk: "2121", mnp: "2122", nor: "2123", omn: "2124", pak: "2125", plw: "2126", pse: "2127", pan: "2128", png: "2129", pry: "2130", per: "2131", phl: "2132", pcn: "2133", pol: "2134", prt: "2135", pri: "2136", qat: "2137", reu: "2138", rou: "2139", rus: "2140", rwa: "2141", blm: "2142", shn: "2143", kna: "2144", lca: "2145", maf: "2146", spm: "2147", vct: "2148", wsm: "2149", smr: "2150", stp: "2151", sau: "2152", sen: "2153", srb: "2154", syc: "2155", sle: "2156", sgp: "2157", svk: "2159", svn: "2160", slb: "2161", som: "2162", zaf: "2163", sgs: "2164", kor: "2165", ssd: "2166", esp: "2167", lka: "2168", sdn: "2169", sur: "2170", sjm: "2171", swe: "2173", che: "2174", syr: "2175", twn: "2176", tjk: "2177", tza: "2178", tha: "2179", tls: "2180", tgo: "2181", tkl: "2182", ton: "2183", tto: "2184", tun: "2185", tur: "2186", tkm: "2187", tca: "2188", tuv: "2189", vir: "2190", uga: "2191", ukr: "2192", are: "2193", gbr: "2194", umi: "2195", ury: "2196", usa: "2197", uzb: "2198", vut: "2199", vat: "2200", ven: "2201", vnm: "2202", wlf: "2203", esh: "2204", yem: "2205", zmb: "2206", zwe: "2207"};

module.exports = function(app) {
  app.get("/api/companies/ca", async(req, res) => {
    const caCountryFilterId = caCountryIds[req.query.origin] || "1968";
    const x = await axios.get("http://qat02-ws.connectamericas.com/apirest/v6/company_by_hscode", {
      params: {
        hs_code: req.query.hs_code || "0805",
        origin: caCountryFilterId,
        location: "origin"
      },
      headers: {
        clientToken: "oec-FamulJKGa7"
      }
    });
    return res.json(x.data);
  });
};
