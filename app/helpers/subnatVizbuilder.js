const {range} = require("helpers/utils.js");
const colors = require("helpers/colors.js");
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
    name: "Spain",
    id: "esp",
    topojson: [
      "/shapes/subnational_esp_autonomous.topojson",
      "/shapes/subnational_esp_provinces.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["Autonomous Communities", "Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  },
  subnational_rus: {
    cube: "trade_s_rus_m_hs",
    name: "Russia",
    id: "rus",
    topojson: [
      "/shapes/subnational_rus_districts.topojson",
      "/shapes/subnational_rus_regions.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["District", "Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  },
  subnational_chn: {
    cube: "trade_s_chn_m_hs",
    name: "China",
    id: "chn",
    topojson: [
      "/shapes/subnational_chn_provinces.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  },
  subnational_can: {
    cube: "trade_s_can_m_hs",
    name: "Canada",
    id: "can",
    geoIcon: d => `/images/icons/subnational/can/flag_${d["Subnat Geography ID"]}.png`,
    currency: "CAD ",
    topojson: [
      "/shapes/subnational_can_provinces.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  },
  subnational_jpn: {
    cube: "trade_s_jpn_m_hs",
    name: "Japan",
    id: "jpn",
    currency: "¥",
    topojson: [
      "/shapes/subnational_jpn_regions.topojson",
      "/shapes/subnational_jpn_prefectures.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["Region", "Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  },
  subnational_deu: {
    cube: "trade_s_deu_m_egw",
    name: "Germany",
    id: "deu",
    currency: "€",
    topojson: [
      "/shapes/subnational_deu_regions.topojson"
    ],
    productColor: d => colors.EGW1[d["EGW1 ID"]],
    productIcon: d => `/images/icons/egw/egw_${d["EGW1 ID"]}.svg`,
    geoIcon: d => `/images/icons/subnational/deu/flag_${d["Subnat Geography ID"]}.png`,
    productLevels: ["EGW1", "Product"],
    geoLevels: ["Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
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
  geoLevels: ["Reporter Country", "Partner Country"],
  productLevels: sitcLevels,
  timeLevels: ["Year"]
};

const datasets = [
  {value: "hs92", cubeName: "trade_i_baci_a_92", title: "HS92", timeItems: cubeData(1995, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs96", cubeName: "trade_i_baci_a_96", title: "HS96", timeItems: cubeData(1998, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs02", cubeName: "trade_i_baci_a_02", title: "HS02", timeItems: cubeData(2003, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs07", cubeName: "trade_i_baci_a_07", title: "HS07", timeItems: cubeData(2008, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs12", cubeName: "trade_i_baci_a_12", title: "HS12", timeItems: cubeData(2012, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs17", cubeName: "trade_i_baci_a_17", title: "HS17", timeItems: cubeData(2018, 2018), productLevel: "HS6", ...hsCubes},
  {value: "sitc", cubeName: "trade_i_oec_a_sitc2", title: "SITC", timeItems: cubeData(1964, 2018), productLevel: "Subgroup", ...sitcCubes}
];

module.exports = {
  ...cubes,
  cubeSelector,
  datasets
};
