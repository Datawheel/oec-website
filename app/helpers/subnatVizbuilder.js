const cubes = {
  subnat_fra: {
    cube: "trade_s_fra_q_cpf",
    name: "France",
    id: "fra",
    topojson: [
      "/shapes/subnational_fra_regions.topojson",
      "/shapes/subnational_fra_departments.topojson"
    ],
    productLevels: ["Product"],
    geoLevels: ["Region", "Subnat Geography"]
  },
  subnat_esp: {
    cube: "trade_s_esp_m_hs",
    name: "Spain",
    id: "esp",
    topojson: [
      "/shapes/subnational_esp_regions.topojson",
      "/shapes/subnational_esp_departments.topojson"
    ],
    productLevels: ["Section", "HS2", "HS4", "Product"],
    geoLevels: ["Autonomous Communities", "Subnat Geography"]
  }
};

const cubeSelector = Object.keys(cubes).map(d => cubes[d]);

module.exports = {
  ...cubes,
  cubeSelector
};
