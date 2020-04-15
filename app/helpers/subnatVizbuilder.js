const {range} = require("helpers/utils.js");

const cubes = {
  // subnat_fra: {
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
  // subnat_esp: {
  //   cube: "trade_s_esp_m_hs",
  //   name: "Spain",
  //   id: "esp",
  //   topojson: [
  //     "/shapes/subnational_esp_autonomous.topojson",
  //     "/shapes/subnational_esp_provinces.topojson"
  //   ],
  //   productLevels: ["Section", "HS2", "HS4", "Product"],
  //   geoLevels: ["Autonomous Communities", "Subnat Geography"],
  //   timeLevels: ["Year", "Quarter", "Month"]
  // },
  subnat_chn: {
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
  subnat_can: {
    cube: "trade_s_can_m_hs",
    name: "Canada",
    id: "chn",
    topojson: [
      "/shapes/subnational_can_provinces.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  },
  subnat_jpn: {
    cube: "trade_s_jpn_m_hs",
    name: "Japan",
    id: "jpn",
    topojson: [
      "/shapes/subnational_jpn_regions.topojson",
      "/shapes/subnational_jpn_prefectures.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["Region", "Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  },
  subnat_deu: {
    cube: "trade_s_deu_m_egw",
    name: "Germany",
    id: "deu",
    topojson: [
      "/shapes/subnational_deu_regions.topojson"
    ],
    productLevels: ["EGW1", "Product"],
    geoLevels: ["Subnat Geography"],
    timeLevels: ["Year", "Quarter", "Month"]
  }
};

const cubeSelector = Object.keys(cubes).map(d => cubes[d]);

const sitcLevels = ["Category", "Section", "Division", "Group", "Subgroup"];
const hsLevels = ["Section", "HS2", "HS4", "HS6"];
const cubeData = (a, b) => range(a, b).map(d => ({value: d, title: d}));

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
  {value: "hs92", cubeName: "trade_i_baci_a_92", title: "HS92", data: cubeData(1995, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs96", cubeName: "trade_i_baci_a_96", title: "HS96", data: cubeData(1998, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs02", cubeName: "trade_i_baci_a_02", title: "HS02", data: cubeData(2003, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs07", cubeName: "trade_i_baci_a_07", title: "HS07", data: cubeData(2008, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs12", cubeName: "trade_i_baci_a_12", title: "HS12", data: cubeData(2012, 2018), productLevel: "HS6", ...hsCubes},
  {value: "hs17", cubeName: "trade_i_baci_a_17", title: "HS17", data: cubeData(2018, 2018), productLevel: "HS6", ...hsCubes},
  {value: "sitc", cubeName: "trade_i_oec_a_sitc2", title: "SITC", data: cubeData(1964, 2018), productLevel: "Subgroup", ...sitcCubes}
];

module.exports = {
  ...cubes,
  cubeSelector,
  datasets
};
