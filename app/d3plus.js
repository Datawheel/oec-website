import colors from "./helpers/colors";
import style from "style.yml";
import {formatAbbreviate} from "d3plus-format";
import {mean} from "d3-array";
import {hsId} from "./helpers/formatters";
import sections from "./helpers/sections";

const bad = "#cf5555";
const good = "#3182bd";

/**
 * Finds a color if defined in the color lookup.
 * @param {Object} d
 */
function findColor(d, config = this) {
  let detectedColors = [];
  let isSectionHS = false;
  if (this && this._filteredData) {
    detectedColors = Array.from(new Set(this._filteredData.map(findColor)));
  }
  if (config && config._filteredData) isSectionHS = config._filteredData.some(d => sections.hsSections.includes(d.Section));

  if ("Section" in d && !["HS2", "HS4", "HS6"].some(k => Object.keys(d).includes(k))) return colors[isSectionHS ? "Section" : "SITC Section"][d["Section ID"]] || colors.colorGrey;
  if ("Section" in d && !Array.isArray(d.Section)) {
    return "Patent Share" in d
      ? colors["CPC Section"][`${d["Section ID"]}`]
      : colors.Section[`${d["Section ID"]}`];
  }

  if (detectedColors.length !== 1) {
    for (const key in colors) {
      if (`${key} ID` in d || key in d || key === "Continent" && "Continent" in d) {
        return colors[key][d[`${key} ID`]] || colors[key][d[key]] || colors.colorGrey;
      }
    }
  }
  return detectedColors[0] || colors.colorGrey;
}

/**
 * New function for finding a icon for legend.
 * @param {*} d
 */
export const backgroundImageV2 = (key, d) => {
  const options = {2: "export", 1: "import"};
  switch (key) {
    case "Continent":
      return `/images/icons/country/country_${d["Continent ID"]}.png`;
    case "Country":
      if (Array.isArray(d["Country ID"])) {
        return `/images/icons/country/country_${d["Continent ID"]}.png`;
      }
      else {
        return `/images/icons/country/country_${d["ISO 3"] || d["Country ID"].slice(2, 5)}.png`;
      }
    case "Flow":
    case "Trade Flow":
      return `/images/icons/balance/${options[d[`${key} ID`]]}_val.png`;
    case "Organization":
      return "/images/icons/patent.png";
    case "Section":
      return `/images/icons/hs/hs_${d["Section ID"]}.svg`;
    case "SITC Section":
      return `/images/icons/sitc/sitc_${d["Section ID"]}.svg`;
    case "EGW1":
      return `/images/icons/egw/egw_${d["EGW1 ID"]}.svg`;
    case "Level 1":
      return `/images/icons/cpf/cpf_${d["Level 1 ID"]}.svg`;
    case "Service":
    case "Parent Service":
      return `/images/icons/service/service_${[d[`${key} ID`]]}.png`;
    default:
      return "/images/icons/hs/hs_22.svg";
  }
};

/** */
export const findColorV2 = (key, d) => {
  if (key === "Country" || key === "ISO 3") {
    if (!Array.isArray(d["Country ID"])) return "transparent";
    else return colors.Continent[d["Continent ID"]];
  }
  const id = key === "SITC Section" ? d["Section ID"] : d[`${key} ID`];
  const palette = colors[key];
  return palette ? colors[key][id] || colors[key][d[key]] || colors.colorGrey : colors.colorGrey;
};

/**
 * Finds a icon for legend.
 * @param {Object} d
 * @param {boolean} ascending
 */
function backgroundImage(d, ascending) {
  const options = {2: "export", 1: "import"};

  if (!ascending) {
    if ("Section ID" in d && !["HS2", "HS4", "HS6"].some(k => Object.keys(d).includes(k))) {
      return `/images/icons/sitc/sitc_${d["Section ID"]}.svg`;
    }
    if ("Section ID" in d && !Array.isArray(d.Section) && "Patent Share" in d) {
      return `/images/icons/cpc/${d["Section ID"]}.png`;
    }
    else if ("Section ID" in d && !Array.isArray(d.Section)) {
      return `/images/icons/hs/hs_${d["Section ID"]}.svg`;
    }
    else if ("EGW1 ID" in d && !Array.isArray(d.EGW1)) {
      return `/images/icons/egw/egw_${d["EGW1 ID"]}.svg`;
    }
    else if ("Level 1 ID" in d && !Array.isArray(d["Level 1"])) {
      return `/images/icons/cpf/cpf_${d["Level 1 ID"]}.svg`;
    }
    else if ("Continent ID" in d && !Array.isArray(d.Continent)) {
      return `/images/icons/country/country_${d["Continent ID"]}.png`;
    }
    else if ("Parent Service ID" in d && !Array.isArray(d["Parent Service"])) {
      return `/images/icons/service/service_${[d["Parent Service ID"]]}.png`;
    }
    else if ("Service ID" in d && !Array.isArray(d.Service)) {
      return `/images/icons/service/service_${[d["Service ID"]]}.png`;
    }
    else if ("Trade Flow ID" in d && !Array.isArray(d["Trade Flow"])) {
      return `/images/icons/balance/${options[d["Trade Flow ID"]]}_val.png`;
    }
    else if ("Flow ID" in d && !Array.isArray(d.Flow)) {
      return `/images/icons/balance/${options[d["Flow ID"]]}_val.png`;
    }
    else if ("Organization ID" in d && !Array.isArray(d.Organization)) {
      return "/images/icons/patent.png";
    }
    else if ("Country ID" in d && !Array.isArray(d.Country)) {
      return `/images/icons/country/country_${d["ISO 3"] || d["Country ID"].slice(2, 5)}.png`;
    }
    else {
      return "/images/icons/hs/hs_22.svg";
    }
  }
  else {
    if ("Country ID" in d && !Array.isArray(d.Country)) {
      return `/images/icons/country/country_${d["ISO 3"] || d["Country ID"].slice(2, 5)}.png`;
    }
    else if ("Organization ID" in d && !Array.isArray(d.Organization)) {
      return "/images/icons/patent.png";
    }
    else if ("Flow ID" in d && !Array.isArray(d.Flow)) {
      return `/images/icons/balance/${options[d["Flow ID"]]}_val.png`;
    }
    else if ("Trade Flow ID" in d && !Array.isArray(d["Trade Flow"])) {
      return `/images/icons/balance/${options[d["Trade Flow ID"]]}_val.png`;
    }
    else if ("Parent Service ID" in d && !Array.isArray(d["Parent Service"])) {
      return `/images/icons/service/service_${[d["Parent Service ID"]]}.png`;
    }
    else if ("Service ID" in d && !Array.isArray(d.Service)) {
      return `/images/icons/service/service_${[d["Service ID"]]}.png`;
    }
    else if ("Continent ID" in d && !Array.isArray(d.Continent)) {
      return `/images/icons/country/country_${d["Continent ID"]}.png`;
    }
    else if ("EGW1 ID" in d && !Array.isArray(d.EGW1)) {
      return `/images/icons/egw/egw_${d["EGW1 ID"]}.svg`;
    }
    else if ("Level 1 ID" in d && !Array.isArray(d["Level 1"])) {
      return `/images/icons/cpf/cpf_${d["Level 1 ID"]}.svg`;
    }
    else if ("Section ID" in d && !["HS2", "HS4", "HS6"].some(k => Object.keys(d).includes(k))) {
      return `/images/icons/sitc/sitc_${d["Section ID"]}.svg`;
    }
    else if ("Section ID" in d && !Array.isArray(d.Section) && "Patent Share" in d) {
      return `/images/icons/cpc/${d["Section ID"]}.png`;
    }
    else if ("Section ID" in d && !Array.isArray(d.Section)) {
      return `/images/icons/hs/hs_${d["Section ID"]}.svg`;
    }
    else {
      return "/images/icons/hs/hs_22.svg";
    }
  }
}

export const tooltipTitle = (bgColor, imgUrl, title) => {
  let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
  tooltip += `<div class="icon" style="background-color: ${bgColor}"><img src="${imgUrl}" /></div>`;
  tooltip += `<div class="title"><span>${title}</span></div>`;
  tooltip += "</div>";
  return tooltip;
};

const labelStyle = {
  fontColor: () => style["light-3"],
  fontFamily: () => "'Source Sans Pro', sans-serif",
  fontSize: () => 16,
  fontWeight: () => 400
};

const axisStyles = {
  barConfig: {
    stroke: "transparent"
  },
  gridConfig: {
    stroke: d => Math.abs(d.id) === 0 ? style["light-3"] : style["dark-3"],
    strokeWidth: 1
  },
  labelConfig: labelStyle,
  shapeConfig: {
    labelConfig: labelStyle,
    stroke: d => Math.abs(d.id) === 0 ? style["light-3"] : style["dark-3"]
  },
  tickSize: 5,
  titleConfig: {
    fontColor: () => style["light-3"],
    fontFamily: () => "'Palanquin', sans-serif",
    fontSize: () => 20,
    fontWeight: () => 400
  }
};

export default {
  aggs: {
    "Trade Value Growth": d => d.length > 1 ? 0 : d[0],
    "Section ID": mean,
    "EGW1 ID": mean,
    "Flow ID": mean
  },
  backConfig: {
    fontColor: () => style["light-3"],
    fontFamily: () => "'Palanquin', sans-serif",
    fontSize: () => 20,
    fontWeight: () => 400
  },
  backgroundConfig: {
    fill: style["dark-2"]
  },
  colorScaleConfig: {
    axisConfig: {
      labelOffset: true,
      shapeConfig: {
        labelConfig: labelStyle,
        stroke: style["dark-1"]
      },
      titleConfig: {
        fontColor: () => "#ffffff",
        fontFamily: () => "'Palanquin', sans-serif",
        fontSize: () => 16,
        fontWeight: () => 400
      },
      barConfig: {
        stroke: "white"
      },
      tickFormat: d => formatAbbreviate(d)
    },
    color: colors.viridis,
    legendConfig: {
      shapeConfig: {
        labelConfig: labelStyle,
        fontColor: () => "#ffffff",
        height: () => 15,
        stroke: "#383e44",
        width: () => 15
      }
    },
    rectConfig: {
      stroke: style["dark-1"]
    }
  },
  colorScaleMaxSize: 800,
  xConfig: axisStyles,
  yConfig: {...axisStyles, scale: "auto"},
  y2Config: {...axisStyles, scale: "auto"},
  barPadding: 0,
  layoutPadding: 1,
  legendConfig: {
    label: "",
    shapeConfig: {
      height: () => 25,
      width: () => 25,
      backgroundImage(d, i, x) {
        // const parentName = this._groupBy[0](d);
        // let parent = Object.entries(d).find(h => h[1] === parentName) || [undefined];
        // let parentId = parent[0];
        // if (parentId.includes(" ID")) {
        //   parentId = parentId.slice(0, -3);
        //   parent = Object.entries(d).find(h => h[0] === parentId) || [undefined];
        // }
        return backgroundImage(d);
      }
    }
  },
  legendTooltip: {
    title(d) {
      const parentName = this._groupBy[0](d);
      let parent = Object.entries(d).find(h => h[1] === parentName) || [undefined];
      let parentId = parent[0];
      if (parentId.includes(" ID")) {
        parentId = parentId.slice(0, -3);
        parent = Object.entries(d).find(h => h[0] === parentId) || [undefined];
      }
      let itemBgImg = Array.isArray(parent[1]) ? "WildCard" : parentId;
      if (itemBgImg === "Section" && !["HS2", "HS4", "HS6"].find(h => Object.keys(d).includes(h)) && !sections.hsSections.includes(Object.entries(d).find(h => h[0] === "Section")[1])) itemBgImg = "SITC Section";

      const title = Array.isArray(parent[1]) ? "Multiple Items" : parent[1];
      const bgColor = findColorV2(itemBgImg, d);
      const imgUrl = backgroundImageV2(itemBgImg, d);

      return tooltipTitle(bgColor, imgUrl, title);
    }
  },
  ocean: false,
  projection: "geoMiller",
  tiles: false,
  titleConfig: {
    "fontColor": () => "#FFFFFF",
    "fontFamily": () => "'Palanquin', sans-serif",
    "fontSize": () => 16,
    "text-transform": "uppercase"
  },
  tooltipConfig: {
    title(d, i, x) {
      const len = this._groupBy.length;
      const parentName = this._groupBy[0](d);
      let parent = Object.entries(d).find(h => h[1] === parentName) || [undefined];
      let parentId = parent[0];
      if (parentId.includes(" ID")) {
        parentId = parentId.slice(0, -3);
        parent = Object.entries(d).find(h => h[0] === parentId) || [undefined];
      }
      const itemName = this._groupBy[len - 1](d);
      let item = Object.entries(d).find(h => h[1] === itemName) || [undefined];
      let itemId = item[0];
      if (itemId.includes(" ID")) {
        itemId = itemId.slice(0, -3);
        item = Object.entries(d).find(h => h[0] === itemId) || [undefined];
      }
      if (itemId === "ISO 3") {
        itemId = "Country";
        item = Object.entries(d).find(h => h[0] === itemId) || [undefined];
      }
      if (itemId === "id") {
        itemId = "HS4";
        item = Object.entries(d).find(h => h[0] === itemId) || [undefined];
      }

      const title = Array.isArray(item[1]) ? `Other ${parent[1] || "Values"}` : item[1];
      let itemBgImg = ["Country", "Organization"].includes(itemId) ? itemId : parentId;

      if (itemBgImg === "Section" && !["HS2", "HS4", "HS6"].includes(itemId) && !sections.hsSections.includes(Object.entries(d).find(h => h[0] === "Section")[1])) itemBgImg = "SITC Section";
      const imgUrl = backgroundImageV2(itemBgImg, d);
      const bgColor = findColorV2(itemBgImg, d);

      return tooltipTitle(bgColor, imgUrl, title);
    },
    tbody: (d, i, x) => {
      const tbodyData = [];
      // Look for IDs...
      let idVal = [];
      ["Section", "HS2", "HS4", "HS6"].forEach(id => {
        if (d[`${id} ID`]) {
          idVal = [`${id} ID`, hsId(d[`${id} ID`])];
        }
      });
      if (idVal.length) {
        tbodyData.push(idVal);
      }
      // time...
      if (d.Month && !isNaN(d.Month)) {
        const formatter = new Intl.DateTimeFormat("en", {month: "short"});
        const thisMonthAsDate = new Date(d.Month.substr(0, 4), d.Month.substr(4, 6), "01");
        const month = formatter.format(thisMonthAsDate);
        const year = thisMonthAsDate.getFullYear();
        tbodyData.push(["Month", `${month}, ${year}`]);
      }
      // Look for measures...
      if (d["Trade Value RCA"]) {
        tbodyData.push(["Trade Value RCA", `${formatAbbreviate(d["Trade Value RCA"])}`]);
      }
      if (d["Trade Value Relatedness"]) {
        tbodyData.push(["Trade Value Relatedness", `${formatAbbreviate(d["Trade Value Relatedness"])}`]);
      }
      if (d.shareDelta) {
        tbodyData.push(["Market Share ∆", `${formatAbbreviate(d.shareDelta * 100)}%`]);
        tbodyData.push([`Market Share ${d.Year + 1}`, `${formatAbbreviate(d.currYearShare * 100)}%`]);
        tbodyData.push([`Market Share ${d.Year}`, `${formatAbbreviate(d.prevYearShare * 100)}%`]);
      }
      else if (d.growthDelta) {
        tbodyData.push(["Delta", `${formatAbbreviate(d.growthDelta * 100)}%`]);
        tbodyData.push(["Total 2017", `${formatAbbreviate(d.currYear)}`]);
        tbodyData.push(["Total 2016", `${formatAbbreviate(d.prevYear)}`]);
      }
      if (d["Trade Value"]) {
        tbodyData.push(["Trade Value", `$${formatAbbreviate(d["Trade Value"])}`]);
      }
      if (d["Trade Value Growth"]) {
        tbodyData.push(["Trade Value Growth", `${formatAbbreviate(d["Trade Value Growth"] * 100)}%`]);
      }
      if (d["Trade Value Growth Value"]) {
        tbodyData.push(["Trade Value Growth Value", `$${formatAbbreviate(d["Trade Value Growth Value"])}`]);
      }
      if (x && x[0] && x[0].__data__.share) {
        tbodyData.push(["Percent", `${formatAbbreviate(x[0].__data__.share * 100)}%`]);
      }
      if (d.Year && d.Year < 3000) {
        tbodyData.push(["Year", d.Year]);
      }
      return tbodyData;
    },
    background: "#282f37",
    border: "1px solid #66737e",
    footerStyle: {
      "color": style["light-2"],
      "fontFamily": () => "'Source Sans Pro', sans-serif",
      "font-size": "12px",
      "font-weight": "600",
      "padding-bottom": "5px",
      "padding-top": "0",
      "text-align": "center"
    },
    padding: "0px",
    titleStyle: {
      "color": "#FFFFFF",
      "padding": "5px",
      "fontFamily": () => "'Source Sans Pro', sans-serif",
      "font-size": "16px",
      "font-weight": "600",
      "max-height": "100px",
      "overflow": "hidden",
      "text-overflow": "ellipsis",
      "display": "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": "4"
    },
    tbodyStyle: {
      color: "#FFFFFF"
    },
    width: "200px"
  },
  topojsonFill: style["dark-2"],
  topojsonFilter: d => d.id !== "ata",
  total: "Trade Value",
  totalConfig: {
    "fontColor": () => "#FFFFFF",
    "fontFamily": () => "'Source Sans Pro', sans-serif",
    "fontSize": () => 18,
    "text-transform": "uppercase"
  },
  totalFormat(d) {
    if (
      this._filteredData &&
      this._filteredData[0] &&
      (this._filteredData[0]["Trade Value"] || this._filteredData[0]["Service Value"])) {
      return `Total: $${formatAbbreviate(d)}`;
    }
    return `Total: ${formatAbbreviate(d)}`;
  },
  linkSize: d => d.strength + 1,
  linkSizeMin: 0,
  linkSizeScale: "identity",
  shapeConfig: {
    Area: {
      strokeWidth: d => {
        const c = findColor(d);
        return [good, bad].includes(c) ? 1 : 0;
      }
    },
    Bar: {
      labelConfig: {
        fontSize: () => 13
      },
      strokeWidth: () => 1,
      stroke: () => style["dark-3"],
      fill: findColor
    },
    fill: findColor,
    labelConfig: {
      fontSize: () => 13
    },
    Circle: {
      fill: d => d["Trade Value RCA"] >= -1 ? d["Trade Value RCA"] > 1 ? findColor(d) : "#b1bac6" : findColor(d),
      strokeWidth: () => 1,
      stroke: () => style["dark-3"]
    },
    Line: {
      curve: "monotoneX",
      stroke(d) {
        return findColor(d, this);
      },
      strokeWidth: 3,
      strokeLinecap: "round"
    },
    Path: {
      activeStyle: {
        stroke: () => "#ccc"
      },
      fillOpacity: 1,
      strokeOpacity: 1,
      stroke: () => "#56636e"
    },
    Rect: {
      labelConfig: {
        fontResize: true,
        fontFamily: () => "'Source Sans Pro', sans-serif",
        padding: 10
      }
    }
  },
  timelineConfig: axisStyles
};
