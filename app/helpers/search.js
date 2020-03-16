const profiles = [
  "country",
  "hs92",
  "subnational_bra",
  "subnational_bra_municipality",
  "subnational_can",
  "subnational_chn",
  "subnational_col",
  "subnational_deu",
  "subnational_ecu",
  "subnational_esp",
  "subnational_fra",
  "subnational_ind",
  "subnational_jpn",
  "subnational_rus",
  "subnational_tur",
  "subnational_usa",
  "bilateral-country/partner",
  "bilateral-country",
  "partner",
  "bilateral-product/reporter",
  "bilateral-product",
  "reporter"
];

const subtitles = {
  subnational_bra: "Brazil",
  subnational_can: "Canada",
  subnational_chn: "China",
  subnational_col: "Colombia",
  subnational_deu: "Germany",
  subnational_ecu: "Ecuador",
  subnational_esp: "Spain",
  subnational_fra: "France",
  subnational_ind: "India",
  subnational_jpn: "Japan",
  subnational_rus: "Russia",
  subnational_tur: "Turkey",
  subnational_usa: "United States"
};

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
