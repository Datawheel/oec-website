import colors from "./helpers/colors";
import style from "style.yml";
import {formatAbbreviate} from "d3plus-format";
import {mean} from "d3-array";

const bad = "#cf5555";
const good = "#3182bd";

/**
 * Finds a tooltip title based on a data point and order
 * @param {Object} d
 * @param {boolean} ascending
 */
function findTitle(d, ascending) {
  let categories = [
    "Product",
    "HS6",
    "HS4",
    "HS2",
    "Subclass",
    "Class",
    "Superclass",
    "Section",
    "Country",
    "Continent",
    "Service",
    "Parent Service",
    "Flow",
    "Trade Flow",
    "Organization"
  ];

  categories = ascending ? categories : categories.reverse();

  const firstAvailable = categories.find(h => h in d && !Array.isArray(d[h]));
  return firstAvailable ? d[firstAvailable] : "Multiple Items";
}

/**
 * Finds a color if defined in the color lookup.
 * @param {Object} d
 */
function findColor(d) {
  let detectedColors = [];
  if (this && this._filteredData) {
    detectedColors = Array.from(new Set(this._filteredData.map(findColor)));
  }

  if ("Section" in d && !Array.isArray(d.Section)) {
    return "Patent Share" in d ? colors["CPC Section"][`${d["Section ID"]}`] : colors.Section[`${d["Section ID"]}`];
  }

  if (detectedColors.length !== 1) {
    for (const key in colors) {
      if (`${key} ID` in d || key === "Continent" && "Continent" in d) {
        return colors[key][`${d[`${key} ID`]}`] || colors[key][`${d[key]}`] || colors.colorGrey;
      }
    }
  }
  return detectedColors[0] || colors.colorGrey;
}

/**
 * Finds a icon for legend.
 * @param {Object} d
 * @param {boolean} ascending
 */
function backgroundImage(d, ascending) {
  const options = {2: "export", 1: "import"};

  if (!ascending) {
    if ("Section ID" in d && !Array.isArray(d.Section) && "Patent Share" in d) {
      return `/images/icons/cpc/${d["Section ID"]}.png`;
    }
    else if ("Section ID" in d && !Array.isArray(d.Section)) {
      return `/images/icons/hs/hs_${d["Section ID"]}.png`;
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
      return "/images/icons/hs/hs_22.png";
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
    else if ("Section ID" in d && !Array.isArray(d.Section) && "Patent Share" in d) {
      return `/images/icons/cpc/${d["Section ID"]}.png`;
    }
    else if ("Section ID" in d && !Array.isArray(d.Section)) {
      return `/images/icons/hs/hs_${d["Section ID"]}.png`;
    }
    else {
      return "/images/icons/hs/hs_22.png";
    }
  }
}

const axisStyles = {
  barConfig: {
    stroke: "#15191F"
  },
  gridConfig: {
    stroke: "#15191F",
    strokeWidth: 1
  },
  labelConfig: {
    fontColor: () => "#FFFFFF",
    fontFamily: () => "'Source Sans Pro', sans-serif",
    fontSize: () => 12,
    fontWeight: () => 400
  },
  shapeConfig: {
    labelConfig: {
      fontColor: () => "#FFFFFF",
      fontFamily: () => "'Source Sans Pro', sans-serif",
      fontSize: () => 12,
      fontWeight: () => 400
    },
    stroke: "#15191F"
  },
  tickSize: 5,
  titleConfig: {
    fontColor: () => "#FFFFFF",
    fontFamily: () => "'Palanquin', sans-serif",
    fontSize: () => 18,
    fontWeight: () => 400
  }
};

export default {
  aggs: {
    "Trade Value Growth": d => d.length > 1 ? 0 : d[0],
    "Section ID": mean,
    "Flow ID": mean
  },
  backgroundConfig: {
    fill: "#383e44"
  },
  colorScaleConfig: {
    axisConfig: {
      labelOffset: true,
      labelRotation: false,
      shapeConfig: {
        labelConfig: {
          fontColor: () => "#ffffff",
          fontFamily: () => "'Source Sans Pro', sans-serif",
          fontSize: () => 12,
          fontWeight: () => 400
        },
        stroke: style["dark-1"]
      },
      titleConfig: {
        fontColor: () => "#ffffff",
        fontFamily: () => "'Palanquin', sans-serif",
        fontSize: () => 12,
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
        labelConfig: {
          fontSize: () => 16,
          fontColor: () => "#ffffff"
        },
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
  xConfig: axisStyles,
  yConfig: {...axisStyles, scale: "auto"},
  barPadding: 0,
  legendConfig: {
    label: "",
    shapeConfig: {
      height: () => 25,
      width: () => 25,
      backgroundImage: d => backgroundImage(d)
    }
  },
  layoutPadding: 1,
  legendTooltip: {
    title: d => {
      const title = findTitle(d, false);
      const bgColor = findColor(d);

      let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
      const imgUrl = backgroundImage(d, false);

      tooltip += `<div class="icon" style="background-color: ${bgColor}"><img src="${imgUrl}" /></div>`;
      tooltip += `<span>${title}</span>`;
      tooltip += "</div>";
      return tooltip;
    }
  },
  ocean: false,
  projection: "geoMiller",
  tiles: false,
  tooltipConfig: {
    title: d => {
      const title = findTitle(d, true);
      const bgColor = "Country" in d || "Organization" in d ? "transparent" : findColor(d);
      const imgUrl = backgroundImage(d, true);

      let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
      tooltip += `<div class="icon" style="background-color: ${bgColor}"><img src="${imgUrl}" /></div>`;
      tooltip += `<span>${title}</span>`;
      tooltip += "</div>";

      return tooltip;
    },
    tbody: d => {
      const tbodyData = [];
      // Look for IDs...
      let idVal = [];
      ["Section", "HS2", "HS4", "HS6"].forEach(id => {
        if (d[`${id} ID`]) {
          idVal = [`${id} ID`, `${d[`${id} ID`]}`];
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
      if (d["Trade Value Density"]) {
        tbodyData.push(["Trade Value Density", `${formatAbbreviate(d["Trade Value Density"])}`]);
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
      else if (d["Trade Value"]) {
        tbodyData.push(["Trade Value", `$${formatAbbreviate(d["Trade Value"])}`]);
      }
      if (d["Trade Value Growth"]) {
        tbodyData.push(["Trade Value Growth", `${formatAbbreviate(d["Trade Value Growth"] * 100)}%`]);
      }
      return tbodyData;
    },
    background: "#282f37",
    border: "1px solid #66737e",
    footerStyle: {
      "color": "#666",
      "fontFamily": () => "'Source Sans Pro', sans-serif",
      "font-size": "12px",
      "font-weight": "300",
      "padding-top": "5px",
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
      "-webkit-line-clamp": "3"
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
    "fontSize": () => 14,
    "text-transform": "uppercase"
  },
  titleConfig: {
    "fontColor": () => "#FFFFFF",
    "fontFamily": () => "'Palanquin', sans-serif",
    "fontSize": () => 16,
    "text-transform": "uppercase"
  },
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
      // strokeWidth: d => {
      //   const c = findColor(d);
      //   return [good, bad].includes(c) ? 1 : 0;
      // },
      strokeWidth: () => 2,
      strokeFill: () => "#212831",
      fill: findColor
    },
    fill: findColor,
    labelConfig: {
      fontSize: () => 13
    },
    Circle: {
      fill: d => d["Trade Value RCA"] >= -1 ? d["Trade Value RCA"] > 1 ? findColor(d) : "#b1bac6" : findColor(d)
    },
    Line: {
      curve: "monotoneX",
      stroke: d => findColor(d),
      strokeWidth: 3,
      strokeLinecap: "round"
    },
    Path: {
      fillOpacity: 1,
      strokeOpacity: 1
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
