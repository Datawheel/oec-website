const {range} = require("helpers/utils.js");
const colors = require("helpers/colors.js");
const tradeMeasure = {
  measure: "Trade Value"
};

const cubes = {
  // subnational_fra: {
  //   cube: "trade_s_fra_q_cpf",
  //   name: "France",
  //   id: "fra",
  //   topojson: [
  //     "/shapes/subnational_fra_regions.topojson",
  //     "/shapes/subnational_fra_departments.topojson"
  //   ],
  //   productLevels: ["Level 1", "Level 2", "Level 3", "Product"],
  //   geoLevels: ["Region", "Subnat Geography"],
  //   timeLevels: ["Year", "Quarter"]
  // },
  subnational_esp: {
    cube: "trade_s_esp_m_hs",
    geoLevels: ["Autonomous Communities", "Subnat Geography"],
    id: "esp",
    name: "Spain",
    productLevels: ["Section", "HS2", "HS4", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: [
      "/shapes/subnational_esp_autonomous.topojson",
      "/shapes/subnational_esp_provinces.topojson"
    ],
    value: "subnational_esp",
    ...tradeMeasure
  },
  subnational_rus: {
    cube: "trade_s_rus_m_hs",
    geoLevels: ["District", "Subnat Geography"],
    id: "rus",
    name: "Russia",
    productLevels: ["Section", "HS2", "HS4", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: [
      "/shapes/subnational_rus_districts.topojson",
      "/shapes/subnational_rus_regions.topojson"
    ],
    value: "subnational_rus",
    ...tradeMeasure
  },
  subnational_chn: {
    cube: "trade_s_chn_m_hs",
    geoLevels: ["Subnat Geography"],
    id: "chn",
    name: "China",
    productLevels: ["Section", "HS2", "HS4", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: ["/shapes/subnational_chn_provinces.topojson"],
    value: "subnational_chn",
    ...tradeMeasure
  },
  subnational_can: {
    cube: "trade_s_can_m_hs",
    currency: "CAD ",
    geoIcon: d => `/images/icons/subnational/can/flag_${d["Subnat Geography ID"]}.png`,
    geoLevels: ["Subnat Geography"],
    id: "can",
    name: "Canada",
    productLevels: ["Section", "HS2", "HS4", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: ["/shapes/subnational_can_provinces.topojson"],
    value: "subnational_can",
    ...tradeMeasure
  },
  subnational_gbr: {
    cube: "trade_s_gbr_m_hs",
    currency: "£",
    geoIcon: () => "/images/icons/country/country_gbr.png",
    geoLevels: ["Subnat Geography"],
    id: "gbr",
    name: "United Kingdom",
    port: true,
    productLevels: ["Section", "HS2", "HS4", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: ["/shapes/subnational_gbr_ports.topojson"],
    value: "subnational_gbr",
    ...tradeMeasure
  },
  subnational_jpn: {
    cube: "trade_s_jpn_m_hs",
    currency: "¥",
    geoLevels: ["Region", "Subnat Geography"],
    id: "jpn",
    name: "Japan",
    productLevels: ["Section", "HS2", "HS4", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: [
      "/shapes/subnational_jpn_regions.topojson",
      "/shapes/subnational_jpn_prefectures.topojson"
    ],
    value: "subnational_jpn",
    ...tradeMeasure
  },
  subnational_deu: {
    cube: "trade_s_deu_m_egw",
    currency: "€",
    geoIcon: d => `/images/icons/subnational/deu/flag_${d["Subnat Geography ID"]}.png`,
    geoLevels: ["Subnat Geography"],
    id: "deu",
    name: "Germany",
    productColor: d => colors.EGW1[d["EGW1 ID"]],
    productIcon: d => `/images/icons/egw/egw_${d["EGW1 ID"]}.svg`,
    productLevels: ["EGW1", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: ["/shapes/subnational_deu_regions.topojson"],
    value: "subnational_deu",
    ...tradeMeasure
  },
  subnational_zaf: {
    cube: "trade_s_zaf_m_hs",
    currency: "ZAR $",
    geoIcon: d => "/images/icons/country/country_zaf.png",
    geoLevels: ["Subnat Geography"],
    id: "zaf",
    name: "South Africa",
    port: true,
    productLevels: ["Section", "HS2", "HS4", "Product"],
    timeLevels: ["Year", "Quarter", "Month"],
    topojson: ["/shapes/subnational_zaf_ports.topojson"],
    value: "subnational_zaf",
    ...tradeMeasure
  }
};

const cubeSelector = Object.keys(cubes).map(d => cubes[d]);

const sitcLevels = ["Category", "Section", "Division", "Group", "Subgroup"];
const hsLevels = ["Section", "HS2", "HS4", "HS6"];
const cubeData = (a, b) => range(a, b).map(d => ({value: d, title: d})).reverse();

const hsCubes = {
  geoLevels: ["Exporter Country", "Importer Country"],
  productLevels: hsLevels,
  timeLevels: ["Year"]
};

const sitcCubes = {
  geoLevels: ["Exporter Country", "Importer Country"],
  productLevels: sitcLevels,
  timeLevels: ["Year"]
};

const datasets = [
  {...tradeMeasure, value: "hs92", cubeName: "trade_i_baci_a_92", title: "HS92", timeItems: cubeData(1995, 2018), productLevel: "HS6", ...hsCubes},
  {...tradeMeasure, value: "hs96", cubeName: "trade_i_baci_a_96", title: "HS96", timeItems: cubeData(1998, 2018), productLevel: "HS6", ...hsCubes},
  {...tradeMeasure, value: "hs02", cubeName: "trade_i_baci_a_02", title: "HS02", timeItems: cubeData(2003, 2018), productLevel: "HS6", ...hsCubes},
  {...tradeMeasure, value: "hs07", cubeName: "trade_i_baci_a_07", title: "HS07", timeItems: cubeData(2008, 2018), productLevel: "HS6", ...hsCubes},
  {...tradeMeasure, value: "hs12", cubeName: "trade_i_baci_a_12", title: "HS12", timeItems: cubeData(2012, 2018), productLevel: "HS6", ...hsCubes},
  {...tradeMeasure, value: "hs17", cubeName: "trade_i_baci_a_17", title: "HS17", timeItems: cubeData(2018, 2018), productLevel: "HS6", ...hsCubes},
  {...tradeMeasure, value: "sitc", cubeName: "trade_i_oec_a_sitc2", title: "SITC", timeItems: cubeData(1962, 2018), productLevel: "Subgroup", ...sitcCubes}
];

module.exports = {
  ...cubes,
  cubeSelector,
  datasets,
  productLabel: (d, lvl) => ["HS2", "HS4", "HS6"].includes(lvl)
    ? `${d[`${lvl} ID`]}`.slice(-lvl.slice(-1) * 1)
    : `${d[`${lvl} ID`]}`
};
