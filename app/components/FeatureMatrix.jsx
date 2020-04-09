import React, {Component, Fragment} from "react";
import {nest} from "d3-collection";
import CheckoutButton from "components/CheckoutButton";
import "./FeatureMatrix.css";

import {Icon, Tooltip} from "@blueprintjs/core";

const groups = [
  "Content and Data Provision",
  "Advanced Analytics",
  "Access and Support"
];

const features = [
  {
    title: "Yearly Global Trade data (HS 6 digit and SITC 4 digit)",
    group: 0,
    tooltip: "Yearly SITC classification data by UN COMTRADE (2001-2017). Historical SITC classification data (1962-2000) by The Center for International Data from Robert Feenstra. HS classification (1995-2017) by BACI International Trade Database."
  },
  {
    title: "Monthly Global Trade Data ",
    group: 0
  },
  {
    title: "Subnational trade data (for selected countries)",
    group: 0,
    tooltip: "Currently serving China, Germany, and United States subnational data."
  },
  {
    title: "Patent Data (USPTO)",
    group: 0
  },
  {
    title: "Economic Complexity Index (ECI) Rankings",
    group: 1
  },
  {
    title: "Product Space by Country",
    group: 1
  },
  {
    title: "Subnational ECI Rankings",
    group: 1
  },
  {
    title: "Predictive Analysis on Bilateral Product Exports",
    group: 1
  },
  {
    title: "Users",
    group: 2
  },
  {
    title: "Customer Support",
    group: 2
  }
];

const versions = [
  {
    title: "Basic",
    price: "Free",
    features: [0, 4, 5, 8, 9],
    featureLookup: {
      8: "1",
      9: "Online"
    }
  },
  {
    title: "Pro",
    price: "Free",
    interval: "w/ verified e-mail",
    // price: "$24.99",
    // interval: "per month",
    buyText: "Upgrade",
    featureLookup: {
      8: "1",
      9: "Online"
    }
  },
  {
    title: "Enterprise",
    price: "Custom",
    buyText: "Contact Us",
    buyLink: "mailto:support@oec.world",
    featureLookup: {
      8: "Unlimited",
      9: "Dedicated Account Representative"
    }
  }
];

const featureGroups = nest()
  .key(d => d.group)
  .entries(features)
  .map(group => {
    group.key = groups[group.key];
    return group;
  });

export default class FeatureMatrix extends Component {

  render() {

    return (
      <div className="feature-matrix">
        <table>
          <thead>
            <tr>
              <th></th>
              {versions.map((version, i) => {
                const {interval, price, title} = version;
                const [priceMain, priceSuper] = price.split(".");
                return <th key={i}>
                  <span className="feature-version-title">{title}</span>
                  <span className="feature-version-price">{priceMain}<sup>{priceSuper}</sup></span>
                  { interval && <span className="feature-version-interval">{interval}</span> }
                </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {featureGroups.map((group, i) => <Fragment key={i}>
              <tr className="feature-group-title" key={i}>
                <td colSpan={versions.length + 1}>{group.key}</td>
              </tr>
              {group.values.map((feature, fi) => {
                const xi = features.indexOf(feature);
                return <tr key={fi}>
                  <td>
                    {feature.title}
                    { feature.tooltip && <sup>
                      <Tooltip content={feature.tooltip}>
                        <Icon icon="help" iconSize={12} />
                      </Tooltip>
                    </sup> }
                  </td>
                  {versions.map((version, vi) => <td key={vi}>
                    { version.featureLookup[xi]
                      ? version.featureLookup[xi]
                      : !version.features || version.features.includes(xi)
                        ? <Icon icon="tick-circle" iconSize={16} />
                        : null }
                  </td>)}
                </tr>;
              })}
            </Fragment>)}
            <tr>
              <td></td>
              {versions.map((version, vi) => <td key={vi}>
                {version.buyText
                  ? <CheckoutButton
                    className={version.title.toLowerCase()}
                    link={version.buyLink}
                    text={version.buyText}
                  />
                  : null}
              </td>)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}
