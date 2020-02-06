import React from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";

import countryData from "../../static/members/country.json";

import "./VbTitle.css";

class VbTitle extends React.Component {

  render() {
    const {
      routeParams,
      selectedItemsCountry,
      selectedItemsPartner,
      selectedItemsProduct,
      selectedItemsTechnology,
      t
    } = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;

    const _countryNames = selectedItemsCountry.map(d => d.title).join(", ");
    const _partnerNames = selectedItemsPartner.map(d => d.title).join(", ");
    const _productNames = selectedItemsProduct.map(d => d.title).join(", ");
    const _technologyNames = selectedItemsTechnology.map(d => d.title).join(", ");
    console.log(selectedItemsProduct);

    const isTrade = new RegExp(/(export|import)/).test(flow);
    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isGeoGrouping = new RegExp(/show/).test(partner);
    const isProduct = new RegExp(/^(?!(all|show)).*$/).test(viztype);

    const preps = {
      export: "to",
      import: "from",
      uspto: ""
    };

    let title = t("vb_title_what_country_flow", {country: _countryNames, flow, time});

    if (chart === "network") {
      // Titles for Network section
      const networkTitleParams = {country: _countryNames, time};
      const networkTitleOptions = {
        export: t("vb_title_network_rca", networkTitleParams),
        pgi: t("vb_title_network_pgi", networkTitleParams),
        relatedness: t("vb_title_network_relatedness", networkTitleParams)
      };

      title = networkTitleOptions[flow] || networkTitleOptions.export;
    }
    else if (chart === "rings") {
      title = t("vb_title_rings", {country: _countryNames, product: _productNames, time});
    }
    else if (isTrade) {
      // Titles for Trade charts
      if (!isCountry && isProduct) {
        title = t(
          "vb_title_which_countries_flow_product",
          {flow, product: _productNames, time}
        );
      }
      else if (isGeoGrouping) {
        title = t(
          "vb_title_where_country_flow",
          {country: _countryNames, flow, time, prep: preps[flow]}
        );
      }
      else if (isCountry && isPartner) {
        title = t(
          "vb_title_what_country_flow_partner",
          {country: _countryNames, partner: _partnerNames, flow, time}
        );
      }
      else if (isCountry && isProduct) {
        title = t(
          "vb_title_where_country_flow_product",
          {country: _countryNames, flow, time, product: _productNames, prep: preps[flow]}
        );
      }
    }
    else {
      // Titles for Technology charts
      if (isCountry) {
        title = t(
          "vb_title_what_country_patent",
          {country: _countryNames, time}
        );
      }
    }



    return (
      <div className="vb-title">
        <h1 className="title">{title}</h1>
      </div>
    );
  }
}

VbTitle.defaultProps = {
  routeParams: {}
};

export default withNamespaces()(VbTitle);
