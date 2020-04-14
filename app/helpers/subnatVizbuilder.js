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

module.exports = {
  ...cubes,
  cubeSelector
};
