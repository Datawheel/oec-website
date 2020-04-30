import {mean} from "d3-array";
import {Geomap} from "d3plus-react";
import React, {useMemo} from "react";
import {withNamespaces} from "react-i18next";
import {pickCombo} from "./mapcase";
import {dedupeArray} from "./toolbox";

/**
 * @typedef OwnProps
 * @property {TariffState["productLevel"]} productLevel
 * @property {TariffState["tariffDatums"]} tariffDatums
 * @property {TariffState["tariffMembers"]} tariffMembers
 */

/** @type {React.FC<import("react-i18next").WithNamespaces & OwnProps>} */
const TariffGeomap = props => {
  const {productLevel, tariffDatums, tariffMembers} = props;

  const config = useMemo(() => {
    const config = pickCombo({tariffDatums, tariffMembers, productLevel});

    /** @type {ChartConfig} */
    return {
      colorScale: "Tariff",
      data: tariffDatums,
      time: "Year",
      total: false,
      zoom: false,
      projectionRotate: [.25, 0, 0],
      ...config,
      aggs: {
        Agreement: list => dedupeArray(list).join("\n"),
        Tariff: list => mean(list)?.toFixed(2),
        [productLevel]: list => dedupeArray(list).join(", "),
        [`${productLevel} ID`]: list => dedupeArray(list).join(", "),
        ...config.aggs
      },
      axisConfig: {
        title: "Tariff",
        ...config.axisConfig
      },
      colorScaleConfig: {
        ...config.colorScaleConfig
      },
      tooltipConfig: {
        title: d => `From ${d["Partner Country"]} to ${d["Reporter Country"]}`,
        tbody: d => [
          ["Partner", d["Partner Country"]],
          ["Reported by", d["Reporter Country"]],
          [productLevel, d[productLevel]],
          [`${productLevel} ID`, d[`${productLevel} ID`]],
          ["Tariff", `${d.Tariff}%`],
          ["Agreements", d.Agreement],
          ["Year", d.Year]
        ],
        ...config.tooltipConfig
      },
      topojson: "/topojson/world-50m.json"
    };
  }, [tariffDatums, productLevel]);

  return <div className="tariff-geomap">
    <Geomap className="tariff-geomap-viz" config={config} />
  </div>;
};

export default withNamespaces()(TariffGeomap);
