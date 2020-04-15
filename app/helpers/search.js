let profiles = [
  "country",
  "hs92",

  "bilateral-country/partner",
  "bilateral-country",
  "partner",

  "bilateral-product/reporter",
  "bilateral-product",
  "reporter"
];

const subtitles = {
  subnational_chn: "China",
  subnational_deu: "Germany",
  subnational_esp: "Spain",
  subnational_fra: "France",
  subnational_jpn: "Japan",
  subnational_rus: "Russia",
  subnational_usa_state: "United States",
  subnational_usa_district: "United States",
  subnational_gbr: "United Kingdom",
  subnational_can: "Canada",
  subnational_bra_municipality: "Brazil",
  subnational_tur: "Turkey",
  subnational_bol: "Bolivia",
  subnational_zaf: "South Africa",
  subnational_ecu: "Ecuador",
  subnational_bra_state: "Brazil",
  subnational_col: "Colombia",
  subnational_ind: "India"
};

profiles = profiles.concat(Object.keys(subtitles));

export const profileSearchConfig = {
  availableProfiles: profiles,
  columnOrder: profiles,
  columnTitles: {
    "bilateral-country/partner": "Country to Country",
    "bilateral-product/reporter": "Product in Country",
    "country": "Countries",
    "hs92": "Products",
    "services": "Services",
    "subnational_bra": "States/Provinces",
    "subnational_can": "States/Provinces",
    "subnational_chn": "States/Provinces",
    "subnational_col": "States/Provinces",
    "subnational_deu": "States/Provinces",
    "subnational_ecu": "States/Provinces",
    "subnational_esp": "States/Provinces",
    "subnational_fra": "States/Provinces",
    "subnational_ind": "States/Provinces",
    "subnational_jpn": "States/Provinces",
    "subnational_rus": "States/Provinces",
    "subnational_tur": "States/Provinces",
    "subnational_usa": "States/Provinces",
    "technology": "Technologies"
  },
  placeholder: "Explore World Trade",
  subtitleFormat: d => {
    const {slug} = d;
    return subtitles[slug] || d.memberHierarchy;
  }
};
