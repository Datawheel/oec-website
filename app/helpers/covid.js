import React  from "react";
import {Spinner} from "@blueprintjs/core";
import colors from "helpers/colors";

export const currencySign = {
  nacan: "C$",
  aschn: "$",
  eudeu: "€",
  asjpn: "¥",
  eurus: "$",
  euesp: "€",
  sabra: "$",
  eugbr: "£",
  nausa: "$",
  afzaf: "ZAR",
  askor: "$",
  asmys: "$",
  asphl: "$",
  euswe: "SEK",
  asind: "$"
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const subnatCubeMembers = [
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#1AB558",
    cube: "trade_s_bra_ncm_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "bra",
    level: "Country",
    parent_id: "sa",
    parent: "South America",
    product_category: "hs",
    title: "Brazil",
    value: "sabra"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#0068FF",
    cube: "trade_s_can_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "can",
    level: "Country",
    parent_id: "na",
    parent: "North America",
    product_category: "hs",
    title: "Canada",
    value: "nacan"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#C8140A",
    cube: "trade_s_chn_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "chn",
    level: "Country",
    parent_id: "as",
    parent: "Asia",
    product_category: "hs",
    title: "China",
    value: "aschn"
  },
  {
    avialablesDepth: ["EGW1", "Product"],
    color: "#BA12CC",
    cube: "trade_s_deu_m_egw",
    depthDict: {},
    label: "deu",
    level: "Country",
    parent_id: "eu",
    parent: "Europe",
    product_category: "egw",
    title: "Germany",
    value: "eudeu"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#C8140A",
    cube: "trade_s_jpn_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "jpn",
    level: "Country",
    parent_id: "as",
    parent: "Asia",
    product_category: "hs",
    title: "Japan",
    value: "asjpn"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#BA12CC",
    cube: "trade_s_rus_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "rus",
    level: "Country",
    parent_id: "eu",
    parent: "Europe",
    product_category: "hs",
    title: "Russia",
    value: "eurus"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#FFDA00",
    cube: "trade_s_zaf_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "zaf",
    level: "Country",
    parent_id: "af",
    parent: "Africa",
    product_category: "hs",
    title: "South Africa",
    value: "afzaf"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#BA12CC",
    cube: "trade_s_esp_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "esp",
    level: "Country",
    parent_id: "eu",
    parent: "Europe",
    product_category: "hs",
    title: "Spain",
    value: "euesp"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#BA12CC",
    cube: "trade_s_gbr_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "gbr",
    level: "Country",
    parent_id: "eu",
    parent: "Europe",
    product_category: "hs",
    title: "United Kingdom",
    value: "eugbr"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#0068FF",
    cube: "trade_s_usa_state_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "usa",
    level: "Country",
    parent_id: "na",
    parent: "North America",
    product_category: "hs",
    title: "United States",
    value: "nausa"
  },
  {
    avialablesDepth: ["Section", "HS2"],
    color: "#C8140A",
    cube: "trade_n_kor_m_hs",
    depthDict: {},
    label: "kor",
    level: "Country",
    parent_id: "as",
    parent: "Asia",
    product_category: "hs",
    title: "South Korea",
    value: "askor"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#C8140A",
    cube: "trade_n_mys_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "mys",
    level: "Country",
    parent_id: "as",
    parent: "Asia",
    product_category: "hs",
    title: "Malaysia",
    value: "asmys"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#C8140A",
    cube: "trade_n_phl_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "phl",
    level: "Country",
    parent_id: "as",
    parent: "Asia",
    product_category: "hs",
    title: "Philippines",
    value: "asphl"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#BA12CC",
    cube: "trade_n_swe_m_hs",
    depthDict: {
      HS6: "Product"
    },
    label: "swe",
    level: "Country",
    parent_id: "eu",
    parent: "Europe",
    product_category: "hs",
    title: "Sweden",
    value: "euswe"
  },
  {
    avialablesDepth: ["Product"],
    color: "#C8140A",
    cube: "trade_s_ind_m_pc",
    depthDict: {},
    label: "ind",
    level: "Country",
    parent_id: "as",
    parent: "Asia",
    product_category: "pc",
    title: "India",
    value: "asind"
  }

  /* COUNTRIES WITH NON UPDATED DATA
  {
    avialablesDepth: ["Section", "Division", "Group", "Product"],
    color: "#1AB558",
    cube: "trade_s_bol_m_sitc3",
    label: "bol",
    level: "Country",
    parent_id: "sa",
    parent: "South America",
    product_category: "sitc3",
    title: "Bolivia",
    value: "sabol"
  },
  {
    avialablesDepth: ["Section", "HS2", "HS4", "HS6"],
    color: "#1AB558",
    cube: "trade_s_ecu_m_hs",
    label: "ecu",
    level: "Country",
    parent_id: "sa",
    parent: "South America",
    product_category: "hs",
    title: "Ecuador",
    value: "saecu"
  },
  {
    avialablesDepth: ["Section", "HS2"],
    color: "#C8140A",
    cube: "trade_s_tur_m_hs",
    label: "tur",
    level: "Country",
    parent_id: "as",
    parent: "Asia",
    product_category: "hs",
    title: "Turkey",
    value: "astur"
  } */
];

export const productColor = d => colors.Section[d["Section ID"]];
export const productIcon = d => `/images/icons/hs/hs_${d["Section ID"]}.svg`;
export const productLevels = ["Section", "HS2", "HS4", "HS6"];

export const spinner = <Spinner size={Spinner.SIZE_SMALL} />;


