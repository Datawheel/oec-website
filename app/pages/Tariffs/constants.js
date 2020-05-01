import colors from "helpers/colors";

export const tariffCubeName = "tariffs_i_wits_a_hs_new";

export const getCountryFlag = code => `/images/icons/country/country_${code.slice(-3)}.png`;

export const countryLevels = ["Continent", "Country"];
export const countryColor = [d => colors.Continent[d["Continent ID"]], () => ""];
export const countryIcon = [
  d => `/images/icons/country/country_${d["Continent ID"]}.png`,
  d => `/images/icons/country/country_${(d["Country ID"] || "xxx").slice(-3)}.png`
];

export const productLevels = ["Section", "HS2", "HS4", "HS6"];
export const productColor = d => colors.Section[d["Section ID"]];
export const productIcon = d => `/images/icons/hs/hs_${d["Section ID"]}.svg`;

export const countryConsts = {levels: countryLevels, getColor: countryColor, getIcon: countryIcon};
export const productConsts = {levels: productLevels, getColor: productColor, getIcon: productIcon};

/** @type {Record<string, HSLevel>} */
export const productDetail = {Section: "Section", HS2: "HS2", HS4: "HS4", HS6: "HS6"};

/** @type {Record<string, VizType>} */
export const vizTypes = {GEOMAP: "map", map: "map", TABLE: "table", table: "table"};
